import { Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface CodeTab {
  lang: 'HTML' | 'JS' | 'CSS';
  code: string;
}

function escapeHtml(code: string): string {
  return code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// Each highlighter is a single regex pass with alternation, so the markup it
// injects is never rescanned by a later pattern.
function highlightHtml(code: string): string {
  return escapeHtml(code).replace(
    /(&lt;!--[\s\S]*?--&gt;)|(&lt;\/?)([\w-]+)|([\w-]+)(=)("[^"]*")|^(\s+)([\w-]+)$/gm,
    (_, cmt, open, tag, attrName, eq, attrValue, boolWs, boolAttr) => {
      if (cmt) return `<i class="tok-cmt">${cmt}</i>`;
      if (open) return `${open}<i class="tok-tag">${tag}</i>`;
      if (attrName) return `<i class="tok-attr">${attrName}</i>${eq}<i class="tok-str">${attrValue}</i>`;
      return `${boolWs}<i class="tok-attr">${boolAttr}</i>`;
    });
}

function highlightCss(code: string): string {
  return escapeHtml(code).replace(
    /(\/\*[\s\S]*?\*\/)|^([^\n{:]+)(\{)|(--[\w-]+)(?=\s*:)|(--[\w-]+)|^(\s*)([a-z-]+)(?=\s*:)/gm,
    (m, cmt, sel, brace, propVar, valVar, ws, prop) => {
      if (cmt) return `<i class="tok-cmt">${cmt}</i>`;
      if (sel !== undefined) return `<i class="tok-tag">${sel}</i>${brace}`;
      if (propVar) return `<i class="tok-attr">${propVar}</i>`;
      if (valVar) return `<i class="tok-var">${valVar}</i>`;
      if (prop !== undefined) return `${ws}<i class="tok-attr">${prop}</i>`;
      return m;
    });
}

function highlightJs(code: string): string {
  return escapeHtml(code).replace(
    /(\/\/[^\n]*)|('[^']*'|`[^`]*`)|\b(const|let|new|true|false|document)\b|\.(createElement|append|addEventListener|toggleAttribute|setAttribute|className|selected|label|icon|dir)\b/g,
    (m, cmt, str, kw, member) => {
      if (cmt) return `<i class="tok-cmt">${cmt}</i>`;
      if (str) return `<i class="tok-str">${str}</i>`;
      if (kw) return `<i class="tok-kw">${kw}</i>`;
      if (member) return `.<i class="tok-fn">${member}</i>`;
      return m;
    });
}

@Component({
  selector: 'code-block',
  standalone: true,
  template: `
    <div class="head">
      <div class="tabs" role="tablist">
        @for (tab of tabs(); track tab.lang) {
          <button
            type="button"
            role="tab"
            [class.active]="tab.lang === activeTab()?.lang"
            [attr.aria-selected]="tab.lang === activeTab()?.lang"
            (click)="activeLang.set(tab.lang)"
          >{{ tab.lang }}</button>
        }
      </div>
      <button type="button" class="copy" (click)="copy()" [attr.aria-label]="copied() ? 'Copied' : 'Copy code'">
        <span aria-hidden="true">{{ copied() ? 'check' : 'content_copy' }}</span>
      </button>
    </div>
    <pre><code [innerHTML]="highlighted()"></code></pre>
  `,
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      padding: 10px 12px 0 14px;
    }

    .tabs {
      display: inline-flex;
      gap: 14px;
    }

    .tabs button {
      position: relative;
      border: 0;
      padding: 6px 2px 8px;
      color: color-mix(in srgb, var(--mat-sys-on-surface-variant), transparent 35%);
      background: transparent;
      font: 700 12px/1.4 'Motion Feldman Font';
      letter-spacing: 0.4px;
      cursor: pointer;
    }

    .tabs button:hover { color: var(--mat-sys-on-surface); }

    .tabs button.active {
      color: var(--mat-sys-primary);
    }

    .tabs button.active::after {
      content: '';
      position: absolute;
      inset: auto 0 0;
      height: 3px;
      border-radius: 3px 3px 0 0;
      background: var(--mat-sys-primary);
    }

    .copy {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: 10px;
      color: var(--mat-sys-on-surface-variant);
      background: var(--mat-sys-surface-container);
      cursor: pointer;
    }

    .copy:hover { background: var(--mat-sys-surface-container-high); }

    .copy span {
      font-family: 'Motion Material Symbols Rounded';
      font-size: 16px;
      font-feature-settings: 'liga';
    }

    pre {
      flex: 1;
      margin: 0;
      padding: 12px 18px 18px;
      overflow-x: auto;
      color: var(--mat-sys-on-surface);
      font: 500 12px/1.65 ui-monospace, SFMono-Regular, Consolas, monospace;
      white-space: pre;
      tab-size: 2;
    }

    code ::ng-deep i { font-style: normal; }
    code ::ng-deep .tok-tag { color: var(--code-tag, #82aaff); }
    code ::ng-deep .tok-attr { color: var(--code-attr, #c792ea); }
    code ::ng-deep .tok-str { color: var(--code-str, #c3e88d); }
    code ::ng-deep .tok-kw { color: var(--code-kw, #ffcb6b); }
    code ::ng-deep .tok-fn { color: var(--code-fn, #82aaff); }
    code ::ng-deep .tok-var { color: var(--code-var, #f78c6c); }
    code ::ng-deep .tok-cmt { color: var(--code-cmt, #7d7a85); }
  `,
})
export class CodeBlockComponent {
  readonly tabs = input.required<CodeTab[]>();
  readonly activeLang = signal<CodeTab['lang'] | null>(null);
  readonly copied = signal(false);

  #sanitizer = inject(DomSanitizer);
  #copyTimer: ReturnType<typeof setTimeout> | null = null;

  readonly activeTab = computed<CodeTab | undefined>(() => {
    const tabs = this.tabs();
    return tabs.find(tab => tab.lang === this.activeLang()) ?? tabs[0];
  });

  readonly highlighted = computed<SafeHtml>(() => {
    const tab = this.activeTab();
    if (!tab) return '';
    const html = tab.lang === 'HTML'
      ? highlightHtml(tab.code)
      : tab.lang === 'CSS'
        ? highlightCss(tab.code)
        : highlightJs(tab.code);
    return this.#sanitizer.bypassSecurityTrustHtml(html);
  });

  copy(): void {
    const tab = this.activeTab();
    if (!tab) return;
    navigator.clipboard?.writeText(tab.code);
    this.copied.set(true);
    if (this.#copyTimer) clearTimeout(this.#copyTimer);
    this.#copyTimer = setTimeout(() => this.copied.set(false), 1400);
  }
}

import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { setDefaultMotionLevel } from '../../../src/motion-button.js';
import { CodeBlockComponent, CodeTab } from './code-block.component';

type MotionLevel = 'none' | 'low' | 'medium' | 'high';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatToolbarModule,
    CodeBlockComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly darkTheme = signal(true);
  readonly page = signal<'demo' | 'about'>('demo');
  readonly motionLevel = signal<MotionLevel>('medium');
  readonly selected = signal(false);
  readonly buttonSelected = signal(false);
  readonly iconButtonSelected = signal(false);
  readonly verticalSelected = signal(false);
  readonly tonalSelected = signal(false);
  readonly hebrewButtonSelected = signal(false);
  readonly rtlSelected = signal(false);
  readonly trailingSelected = signal(false);
  readonly downloadState = signal(0);
  readonly downloadLabels = ['Download', 'Downloading…', 'Done'] as const;

  readonly snippets: Record<string, CodeTab[]> = {
    motionLevel: [
      {
        lang: 'CSS',
        code: `/* The site-wide default. Any control without its own
   motion-level inherits this via the --motion-level property. */
:root {
  --motion-level: low; /* none | low | medium | high */
}

/* Scope a different default to a subtree with a class */
.calm-section {
  --motion-level: none;
}`,
      },
      {
        lang: 'JS',
        code: `import { setDefaultMotionLevel } from 'motion-web';

// Change the default at runtime; controls re-resolve immediately.
setDefaultMotionLevel('high'); // none | low | medium | high

// Individual controls can still opt out with their own attribute:
// <motion-button motion-level="none"> keeps its value.`,
      },
      {
        lang: 'HTML',
        code: `<!-- A picker that drives the whole page default -->
<div role="radiogroup" aria-label="Motion level">
  <button onclick="setDefaultMotionLevel('none')">None</button>
  <button onclick="setDefaultMotionLevel('low')">Low</button>
  <button onclick="setDefaultMotionLevel('medium')">Medium</button>
  <button onclick="setDefaultMotionLevel('high')">High</button>
</div>`,
      },
    ],
    labelIcon: [
      {
        lang: 'HTML',
        code: `<motion-button
  label="Continue"
  icon="arrow_forward"
  width="150" height="48"
  font-size="16" icon-size="22"
></motion-button>`,
      },
      {
        lang: 'JS',
        code: `const button = document.createElement('motion-button');
button.label = 'Continue';
button.icon = 'arrow_forward';
button.addEventListener('click', () => {
  button.selected = !button.selected;
});
document.body.append(button);`,
      },
    ],
    iconOnly: [
      {
        lang: 'HTML',
        code: `<motion-button
  icon="favorite"
  width="48" height="48" icon-size="22"
  aria-label="Favorite"
></motion-button>`,
      },
      {
        lang: 'JS',
        code: `const button = document.createElement('motion-button');
button.icon = 'favorite';
button.setAttribute('aria-label', 'Favorite');
document.body.append(button);`,
      },
    ],
    vertical: [
      {
        lang: 'HTML',
        code: `<motion-button
  vertical
  label="Design"
  icon="palette"
  width="92" height="76"
  font-size="14" icon-size="24"
></motion-button>`,
      },
      {
        lang: 'JS',
        code: `const button = document.createElement('motion-button');
button.toggleAttribute('vertical', true);
button.label = 'Design';
button.icon = 'palette';
document.body.append(button);`,
      },
    ],
    tonal: [
      {
        lang: 'HTML',
        code: `<motion-button
  class="tonal"
  label="Tonal"
  icon="brush"
  width="130" height="48"
  font-size="16" icon-size="22"
></motion-button>`,
      },
      {
        lang: 'CSS',
        code: `.tonal {
  --motion-button-background: var(--mat-sys-secondary-container);
  --motion-button-color: var(--mat-sys-on-secondary-container);
  --motion-button-selected-background: var(--mat-sys-secondary);
  --motion-button-selected-color: var(--mat-sys-on-secondary);
}`,
      },
      {
        lang: 'JS',
        code: `const button = document.createElement('motion-button');
button.className = 'tonal';
button.label = 'Tonal';
button.icon = 'brush';
document.body.append(button);`,
      },
    ],
    hebrewButton: [
      {
        lang: 'HTML',
        code: `<div dir="rtl">
  <motion-button
    label="המשך"
    icon="arrow_back"
    width="150" height="48"
    font-size="16" icon-size="22"
  ></motion-button>
</div>`,
      },
      {
        lang: 'JS',
        code: `const wrapper = document.createElement('div');
wrapper.dir = 'rtl';
const button = document.createElement('motion-button');
button.label = 'המשך';
button.icon = 'arrow_back';
wrapper.append(button);
document.body.append(wrapper);`,
      },
    ],
    split: [
      {
        lang: 'HTML',
        code: `<motion-split-button
  label="Button"
  icon="add_circle"
  menu-icon="expand_more"
  height="48" font-size="16" icon-size="22"
></motion-split-button>`,
      },
      {
        lang: 'JS',
        code: `const split = document.createElement('motion-split-button');
split.label = 'Button';
split.icon = 'add_circle';
split.addEventListener('primary-action', () => {
  split.selected = !split.selected;
});
split.addEventListener('secondary-action', () => {
  // open your menu
});
document.body.append(split);`,
      },
    ],
    twoTone: [
      {
        lang: 'HTML',
        code: `<motion-split-button
  class="two-tone"
  label="Download"
  icon="download"
  height="48" font-size="16" icon-size="22"
></motion-split-button>`,
      },
      {
        lang: 'CSS',
        code: `.two-tone {
  --motion-split-primary-background: var(--mat-sys-primary);
  --motion-split-primary-color: var(--mat-sys-on-primary);
  --motion-split-primary-selected-background: var(--mat-sys-secondary);
  --motion-split-primary-selected-color: var(--mat-sys-on-secondary);
  --motion-split-secondary-background: var(--mat-sys-tertiary);
  --motion-split-secondary-color: var(--mat-sys-on-tertiary);
}`,
      },
      {
        lang: 'JS',
        code: `const split = document.createElement('motion-split-button');
split.className = 'two-tone';
split.label = 'Download';
split.icon = 'download';
split.addEventListener('primary-action', () => {
  split.label = 'Downloading…'; // width animates
});
document.body.append(split);`,
      },
    ],
    rtl: [
      {
        lang: 'HTML',
        code: `<div dir="rtl">
  <motion-split-button
    label="הורדה"
    icon="download"
    menu-icon="expand_more"
    height="48" font-size="16" icon-size="22"
  ></motion-split-button>
</div>`,
      },
      {
        lang: 'JS',
        code: `const wrapper = document.createElement('div');
wrapper.dir = 'rtl';
const split = document.createElement('motion-split-button');
split.label = 'הורדה';
split.icon = 'download';
wrapper.append(split);
document.body.append(wrapper);`,
      },
    ],
    trailing: [
      {
        lang: 'HTML',
        code: `<motion-split-button
  icon-trailing
  label="Next"
  icon="arrow_forward"
  menu-icon="expand_more"
  height="48" font-size="16" icon-size="22"
></motion-split-button>`,
      },
      {
        lang: 'JS',
        code: `const split = document.createElement('motion-split-button');
split.toggleAttribute('icon-trailing', true);
split.label = 'Next';
split.icon = 'arrow_forward';
document.body.append(split);`,
      },
    ],
  };

  toggleTheme(): void {
    const dark = !this.darkTheme();
    this.darkTheme.set(dark);
    document.documentElement.classList.toggle('dark-theme', dark);
    document.documentElement.classList.toggle('light-theme', !dark);
  }

  constructor() {
    // Set the site-wide default so every control without its own motion-level follows it.
    setDefaultMotionLevel(this.motionLevel());
  }

  setMotion(change: MatButtonToggleChange): void {
    const level = change.value as MotionLevel;
    this.motionLevel.set(level);
    setDefaultMotionLevel(level);
  }

  togglePrimary(): void {
    this.selected.update(selected => !selected);
  }

  toggleButton(): void {
    this.buttonSelected.update(selected => !selected);
  }

  toggleIconButton(): void {
    this.iconButtonSelected.update(selected => !selected);
  }

  cycleDownload(): void {
    this.downloadState.update(state => (state + 1) % this.downloadLabels.length);
  }

  toggleVertical(): void {
    this.verticalSelected.update(selected => !selected);
  }

  toggleTonal(): void {
    this.tonalSelected.update(selected => !selected);
  }

  toggleHebrewButton(): void {
    this.hebrewButtonSelected.update(selected => !selected);
  }

  toggleRtl(): void {
    this.rtlSelected.update(selected => !selected);
  }

  toggleTrailing(): void {
    this.trailingSelected.update(selected => !selected);
  }
}

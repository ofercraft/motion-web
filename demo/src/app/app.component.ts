import { CUSTOM_ELEMENTS_SCHEMA, Component, signal } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';

type MotionLevel = 'none' | 'low' | 'medium' | 'high';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatButtonToggleModule,
    MatCardModule,
    MatSlideToggleModule,
    MatToolbarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly darkTheme = signal(true);
  readonly motionLevel = signal<MotionLevel>('low');
  readonly lastAction = signal('Ready');

  setTheme(change: MatSlideToggleChange): void {
    this.darkTheme.set(change.checked);
    document.documentElement.classList.toggle('dark-theme', change.checked);
    document.documentElement.classList.toggle('light-theme', !change.checked);
  }

  setMotion(change: MatButtonToggleChange): void {
    this.motionLevel.set(change.value as MotionLevel);
  }

  activate(action: 'Primary action' | 'More options'): void {
    this.lastAction.set(action);
  }
}

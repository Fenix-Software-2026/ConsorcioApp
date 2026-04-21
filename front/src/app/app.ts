import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Landing } from './shared/components/landing/landing';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landing, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
}

import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router'; 
import { filter } from 'rxjs/operators'; 
import { Footer } from './shared/components/footer/footer';
import { Navbar } from './shared/components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front');
  

  public showNavbar = signal(true);
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
     const isDashboard = event.url.includes('dashboard');
  const isOwner = event.url.includes('owner');
  this.showNavbar.set(!(isDashboard || isOwner));
});
  }
}
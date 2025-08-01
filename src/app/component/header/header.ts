import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isDarkMode = false;
  toggleDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = !this.isDarkMode;

      const body = document.body;
      if (this.isDarkMode) {
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
      }
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isDarkMode = localStorage.getItem('theme') === 'dark';
    }
    this.fetchTasks();
  }
  fetchTasks() {
    throw new Error('Method not implemented.');
  }
  

 
}

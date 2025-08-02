import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
import { SessionService } from '../../services/session';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule , CommonModule],
  templateUrl: './header.html',
})
export class HeaderComponent {
  isDarkMode = false;
  isSidebarOpen = true;
  isBrowser: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private sessionService: SessionService, // ✅ Use this
    private router: Router                  // ✅ And this
  ) {}



  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

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
    // Placeholder method
  }

  logout(): void {
    this.sessionService.logout();
    alert('🔓 Logged out successfully');
    this.router.navigate(['/login']);
  }
  
  
 
}

import { Component } from '@angular/core';
import { info } from 'node:console';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule , RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
    info: string | null = null;
  authService: any;
  router: any;


    getInformation(){
      this.info = 'Here is the requested information from the dashboard.'
    }


    logout() {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}

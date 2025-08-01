import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ToastrModule } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './component/header/header';
import { FooterComponent } from './component/footer/footer';
import { CalendarComponent } from './component/calendar/calendar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet , ToastrModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('crud1');

  isDarkMode = false;

toggleDarkMode() {
  this.isDarkMode = !this.isDarkMode;
  document.body.classList.toggle('bg-dark', this.isDarkMode);
  document.body.classList.toggle('text-white', this.isDarkMode);
}

}



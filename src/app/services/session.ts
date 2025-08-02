import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      this.setCookie('token', '', -1); // Expire the cookie
      console.log('👋 User logged out');
    }
  }
  
  setUsername(username: string) {
    throw new Error('Method not implemented.');
  }
  private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window !== 'undefined';
  }

  getToken(): string | null {
    if (this.isBrowser) {
      // Try sessionStorage
      const token = sessionStorage.getItem('token');
      if (token) return token;

      // Fallback to localStorage
      const localToken = localStorage.getItem('token');
      if (localToken) return localToken;

      // Fallback to cookies
      return this.getCookie('token');
    }
    return null;
  }

  setToken(token: string): void {
    if (this.isBrowser) {
      try {
        sessionStorage.setItem('token', token);
      } catch {
        try {
          localStorage.setItem('token', token);
        } catch {
          this.setCookie('token', token, 1); // expires in 1 day
        }
      }
    }
  }

  clearToken(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
      this.setCookie('token', '', -1); // expire cookie
    }
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    console.log('🔐 Checking login, token:', token);
    return !!token;
  }
  

  // Cookie helpers
  private getCookie(name: string): string | null {
    if (!this.isBrowser) return null;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
  }

  private setCookie(name: string, value: string, days: number): void {
    if (!this.isBrowser) return;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  }
}

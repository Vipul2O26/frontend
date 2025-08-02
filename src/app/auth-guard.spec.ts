import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth-guard';
import { Router } from '@angular/router';

describe('authGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }
        }
      ]
    });
  });

  it('should be created', () => {
    const executeGuard: CanActivateFn = (...params) =>
      TestBed.runInInjectionContext(() => authGuard(...params));

    expect(executeGuard).toBeTruthy();
  });
});

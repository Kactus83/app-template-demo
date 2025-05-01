import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailChangeService } from '../services/email-change.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'custom-email-change-confirm',
  templateUrl: './email-change-confirm.component.html',
  styleUrls: ['./email-change-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CustomEmailChangeConfirmComponent implements OnInit, OnDestroy {
  token: string = '';
  tokenDetected: boolean = false;
  message: string = '';
  error: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly redirectionDelay = 5000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private emailChangeService: EmailChangeService
  ) {}

  ngOnInit(): void {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.token = queryToken;
      this.tokenDetected = true;
      this.confirmEmailChange();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  confirmEmailChange(): void {
    if (!this.token) {
      this.error = 'Please enter a token.';
      return;
    }
    this.emailChangeService.confirmEmailChange(this.token)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Email changed successfully.';
          this.error = '';
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, this.redirectionDelay);
        },
        error: (err) => {
          this.error = err.error?.message || 'An error occurred during confirmation.';
          this.message = '';
        }
      });
  }
}

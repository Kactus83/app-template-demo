import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SecondaryEmailService } from '../services/secondary-email.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'custom-secondary-email-deletion-confirm',
  templateUrl: './secondary-email-deletion-confirm.component.html',
  styleUrls: ['./secondary-email-deletion-confirm.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CustomSecondaryEmailDeletionConfirmComponent implements OnInit, OnDestroy {
  token: string = '';
  tokenDetected: boolean = false;
  message: string = '';
  error: string = '';
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  private readonly redirectionDelay = 5000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private secondaryEmailService: SecondaryEmailService
  ) {}

  ngOnInit(): void {
    const queryToken = this.route.snapshot.queryParamMap.get('token');
    if (queryToken) {
      this.token = queryToken;
      this.tokenDetected = true;
      this.confirmDeletion();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  confirmDeletion(): void {
    if (!this.token) {
      this.error = 'Please enter a token.';
      return;
    }
    this.secondaryEmailService.confirmSecondaryEmailDeletion(this.token)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (res) => {
          this.message = res.message || 'Secondary email deletion confirmed successfully.';
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

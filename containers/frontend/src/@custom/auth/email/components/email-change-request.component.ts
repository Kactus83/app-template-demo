import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EmailChangeService } from '../services/email-change.service';

@Component({
  selector: 'custom-email-change-request',
  templateUrl: './email-change-request.component.html',
  styleUrls: ['./email-change-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class EmailChangeRequestComponent implements OnInit {
  emailChangeForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private emailChangeService: EmailChangeService) {
    this.emailChangeForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  requestEmailChange(): void {
    if (this.emailChangeForm.invalid) {
      return;
    }
    const newEmail = this.emailChangeForm.get('newEmail')?.value;
    this.emailChangeService.requestEmailChange(newEmail).subscribe({
      next: (res) => {
        this.alertType = 'success';
        this.alertMessage = res.message || 'Email change confirmation sent';
        this.showAlert = true;
      },
      error: (err) => {
        this.alertType = 'error';
        this.alertMessage = err.error?.message || 'An error occurred';
        this.showAlert = true;
      }
    });
  }
}

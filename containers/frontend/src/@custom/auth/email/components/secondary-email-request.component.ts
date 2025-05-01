import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { SecondaryEmailService } from '../services/secondary-email.service';

@Component({
  selector: 'custom-secondary-email-request',
  templateUrl: './secondary-email-request.component.html',
  styleUrls: ['./secondary-email-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class SecondaryEmailRequestComponent implements OnInit {
  secondaryEmailForm: FormGroup;
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private secondaryEmailService: SecondaryEmailService) {
    this.secondaryEmailForm = this.fb.group({
      secondaryEmail: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {}

  addSecondaryEmail(): void {
    if (this.secondaryEmailForm.invalid) {
      return;
    }
    const email = this.secondaryEmailForm.get('secondaryEmail')?.value;
    this.secondaryEmailService.addSecondaryEmail(email).subscribe({
      next: (res) => {
        this.alertType = 'success';
        this.alertMessage = res.message || 'Secondary email added successfully.';
        this.showAlert = true;
      },
      error: (err) => {
        this.alertType = 'error';
        this.alertMessage = err.error?.message || 'An error occurred while adding secondary email.';
        this.showAlert = true;
      }
    });
  }
}

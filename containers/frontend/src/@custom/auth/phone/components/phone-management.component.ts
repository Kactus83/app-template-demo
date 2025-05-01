import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PhoneService } from '../services/phone.service';
import { PhoneDto } from '../models/dto/phone.dto';
import { finalize } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'custom-phone-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink],
  templateUrl: './phone-management.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PhoneManagementComponent implements OnInit {
  phoneForm: FormGroup;
  phones: PhoneDto[] = [];
  showAlert: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' = 'success';

  constructor(private fb: FormBuilder, private phoneService: PhoneService, private router: Router) {
    this.phoneForm = this.fb.group({
      phoneNumber: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadPhones();
  }

  /**
   * Charge la liste des numéros de téléphone de l'utilisateur.
   */
  loadPhones(): void {
    this.phoneService.getAllPhones().subscribe({
      next: (res) => {
        this.phones = res.phones;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  /**
   * Ajoute un nouveau numéro de téléphone.
   */
  addPhone(): void {
    if (this.phoneForm.invalid) {
      return;
    }
    const dto = this.phoneForm.value;
    this.phoneService.addPhone(dto)
      .pipe(finalize(() => {
        this.phoneForm.reset();
        this.loadPhones();
      }))
      .subscribe({
        next: (res) => {
          this.alertType = 'success';
          this.alertMessage = res.message || 'Phone added successfully';
          this.showAlert = true;
        },
        error: (err) => {
          this.alertType = 'error';
          this.alertMessage = err.error?.message || 'An error occurred';
          this.showAlert = true;
        }
      });
  }

  /**
   * Lance la validation du numéro non vérifié en redirigeant vers la page dédiée.
   * Vous pouvez adapter cette méthode pour afficher un modal ou intégrer directement le micro‑composant de validation.
   * @param phone L'objet phone non vérifié.
   */
  validatePhone(phone: PhoneDto): void {
    // Par exemple, rediriger vers le composant de validation en passant l'id ou le numéro dans les query params
    this.router.navigate(['/auth/phone/validate'], { queryParams: { phoneNumber: phone.phoneNumber } });
  }

  /**
   * Supprime un numéro de téléphone.
   * @param id Identifiant du numéro.
   */
  deletePhone(id: number): void {
    this.phoneService.deletePhone(id).subscribe({
      next: (res) => {
        this.alertType = 'success';
        this.alertMessage = res.message || 'Phone deleted successfully';
        this.showAlert = true;
        this.loadPhones();
      },
      error: (err) => {
        this.alertType = 'error';
        this.alertMessage = err.error?.message || 'An error occurred';
        this.showAlert = true;
      }
    });
  }
}

import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ClassicAuthService } from '@custom/auth/classic-auth/services/classic-auth.service';
import { UserDto } from '@custom/common/models/dto/user.dto';

@Component({
  selector: 'custom-classic-auth-form',
  templateUrl: './classic-auth-form.component.html',
  styleUrls: ['./classic-auth-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule, MatButtonModule]
})
export class ClassicAuthFormComponent implements OnChanges {
  @Input() user!: UserDto;

  classicAuthForm: FormGroup;
  emailInputType: 'select' | 'input' = 'input';
  emailOptions: string[] = [];

  constructor(private fb: FormBuilder, private classicAuthService: ClassicAuthService) {
    this.classicAuthForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.user && this.user) {
      // Déterminer le type de contrôle pour l'email en fonction des données utilisateur
      const primary = this.user.email ? this.user.email.trim() : null;
      const secondary = this.user.secondaryEmail ? this.user.secondaryEmail.trim() : null;
      if (primary && secondary) {
        // L'utilisateur a deux emails, on utilise un select
        this.emailInputType = 'select';
        this.emailOptions = [primary, secondary];
        // Par défaut, on sélectionne le primaire
        this.classicAuthForm.patchValue({ email: primary });
      } else if (primary) {
        // Un seul email existant, on l'affiche en input pré-rempli (modifiable)
        this.emailInputType = 'input';
        this.classicAuthForm.patchValue({ email: primary });
      } else {
        // Aucun email, champ libre
        this.emailInputType = 'input';
        this.classicAuthForm.patchValue({ email: '' });
      }
    }
  }

  onSubmit(): void {
    if (this.classicAuthForm.invalid) {
      return;
    }
    const dto = this.classicAuthForm.value;
    this.classicAuthService.addClassicAuth(dto).subscribe({
      next: (updatedUser) => {
        // Vous pouvez émettre un événement ou afficher un message de succès
        console.log('Classic authentication added successfully', updatedUser);
      },
      error: (err) => {
        // Afficher l'erreur ou notifier l'utilisateur
        console.error('Error adding classic authentication', err);
      }
    });
  }
}

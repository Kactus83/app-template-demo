import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FuseCardComponent } from '@fuse/components/card';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';

@Component({
  selector: 'user-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FuseCardComponent,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './user-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit
{
  /** L’utilisateur courant, rempli au chargement */
  user!: User;

  constructor(private _userService: UserService) {}

  ngOnInit(): void
  {
    this._userService.get().subscribe((user: User) => {
        console.log("user : ", user);
        this.user = user;
    });
  }
}

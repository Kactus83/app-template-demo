import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'app/core/user/user.service';
import { UserDto } from '@custom/common/models/dto/user.dto';

@Component({
  selector: 'user-settings-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-settings-profile.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsProfileComponent implements OnInit {
  user!: UserDto;

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    this._userService.get().subscribe((u) => (this.user = u));
  }
}
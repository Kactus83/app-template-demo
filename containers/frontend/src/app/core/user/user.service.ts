import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from '../../../../environment';
import { UserDto } from '@custom/common/models/dto/user.dto';
import { User } from './user.types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _httpClient = inject(HttpClient);

  // On émet désormais des User (avec le champ name calculé)
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Stocke un User dans le ReplaySubject
   */
  set user(value: User) {
    this._user.next(value);
  }

  /**
   * Flux observable de User
   */
  get user$(): Observable<User> {
    console.log('user$', this._user);
    return this._user.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Récupère l'utilisateur connecté depuis l'API, calcule son name, et l'émet
   */
  get(): Observable<User> {
    return this._httpClient
      .get<UserDto>(`${environment.apiUrl}/user-management/user`)
      .pipe(
        map((dto) => this.toUser(dto)),
        tap((user) => this._user.next(user))
      );
  }

  /**
   * Met à jour l'utilisateur via PATCH, recalcule son name, et l'émet
   */
  update(userDto: UserDto): Observable<User> {
    return this._httpClient
      .patch<UserDto>(
        `${environment.apiUrl}/user-management/user`,
        { user: userDto }
      )
      .pipe(
        map((dto) => this.toUser(dto)),
        tap((user) => this._user.next(user))
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Helpers
  // -----------------------------------------------------------------------------------------------------

  /**
   * Transforme un UserDto en User en y ajoutant le champ name
   */
  private toUser(dto: UserDto): User {
    return {
      ...dto,
      // cast au type User pour satisfaire l'interface
      name: this.computeDisplayName(dto),
    } as User;
  }

  /**
   * Détermine le display name selon la priorité :
   * 1) firstName + lastName
   * 2) username
   * 3) email
   * 4) walletAddress (si présent dans le DTO)
   * 5) "Anonymous"
   */
  private computeDisplayName(dto: UserDto): string {
    if (dto.firstName && dto.lastName) {
      return `${dto.firstName} ${dto.lastName}`;
    }
    if (dto.username) {
      return dto.username;
    }
    if (dto.email) {
      return dto.email;
    }
    // Si le DTO contient un walletAddress (Web3), on l'utilise
    const wallet = (dto as any).walletAddress;
    if (typeof wallet === 'string' && wallet.length > 0) {
      return wallet;
    }
    // Fallback ultime
    return 'Anonymous';
  }
}

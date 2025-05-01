import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { environment } from '../../../../environment';
import { UserDto } from '@custom/common/models/dto/user.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
    private _httpClient = inject(HttpClient);
    private _user: ReplaySubject<UserDto> = new ReplaySubject<UserDto>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: UserDto) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<UserDto> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current signed-in user data
     */
    get(): Observable<UserDto> {
        return this._httpClient.get<UserDto>(`${environment.apiUrl}/user-management/user`).pipe(
            tap((user) => {
                this._user.next(user);
            })
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: UserDto): Observable<any> {
        return this._httpClient.patch<UserDto>(`${environment.apiUrl}/user-management/user`, { user }).pipe(
            map((response) => {
                this._user.next(response);
            })
        );
    }
}

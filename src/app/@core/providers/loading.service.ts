import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  public readonly state: Observable<boolean>;
  private _state: BehaviorSubject<boolean>;

  constructor() {
    this._state = new BehaviorSubject<boolean>(true);
    this.state = this._state.asObservable();
  }

  enable(): void {
    this._state.next(true);
  }

  disable(): void {
    this._state.next(false);
  }

}

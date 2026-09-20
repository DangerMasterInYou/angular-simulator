import { Colors } from './../enums/Color';
import { Collection } from '../collection/collection';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  users: Collection<string> = new Collection(['John', 'Yasha', 'Bibi']);
  digits: Collection<number> = new Collection([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  private _primaryColors: string[] = [Colors.RED, Colors.GREEN, Colors.BLUE];

  constructor() {
    this._setLastDateSignIn();
    this._setCountSignIn();
  }

  isPrimaryColor (color: string): boolean{
    return (this._primaryColors).includes(color);
  }

  private _setLastDateSignIn(): void {
    const toDay: string = new Date().toLocaleDateString('ru-RU');
    localStorage.setItem('lastDateSignIn', toDay)
  }

  private _setCountSignIn(): void {
    let countSignIn: number = Number(localStorage.getItem('countSignIn')) || 0;
    localStorage.setItem('countSignIn', (++countSignIn).toString());
  }

}

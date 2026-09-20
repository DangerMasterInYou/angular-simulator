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

  constructor() {
    this._setLastDateSignIn();
    this._setCountSignIn();
  }

  guideSubtitle: string = 'Исследуйте все горные массивы мира вместе с нами';
  guideDesc: string = `Его корни уходят в один фрагмент классической латыни 45 года
    н.э., то есть более двух тысячелетий назад. Ричард МакКлинток,
    профессор латыни из колледжа Hampden-Sydney, штат
    Вирджиния, взял одно из самых странных слов в Lorem Ipsum,
    "consectetur" и занялся его поисками в классической латинской
    литературе.`;

  isPrimaryColor (color: string): boolean{
    switch(color){
      case(Colors.RED):
      case(Colors.GREEN):
      case(Colors.BLUE):
        return true;
      default:
        return false;
    }
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

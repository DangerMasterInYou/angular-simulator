import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  FormsModule,
} from '@angular/forms';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import {
  Component,
  ViewChild,
  ViewChildren,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
  QueryList,
} from '@angular/core';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Locations, Participants } from '../services/enums/GuideProgramm';
import { InpSelComponent } from './components/inp-sel/inp-sel.component';
import { MY_DATE_FORMATS } from '../services/formats/date-formats';
import { IAdvantages } from '../services/interfaces/IAdvantages';

@Component({
  selector: 'app-root',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatIconModule,
    InpSelComponent,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    DatePipe,
    provideNgxMask(),
  ],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild('hiddenPicker') hiddenPicker!: MatDatepicker<Date>;
  @ViewChildren(InpSelComponent, { read: ElementRef })
  private inpSelRefs!: QueryList<ElementRef<HTMLElement>>;
  private locationTouched = false;
  private participantsTouched = false;

  companyName: string = 'РумТибет';
  preContentImgUrl: string = '/images/content/programm';
  locationInput: Locations | null = null;
  dateInput: string = '01.01.2001';
  locations: Locations[] = [...Object.values(Locations)];
  selectedLocation: Locations | null = null;
  selectedParticipants: Participants[] = [];
  participants: Participants[] = [...Object.values(Participants)];
  advantages: IAdvantages[] = [
    {
      id: 0,
      img_url: this.preContentImgUrl + '/guideMan.jpg',
      title: 'Опытный гид',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
    {
      id: 1,
      img_url: this.preContentImgUrl + '/shield.jpg',
      title: 'Безопасный поход',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
    {
      id: 2,
      img_url: this.preContentImgUrl + '/priceTag.jpg',
      title: 'Лояльные цены',
      description:
        'Для современного мира базовый вектор развития предполагает независимые способы реализации соответствующих условий активизации.',
    },
  ];
  searchForm = new FormGroup({
    date: new FormControl<string | null>(null, [
      Validators.required,
      validDateValidator,
    ]),
  });
  calendarControl = new FormControl<Date | null>(null);

  constructor(private datePipe: DatePipe) {
    this.calendarControl.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((date) => {
        if (date) {
          const formattedDate = this.datePipe.transform(date, 'dd.MM.yyyy')!;
          this.searchForm.controls.date.setValue(formattedDate, { emitEvent: false });
        } else {
          this.searchForm.controls.date.setValue('', { emitEvent: false });
        }
      });

    this.searchForm.controls.date.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((value) => {
        if (value && value.length === 10) {
          const parts = value.split('.');
          const day = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const year = parseInt(parts[2], 10);

          const parsedDate = new Date(year, month, day);

          if (!isNaN(parsedDate.getTime()) && parsedDate.getDate() === day) {
            this.calendarControl.setValue(parsedDate, { emitEvent: false });
          }
        } else if (!value) {
          this.calendarControl.setValue(null, { emitEvent: false });
        }
      });
  }

  @HostListener('document:focusout', ['$event'])
  onDocumentFocusOut(event: FocusEvent): void {
    const target = event.target as Node | null;
    if (!target) return;
    const next = event.relatedTarget as Node | null;

    const [locRef, partRef] = this.inpSelRefs?.toArray() ?? [];

    if (
      locRef &&
      locRef.nativeElement.contains(target) &&
      (!next || !locRef.nativeElement.contains(next))
    ) {
      this.locationTouched = true;
    }

    if (
      partRef &&
      partRef.nativeElement.contains(target) &&
      (!next || !partRef.nativeElement.contains(next))
    ) {
      this.participantsTouched = true;
    }
  }

  private get isLocationEmpty(): boolean {
    const v = this.selectedLocation as unknown;
    if (v == null) return true;
    if (Array.isArray(v)) return v.length === 0;
    if (typeof v === 'string') return v.trim() === '';
    return false;
  }

  get isFormValid(): boolean {
    return (
      this.searchForm.valid &&
      !this.isLocationEmpty &&
      Array.isArray(this.selectedParticipants) &&
      this.selectedParticipants.length > 0
    );
  }

  get isDateInvalid(): boolean {
    const c = this.searchForm.controls.date;
    return c.invalid && (c.dirty || c.touched);
  }

  get isLocationInvalid(): boolean {
    return this.isLocationEmpty && this.locationTouched;
  }

  get isParticipantsInvalid(): boolean {
    return (
      (!Array.isArray(this.selectedParticipants) ||
        this.selectedParticipants.length === 0) &&
      this.participantsTouched
    );
  }

  openCalendar() {
    this.hiddenPicker.open();
  }

  onSubmit() {
    if (!this.isFormValid) return;

    const payload = {
      date: this.searchForm.controls.date.value,
      location: this.selectedLocation,
      participants: this.selectedParticipants,
    };

    console.log(payload);
  }
}

export function validDateValidator(control: AbstractControl): ValidationErrors | null {
  const value: string | null = control.value;
  if (!value) return null;
  if (value.length !== 10) return { invalidDate: true };

  const [d, m, y] = value.split('.').map(Number);
  const date = new Date(y, m - 1, d);
  const isValid =
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d;

  return isValid ? null : { invalidDate: true };
}

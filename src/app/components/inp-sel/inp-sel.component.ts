import {
  Component, ElementRef, EventEmitter, HostListener, Input, Output,
  ChangeDetectionStrategy
} from '@angular/core';

type SelectValue<T> = T | T[] | null;

let uid = 0;

@Component({
  selector: 'inp-sel',
  templateUrl: './inp-sel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./inp-sel.component.scss'],
})
export class InpSelComponent<T extends string> {
  @Input() items: T[] = [];
  @Input() multiple = false;
  @Input() iconSrc = '/images/dropdown-icon.svg';
  @Input() placeholder = '';
  @Input() hint = 'выберите из списка';
  @Input() inputId = `inp-sel-${uid}-input`;
  @Input() selectId = `inp-sel-${uid}-select`;
  @Input() displayWith?: (item: T) => string;
  @Input() value: SelectValue<T> = null;

  @Output() valueChange = new EventEmitter<SelectValue<T>>();

  open = false;
  query = '';

  constructor(private readonly host: ElementRef<HTMLElement>) {++uid;}

  get filteredItems(): T[] {
    if (!this.query) return this.items;
    const q = this.query.toLowerCase();
    return this.items.filter(i => this.labelOf(i).toLowerCase().includes(q));
  }

  get selectSize(): number {
    return Math.max(2, Math.min(this.filteredItems.length, 8));
  }

  get inputValue(): string {
    return this.query || this.selectedText;
  }

  get selectedText(): string {
    if (Array.isArray(this.value)) {
      return this.value.map(v => this.labelOf(v)).join(', ');
    }
    return this.value != null ? this.labelOf(this.value) : '';
  }

  isSelected(item: T): boolean {
    if (this.multiple) return Array.isArray(this.value) && this.value.includes(item);
    return this.value === item;
  }

  toggle(): void {
    this.open = !this.open;
    if (!this.open) this.query = '';
  }

  onInput(text: string): void {
    this.query = text;

    if (!this.open) this.open = true;

    this.value = null;
    this.valueChange.emit(null)
  }

  onSelectChange(event: Event): void {
    const el = event.target as HTMLSelectElement;

    if (this.multiple) {
      const selected = Array.from(el.selectedOptions)
        .map(o => o.value as T)
        .filter(v => v !== '');
      this.value = selected;
      this.valueChange.emit(selected);
    } else {
      const v = (el.value || null) as SelectValue<T>;
      this.value = v;
      this.valueChange.emit(v);
      this.open = false;
    }

    this.query = '';
  }

  onSelectMousedown(event: MouseEvent): void {
    if(!this.multiple || event.ctrlKey || event.metaKey) return;

    const target = event.target as HTMLElement;
    if (target.tagName !== 'OPTION') return;

    event.preventDefault();

    const select = target.closest('select')!;
    const opt = target as HTMLOptionElement;
    opt.selected = !opt.selected;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
    }
  }

  labelOf(item: T): string {
    return this.displayWith ? this.displayWith(item) : String(item);
  }
}

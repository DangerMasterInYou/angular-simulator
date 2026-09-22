export class Collection<T> {

  private _items: T[] = [];

  constructor(items: T[]){
    this._items = [...items];
  }

  getAll(): T[] {
    return [...this._items];
  }

  getById(id: number): T {
    this._checkExistEl(id);
    return this._items[id];
  }

  clear(): void {
    this._items = [];
  }

  removeById(id: number): void {
    this._checkExistEl(id);
    this._items.splice(id, 1);
  }

  replace(id: number, newItem: T): void {
    if (id < 0 || id > this._items.length) {
      throw new Error(`Элемент по индексу ${id} не существует.`);
    }
    this._items.splice(id, 1, newItem);
  }

  private _checkExistEl(id: number): void {
    if (id < 0 || id >= this._items.length || this._items[id] == null)
      throw new Error(`Элемент по индексу ${id} не существует.`);
  }

}

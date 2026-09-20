export class Collection<T> {
  private _items: T[] = [];

  constructor(items: T[]){
    this._items = items;
  }

  private _checkExistEl(id: number): void {
    if(id < 0 || id >= this._items.length || this._items[id] == null)
      throw new Error(`Элемент по индексу ${id} не существует.`);
  }

  getAll(): T[] {
    console.log(this._items);
    return this._items;
  }

  getById(id: number): T {
    this._checkExistEl(id);
    console.log(this._items[id]);
    return this._items[id];
  }

  clear(): void {
    this._items = [];
    console.log(this._items);
  }

  removeById(id: number): void {
    this._checkExistEl(id);
    this._items.splice(id, 1);
    console.log(this._items[id-1]);
  }

  replace(id: number, newItem: T): void {
    if (!(id < 0)) this._items[id] = newItem;
    console.log(this._items[id]);
  }
}

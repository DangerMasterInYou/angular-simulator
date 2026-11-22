export interface IUser{
  name: string,
  age: number,
  isPotato?: boolean
}

export interface IStudent extends IUser{
  universityName: string
}

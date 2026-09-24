export interface IUser{
  name: string,
  age: number,
  isPotato?: boolean
}

interface IStudent extends IUser{
  universityName: string
}

function sum(a: number, b: number): number {
  return a + b;
}

function formatText(str: string, format: string): string {
  switch(format){
    case "uppercase":
      return str.toUpperCase();
    case "lowercase":
      return str.toLowerCase();
    case "capitalize":
      return str
        .trim()
        .split(/\s+/)
        .map((w:string) => {
          return w[0].toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(" ");
    default:
      throw new Error();
  }
}

function removeSymbol(str: string, s: string): string {
  if (s.length != 1) throw new TypeError();
  return str.replaceAll(s , "");
}

let uploadStatus: "loading" | "success" | "error";
let textFormat: "uppercase" | "lowercase" | "capitalize";
let users: IUser[] = [
  { name: "Adam", age: 9999999 },
  { name: "John", age: 0, isPotato: true },
]

users.sort((a, b) => a.age - b.age);
users.sort((a, b) => a.name.localeCompare(b.name));

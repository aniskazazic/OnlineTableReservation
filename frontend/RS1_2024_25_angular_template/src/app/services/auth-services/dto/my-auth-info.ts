// DTO to hold authentication information
export class MyAuthInfo {
  personID: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isWorker: boolean;
  isOwner: boolean;
  isLoggedIn: boolean;

  constructor(
    personID: number,
    email: string,
    firstName: string,
    lastName: string,
    isAdmin: boolean,
    isWorker: boolean = false,
    isOwner: boolean = false,
    isLoggedIn: boolean = true
  ) {
    this.personID = personID;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.isAdmin = isAdmin;
    this.isWorker = isWorker;
    this.isOwner = isOwner;
    this.isLoggedIn = isLoggedIn;
  }

  static fromJSON(json: any): MyAuthInfo {
    return new MyAuthInfo(
      json.personID,
      json.email,
      json.firstName,
      json.lastName,
      json.isAdmin,
      json.isWorker ?? false,
      json.isOwner ?? false,
      json.isLoggedIn ?? true
    );
  }
}

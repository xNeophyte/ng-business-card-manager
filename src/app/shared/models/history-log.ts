export enum Action {
  AddedContact = 'ADDED CONTACT',
  LoggedIn = 'LOGGED IN',
  LoggedOut = 'LOGGED OUT',
  Register = 'REGISTERED',
  Searched = 'SEARCHED',
  Error = 'ERROR',
}

export class HistoryLog {
  timeStamp: string;
  userUid: string;
  action: Action;
  data: string;
}

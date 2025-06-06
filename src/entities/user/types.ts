import { Timestamp } from "firebase/firestore";

export interface IUser {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Timestamp;
  streak: number;
}

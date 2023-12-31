import { IHousing } from "../housing/housing";
import { IPaymentTypes } from "../paymet-types/payment-types";

export interface ICharge {
  id?: string;
  name: string;
  description: string;
  state: boolean;
  urlimg: string;
  idcondominium: string;
  idpaymenttypes: string;
  paymenttype: IPaymentTypes;
  start: Date;
  end: Date;
  amount: number;
  idhousings: string[]
  housings?: IHousing[];
  isPublished: boolean
}

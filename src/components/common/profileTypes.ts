export type FormState = {
  ownerName: string;
  businessName: string;
  phoneNumber: string;
  businessType: string;
  address: string;
};

export type FieldName = keyof FormState;

export type Errors = Record<FieldName, string | null>;

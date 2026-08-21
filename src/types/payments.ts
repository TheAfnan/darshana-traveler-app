export type RazorpayOrder = {
  id: string;
  amount: number; // in paise
  currency: string;
  receipt?: string;
};

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "partial";

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  price: number;
  tax: number;
  discount: number;
};

export type Client = {
  id: string;
  name: string;
  company: string;
  email: string;
  address: string;
  invoicesCount: number;
  totalBilled: number;
};

export type Invoice = {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  clientCompany: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  currency: string;
  items: LineItem[];
  notes: string;
  terms: string;
  amountPaid: number;
};


export enum ItemStatus {
  IN_STOCK = 'In Stock',
  SOLD = 'Sold',
}

export interface LingerieItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  cost: number;
  potentialRevenue: number;
  soldPrice: number | null;
  status: ItemStatus;
  dateAdded: string; // ISO string
}

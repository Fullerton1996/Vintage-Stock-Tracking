import React from 'react';
import { LingerieItem, ItemStatus } from '../types';

interface InventoryItemCardProps {
  item: LingerieItem;
  onEdit: (item: LingerieItem) => void;
}

const InventoryItemCard: React.FC<InventoryItemCardProps> = ({ item, onEdit }) => {
  const { name, imageUrl, potentialRevenue, soldPrice, status } = item;
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
  };
  
  const statusStyles = {
    [ItemStatus.IN_STOCK]: 'bg-brand-blush/60 text-brand-deep-rose',
    [ItemStatus.SOLD]: 'bg-green-100 text-green-800',
  };

  const isSold = status === ItemStatus.SOLD;

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden group border border-gray-200 hover:border-brand-rose transition-colors duration-300 break-inside-avoid mb-6 cursor-pointer"
      onClick={() => onEdit(item)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEdit(item); }}
      aria-label={`View details for ${name}`}
    >
      <img 
        src={imageUrl || 'https://picsum.photos/400/300'} 
        alt={name} 
        className="w-full h-auto object-cover" 
      />
      <div className="p-4">
        <h3 className="font-serif text-lg text-brand-deep-rose mb-2">{name}</h3>
        <div className="flex justify-between items-center text-sm">
          <p className="font-semibold text-brand-charcoal">
            {isSold ? formatCurrency(soldPrice) : formatCurrency(potentialRevenue)}
          </p>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemCard;
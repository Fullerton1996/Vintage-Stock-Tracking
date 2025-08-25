import React from 'react';
import { LingerieItem } from '../types';
import InventoryItemCard from './InventoryItemCard';

interface InventoryListProps {
  items: LingerieItem[];
  onEditItem: (item: LingerieItem) => void;
}

const InventoryList: React.FC<InventoryListProps> = ({ items, onEditItem }) => {
  return (
    <section>
      <h2 className="font-serif text-3xl text-brand-charcoal mb-4">Inventory</h2>
      {items.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/50 rounded-lg border-2 border-dashed border-brand-blush">
          <p className="text-brand-charcoal/70 text-lg">Your inventory is empty.</p>
          <p className="text-brand-charcoal/50">Click "Add New Item" to get started!</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {items.map(item => (
            <InventoryItemCard key={item.id} item={item} onEdit={onEditItem} />
          ))}
        </div>
      )}
    </section>
  );
};

export default InventoryList;
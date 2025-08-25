import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { LingerieItem, ItemStatus } from '../types';
import { XIcon } from './icons/XIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<LingerieItem, 'id' | 'dateAdded' | 'status'>, existingId?: string) => void;
  onUpdateStatus: (item: LingerieItem, soldPrice: number) => void;
  onDelete: (id: string) => void;
  item: LingerieItem | null;
}

const ItemFormModal: React.FC<ItemFormModalProps> = ({ isOpen, onClose, onSave, onUpdateStatus, onDelete, item }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '', // Will hold base64 string
    cost: '',
    potentialRevenue: '',
  });
  const [soldPrice, setSoldPrice] = useState('');
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setModalRoot(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl,
        cost: String(item.cost),
        potentialRevenue: String(item.potentialRevenue),
      });
      if (item.soldPrice) {
        setSoldPrice(String(item.soldPrice));
      }
    } else {
      // Reset for new item
      setFormData({
        name: '',
        description: '',
        imageUrl: '',
        cost: '',
        potentialRevenue: '',
      });
      setSoldPrice('');
    }
  }, [item]);

  if (!isOpen || !modalRoot) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      description: formData.description,
      imageUrl: formData.imageUrl,
      cost: parseFloat(formData.cost) || 0,
      potentialRevenue: parseFloat(formData.potentialRevenue) || 0,
      soldPrice: null, // this will be handled by onUpdateStatus
    });
  };
  
  const handleMarkAsSold = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onUpdateStatus(item, parseFloat(soldPrice) || 0);
    }
  }
  
  const isSold = item?.status === ItemStatus.SOLD;

  const renderContent = () => (
    <div className="fixed inset-0 bg-brand-charcoal bg-opacity-60 backdrop-blur-sm z-40 flex justify-center items-center" onClick={onClose}>
      <div 
        className="bg-brand-cream rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-8 m-4" 
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-rose hover:text-brand-deep-rose transition-colors z-10">
          <XIcon className="w-6 h-6" />
        </button>

        <h2 className="font-serif text-3xl mb-6 text-brand-deep-rose">{item ? 'Item Details' : 'Add New Item'}</h2>

        <form onSubmit={isSold ? (e) => e.preventDefault() : handleSubmit} className="space-y-6">
          <InputField label="Item Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., 1950s Silk Peignoir" disabled={isSold} />
          
          <TextAreaField label="Description" name="description" value={formData.description} onChange={handleChange} disabled={isSold} />
          
          <div>
            <label className="block text-sm font-medium text-brand-charcoal">Item Image</label>
            <div className="mt-1 flex items-center gap-4">
              {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="w-24 h-24 object-cover rounded-md bg-white border border-brand-blush" />}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isSold}
                className="block w-full text-sm text-brand-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-blush file:text-brand-deep-rose hover:file:bg-brand-rose/50 disabled:opacity-50"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Cost (What you paid)" name="cost" type="number" value={formData.cost} onChange={handleChange} placeholder="0.00" disabled={isSold} />
            <InputField label="List Price (Potential Revenue)" name="potentialRevenue" type="number" value={formData.potentialRevenue} onChange={handleChange} placeholder="0.00" disabled={isSold} />
          </div>
          
          {!isSold && (
            <div className="pt-4 flex justify-end">
              <button type="submit" className="bg-brand-deep-rose text-white font-semibold py-2 px-6 rounded-lg hover:bg-brand-rose transition-colors">
                {item ? 'Save Changes' : 'Add Item'}
              </button>
            </div>
          )}
        </form>

        {item && !isSold && (
          <form onSubmit={handleMarkAsSold}>
            <div className="mt-8 pt-6 border-t-2 border-dashed border-brand-blush">
              <h3 className="font-serif text-2xl text-green-700 mb-3">Mark as Sold</h3>
              <div className="flex items-end gap-4">
                <InputField label="Sold Price" name="soldPrice" type="number" value={soldPrice} onChange={(e) => setSoldPrice(e.target.value)} placeholder="0.00" isSoldForm={true}/>
                <button type="submit" className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors flex-shrink-0">
                  Confirm Sale
                </button>
              </div>
            </div>
          </form>
        )}

        {item && (
           <div className="mt-8 pt-6 border-t border-brand-blush flex justify-end">
             <button
               onClick={() => onDelete(item.id)}
               className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-semibold"
             >
                <TrashIcon className="w-4 h-4" />
                Delete Item Permanently
             </button>
           </div>
        )}
      </div>
    </div>
  );

  return ReactDOM.createPortal(renderContent(), modalRoot);
};

// Helper components defined inside to avoid prop drilling and keep them scoped
const InputField: React.FC<{label: string, name: string, value: string | number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, placeholder?: string, disabled?: boolean, isSoldForm?: boolean}> = 
({ label, name, value, onChange, type = 'text', placeholder, disabled = false, isSoldForm = false}) => (
  <div className="w-full">
    <label htmlFor={name} className={`block text-sm font-medium ${isSoldForm ? 'text-green-800' : 'text-brand-charcoal'}`}>{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="mt-1 block w-full px-3 py-2 bg-white border border-brand-blush rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blush focus:border-brand-deep-rose disabled:bg-gray-100 transition-colors"
    />
  </div>
);

const TextAreaField: React.FC<{label: string, name: string, value: string, onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void, disabled?: boolean}> = 
({ label, name, value, onChange, disabled = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-brand-charcoal">{label}</label>
    <textarea
      id={name}
      name={name}
      rows={4}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-1 block w-full px-3 py-2 bg-white border border-brand-blush rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blush focus:border-brand-deep-rose disabled:bg-gray-100 transition-colors"
    ></textarea>
  </div>
);

export default ItemFormModal;
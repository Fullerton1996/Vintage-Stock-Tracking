
import React, { useState, useRef } from 'react';
import { LingerieItem, ItemStatus } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import FinancialSummary from './components/FinancialSummary';
import InventoryList from './components/InventoryList';
import ItemFormModal from './components/ItemFormModal';

const App: React.FC = () => {
  const [inventory, setInventory] = useLocalStorage<LingerieItem[]>('lingerieInventory', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LingerieItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openAddItemModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditItemModal = (item: LingerieItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveItem = (item: Omit<LingerieItem, 'id' | 'dateAdded' | 'status'>, existingId?: string) => {
    if (existingId) {
      // This is an update for an item that is already sold, we only update notes etc
      setInventory(prev => prev.map(i => i.id === existingId ? { ...i, ...item, id: existingId } : i));
    } else if (editingItem) {
      // This is an update to an existing item's status etc
      setInventory(prev => prev.map(i => i.id === editingItem.id ? { ...editingItem, ...item } : i));
    } else {
      // This is a new item
      const newItem: LingerieItem = {
        ...item,
        id: crypto.randomUUID(),
        dateAdded: new Date().toISOString(),
        status: ItemStatus.IN_STOCK,
        soldPrice: null,
      };
      setInventory(prev => [newItem, ...prev]);
    }
    closeModal();
  };
  
  const handleUpdateStatus = (item: LingerieItem, soldPrice: number) => {
    setInventory(prev => 
      prev.map(i => 
        i.id === item.id 
          ? { ...i, status: ItemStatus.SOLD, soldPrice: soldPrice }
          : i
      )
    );
    closeModal();
  }

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this item?')) {
      setInventory(prev => prev.filter(item => item.id !== id));
      closeModal();
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(inventory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().split('T')[0];
    link.download = `vintique-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') throw new Error("File could not be read");
        const importedInventory = JSON.parse(text);

        // Basic validation
        if (!Array.isArray(importedInventory)) {
          throw new Error("Invalid format: Not an array.");
        }

        if (window.confirm('This will overwrite your current inventory. Are you sure you want to continue?')) {
          setInventory(importedInventory);
        }
      } catch (error) {
        console.error("Failed to import file:", error);
        alert('Failed to import data. Please make sure the file is a valid JSON backup.');
      } finally {
        // Reset file input value to allow re-uploading the same file
        if (event.target) {
          event.target.value = '';
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto p-4 md:p-8">
        <Header 
          onAddItem={openAddItemModal} 
          onExport={handleExportData}
          onImport={handleImportClick}
        />
        <main>
          <FinancialSummary items={inventory} />
          <InventoryList items={inventory} onEditItem={openEditItemModal} />
        </main>
      </div>
      {isModalOpen && (
        <ItemFormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveItem}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteItem}
          item={editingItem}
        />
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept="application/json"
        className="hidden"
      />
    </div>
  );
};

export default App;

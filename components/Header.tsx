
import React from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface HeaderProps {
  onAddItem: () => void;
  onExport: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddItem, onExport, onImport }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 pb-4 border-b-2 border-brand-blush">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-brand-deep-rose">Vintique</h1>
        <p className="text-lg text-brand-charcoal/70">Vintage Lingerie Stock Tracker</p>
      </div>
      <div className="flex items-center gap-2">
         <button
            onClick={onExport}
            className="text-sm font-semibold text-brand-deep-rose py-2 px-4 rounded-lg hover:bg-brand-blush/50 transition-colors"
            title="Save a backup file of your inventory."
          >
            Export Data
          </button>
          <button
            onClick={onImport}
            className="text-sm font-semibold text-brand-deep-rose py-2 px-4 rounded-lg hover:bg-brand-blush/50 transition-colors"
            title="Load inventory from a backup file."
          >
            Import Data
          </button>
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 bg-brand-deep-rose text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-brand-rose transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-brand-rose focus:ring-opacity-50"
        >
          <PlusIcon className="w-5 h-5" />
          Add New Item
        </button>
      </div>
    </header>
  );
};

export default Header;

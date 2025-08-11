import React, { useState, type FC, type ReactNode } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CollapsibleProps {
  title: string;
  children: ReactNode;
  initialOpen?: boolean;
}

const Collapsible: FC<CollapsibleProps> = ({ title, children, initialOpen = true }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);

  return (
    <div className="border border-gray-700 rounded-lg mb-4">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title.replace(/\s/g, '').toLowerCase()}`}
      >
        <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
        {isOpen ? <ChevronUp size={20} className="text-gray-300" /> : <ChevronDown size={20} className="text-gray-300" />}
      </button>
      {isOpen && (
        <div
          id={`collapsible-${title.replace(/\s/g, '').toLowerCase()}`}
          className="p-4 bg-gray-800 rounded-b-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Collapsible;

import React from 'react';
import { Hand } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Hand className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold">Gesture Home Control</h1>
          </div>
          <div className="text-sm bg-blue-600 px-3 py-1 rounded-full">
            <span>Finger Gestures 👋</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
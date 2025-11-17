
import React from 'react';
import { HeartIcon } from './icons/Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <HeartIcon className="h-8 w-8 text-primary-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-800">
              Sistema de Puericultura
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

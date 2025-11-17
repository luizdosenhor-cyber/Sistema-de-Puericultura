import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { HeartIcon, ServerIcon } from './icons/Icons';

const Header: React.FC = () => {
  const { state, isDirty, saveState } = useAppContext();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSave = async () => {
      setSaveStatus('saving');
      const success = await saveState();
      if (success) {
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
      } else {
          setSaveStatus('error');
          setTimeout(() => setSaveStatus('idle'), 3000);
      }
  };

  const getSaveButtonText = () => {
      switch (saveStatus) {
          case 'saving':
              return 'Salvando...';
          case 'saved':
              return 'Salvo!';
          case 'error':
              return 'Erro ao Salvar';
          default:
              return 'Salvar Tudo';
      }
  };

  const getButtonClass = () => {
      let baseClass = "inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
      if (saveStatus === 'saved') return `${baseClass} bg-green-600 hover:bg-green-700 focus:ring-green-500`;
      if (saveStatus === 'error') return `${baseClass} bg-red-600 hover:bg-red-700 focus:ring-red-500`;
      if (!isDirty || saveStatus === 'saving') return `${baseClass} bg-primary-400 cursor-not-allowed`;
      return `${baseClass} bg-primary-600 hover:bg-primary-700 focus:ring-primary-500`;
  };
  
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

          <div className="flex items-center space-x-4">
              <div className="text-right">
                  <p className={`text-sm font-medium ${isDirty ? 'text-yellow-600' : 'text-green-600'}`}>
                    {isDirty ? 'Alterações não salvas' : 'Dados salvos'}
                  </p>
                  {state.lastUpdated && (
                      <p className="text-xs text-gray-400">
                         Última atualização: {new Date(state.lastUpdated).toLocaleString('pt-BR')}
                      </p>
                  )}
              </div>
              <button
                onClick={handleSave}
                disabled={!isDirty || saveStatus === 'saving'}
                className={getButtonClass()}
              >
                  <ServerIcon className="-ml-1 mr-2 h-5 w-5" />
                  {getSaveButtonText()}
              </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

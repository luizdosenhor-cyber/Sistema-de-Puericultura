import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ChildrenManagement from './components/ChildrenManagement';
import AcsManagement from './components/AcsManagement';
import Agenda from './components/Agenda';
import Reports from './components/Reports';
import LogsViewer from './components/LogsViewer';
import Settings from './components/Settings';
import { ClipboardDocumentListIcon, UserGroupIcon, ChartBarIcon, IdentificationIcon, CalendarDaysIcon, DocumentTextIcon, Cog6ToothIcon } from './components/icons/Icons';

type Tab = 'dashboard' | 'children' | 'acs' | 'agenda' | 'reports' | 'logs' | 'settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'children':
        return <ChildrenManagement />;
      case 'acs':
        return <AcsManagement />;
      case 'agenda':
        return <Agenda />;
      case 'reports':
        return <Reports />;
      case 'logs':
        return <LogsViewer />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const tabs: { id: Tab; name: string; icon: React.ElementType }[] = [
    { id: 'dashboard', name: 'Dashboard', icon: ClipboardDocumentListIcon },
    { id: 'children', name: 'Crianças', icon: UserGroupIcon },
    { id: 'acs', name: 'Agentes', icon: IdentificationIcon },
    { id: 'agenda', name: 'Agenda', icon: CalendarDaysIcon },
    { id: 'reports', name: 'Relatórios', icon: ChartBarIcon },
    { id: 'logs', name: 'Logs', icon: DocumentTextIcon },
    { id: 'settings', name: 'Configurações', icon: Cog6ToothIcon },
  ];

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 font-sans">
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="sm:hidden mb-4">
              <select
                id="tabs"
                name="tabs"
                className="block w-full rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                onChange={(e) => setActiveTab(e.target.value as Tab)}
                value={activeTab}
              >
                {tabs.map((tab) => (
                  <option key={tab.id} value={tab.id}>{tab.name}</option>
                ))}
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.name}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
                      aria-current={activeTab === tab.id ? 'page' : undefined}
                    >
                      <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
                      <span>{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="mt-6">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </AppProvider>
  );
};

export default App;

import React from 'react';

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => (
    <div className="bg-gray-800 border-b border-gray-700">
        <div className="flex overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
                <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`px-4 py-3 whitespace-nowrap flex items-center space-x-2 border-b-2 ${activeTab === id
                            ? 'border-blue-500 text-blue-500'
                            : 'border-transparent text-gray-400 hover:text-white'
                        }`}
                >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                </button>
            ))}
        </div>
    </div>
);

export default TabNavigation;
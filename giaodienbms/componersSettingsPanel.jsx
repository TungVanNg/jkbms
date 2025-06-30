import React from 'react';

const SettingsPanel = ({ settings, setSettings, updateSetting }) => (
    <div className="space-y-4">
        {Object.entries(settings).map(([key, value]) => (
            <div key={key} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <label className="text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                    </label>
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            value={value}
                            onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                            className="bg-gray-700 text-white px-3 py-1 rounded w-20 text-right"
                            step="0.01"
                        />
                        <button
                            onClick={() => updateSetting(key, settings[key])}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                            OK
                        </button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export default SettingsPanel;
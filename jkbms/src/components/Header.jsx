import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';

const Header = ({ mqttConnected, connectionStatus }) => (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">JK BMS Monitor</h1>
            <div className="flex items-center space-x-2">
                {mqttConnected ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm text-gray-400">{connectionStatus}</span>
            </div>
        </div>
    </div>
);

export default Header;
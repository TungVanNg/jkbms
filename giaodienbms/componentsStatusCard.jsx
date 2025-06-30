import React from 'react';

const StatusCard = ({ title, value, unit, icon: Icon, status, onClick }) => (
    <div
        className={`bg-gray-800 rounded-lg p-4 border ${status ? 'border-green-500' : 'border-gray-600'} ${onClick ? 'cursor-pointer hover:bg-gray-750' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">{title}</span>
            <Icon className={`w-5 h-5 ${status ? 'text-green-500' : 'text-gray-500'}`} />
        </div>
        <div className="text-2xl font-bold text-white">
            {value}{unit && <span className="text-lg text-gray-400 ml-1">{unit}</span>}
        </div>
    </div>
);

export default StatusCard;
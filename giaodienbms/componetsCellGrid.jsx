import React from 'react';

const CellGrid = ({ data, unit, type, avgValue }) => (
    <div className="grid grid-cols-4 gap-2 mb-6">
        {data.map((value, index) => {
            let cellClass = "bg-gray-800 rounded p-3 text-center border ";

            if (type === 'voltage' && avgValue) {
                const diff = Math.abs(value - avgValue);
                if (diff > 0.01) cellClass += "border-red-500 bg-red-900/20";
                else if (diff > 0.005) cellClass += "border-yellow-500 bg-yellow-900/20";
                else cellClass += "border-green-500 bg-green-900/20";
            } else if (type === 'resistance') {
                if (value > 25) cellClass += "border-red-500 bg-red-900/20";
                else if (value > 20) cellClass += "border-yellow-500 bg-yellow-900/20";
                else cellClass += "border-green-500 bg-green-900/20";
            } else {
                cellClass += "border-gray-600";
            }

            return (
                <div key={index} className={cellClass}>
                    <div className="text-xs text-gray-400 mb-1">C{index + 1}</div>
                    <div className="text-sm font-mono text-white">
                        {value.toFixed(type === 'voltage' ? 3 : 1)}{unit}
                    </div>
                </div>
            );
        })}
    </div>
);

export default CellGrid;
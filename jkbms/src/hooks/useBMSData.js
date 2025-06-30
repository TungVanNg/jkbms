import { useState, useEffect } from 'react';

const useBMSData = () => {
    // BMS Data State
    const [bmsData, setBmsData] = useState({
        totalVoltage: 52.96,
        totalCurrent: 6.12,
        batteryPower: 324.5,
        remainCapacity: 85.2,
        cycleCount: 123,
        mosTemp: 32.5,
        battTemp: 31.2,
        chargeStatus: true,
        dischargeStatus: true,
        balanceStatus: false,
        buzzerStatus: false
    });

    // Cell Data
    const [cellVoltages, setCellVoltages] = useState(
        Array(16).fill(0).map((_, i) => 3.31 + (Math.random() * 0.02 - 0.01))
    );

    const [cellResistances, setCellResistances] = useState(
        Array(16).fill(0).map(() => 15 + Math.random() * 5)
    );

    // Settings State
    const [settings, setSettings] = useState({
        cellOVP: 3.65,
        cellUVP: 2.90,
        smartSleep: 300,
        balanceCurrent: 1.0,
        chargeOTP: 55,
        mosOTP: 80,
        deviceAddr: 1,
        protocol: 1
    });

    // Simulate real-time data updates
    useEffect(() => {
        const interval = setInterval(() => {
            setBmsData(prev => ({
                ...prev,
                totalCurrent: 6.12 + (Math.random() * 2 - 1),
                batteryPower: prev.totalVoltage * (6.12 + (Math.random() * 2 - 1)),
                mosTemp: 32.5 + (Math.random() * 2 - 1),
                battTemp: 31.2 + (Math.random() * 2 - 1)
            }));

            setCellVoltages(prev =>
                prev.map(v => v + (Math.random() * 0.001 - 0.0005))
            );
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return {
        bmsData,
        setBmsData,
        cellVoltages,
        setCellVoltages,
        cellResistances,
        setCellResistances,
        settings,
        setSettings
    };
};

export default useBMSData;
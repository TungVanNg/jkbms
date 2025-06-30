import React, { useState, useEffect, useRef } from 'react';
import {
    Battery,
    Thermometer,
    Zap,
    Settings,
    Power,
    Activity,
    AlertTriangle,
    Wifi,
    WifiOff
} from 'lucide-react';

// Components
import StatusCard from './StatusCard';
import CellGrid from './CellGrid';
import SettingsPanel from './SettingsPanel';
import Header from './Header';
import TabNavigation from './TabNavigation';

// Hooks
import useMQTT from '../hooks/useMQTT';
import useBMSData from '../hooks/useBMSData';

const JKBMSApp = () => {
    // MQTT Connection
    const { mqttConnected, connectionStatus, publishMQTT } = useMQTT();

    // BMS Data
    const {
        bmsData,
        setBmsData,
        cellVoltages,
        setCellVoltages,
        cellResistances,
        settings,
        setSettings
    } = useBMSData();

    // UI State
    const [activeTab, setActiveTab] = useState('dashboard');

    // Control Functions
    const toggleCharge = () => {
        const newStatus = !bmsData.chargeStatus;
        setBmsData(prev => ({ ...prev, chargeStatus: newStatus }));
        publishMQTT('jk-bms/control/charge', { status: newStatus });
    };

    const toggleDischarge = () => {
        const newStatus = !bmsData.dischargeStatus;
        setBmsData(prev => ({ ...prev, dischargeStatus: newStatus }));
        publishMQTT('jk-bms/control/discharge', { status: newStatus });
    };

    const toggleBalance = () => {
        const newStatus = !bmsData.balanceStatus;
        setBmsData(prev => ({ ...prev, balanceStatus: newStatus }));
        publishMQTT('jk-bms/control/balance', { status: newStatus });
    };

    const toggleBuzzer = () => {
        const newStatus = !bmsData.buzzerStatus;
        setBmsData(prev => ({ ...prev, buzzerStatus: newStatus }));
        publishMQTT('jk-bms/control/buzzer', { status: newStatus });
    };

    const emergencyStop = () => {
        setBmsData(prev => ({
            ...prev,
            chargeStatus: false,
            dischargeStatus: false,
            balanceStatus: false
        }));
        publishMQTT('jk-bms/emergency', { stop: true });
    };

    // Settings Update
    const updateSetting = (key, value) => {
        const newSettings = { ...settings, [key]: parseFloat(value) };
        setSettings(newSettings);
        publishMQTT('jk-bms/settings', { [key]: parseFloat(value) });
    };

    // Cell voltage analysis
    const avgVoltage = cellVoltages.reduce((a, b) => a + b, 0) / cellVoltages.length;
    const maxVoltage = Math.max(...cellVoltages);
    const minVoltage = Math.min(...cellVoltages);
    const voltageDiff = maxVoltage - minVoltage;

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: Activity },
        { id: 'voltage', label: 'Cell Voltage', icon: Battery },
        { id: 'resistance', label: 'Resistance', icon: Zap },
        { id: 'control', label: 'Control', icon: Power },
        { id: 'settings', label: 'Settings', icon: Settings }
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <Header
                mqttConnected={mqttConnected}
                connectionStatus={connectionStatus}
            />

            <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            <div className="p-4">
                {activeTab === 'dashboard' && (
                    <DashboardTab
                        bmsData={bmsData}
                        maxVoltage={maxVoltage}
                        avgVoltage={avgVoltage}
                        minVoltage={minVoltage}
                        voltageDiff={voltageDiff}
                    />
                )}

                {activeTab === 'voltage' && (
                    <VoltageTab
                        cellVoltages={cellVoltages}
                        voltageDiff={voltageDiff}
                        avgVoltage={avgVoltage}
                    />
                )}

                {activeTab === 'resistance' && (
                    <ResistanceTab cellResistances={cellResistances} />
                )}

                {activeTab === 'control' && (
                    <ControlTab
                        bmsData={bmsData}
                        toggleCharge={toggleCharge}
                        toggleDischarge={toggleDischarge}
                        toggleBalance={toggleBalance}
                        toggleBuzzer={toggleBuzzer}
                        emergencyStop={emergencyStop}
                    />
                )}

                {activeTab === 'settings' && (
                    <SettingsTab
                        settings={settings}
                        setSettings={setSettings}
                        updateSetting={updateSetting}
                    />
                )}
            </div>
        </div>
    );
};

// Tab Components
const DashboardTab = ({ bmsData, maxVoltage, avgVoltage, minVoltage, voltageDiff }) => (
    <div className="space-y-6">
        {/* Main Stats */}
        <div className="grid grid-cols-2 gap-4">
            <StatusCard
                title="Total Voltage"
                value={bmsData.totalVoltage.toFixed(2)}
                unit="V"
                icon={Battery}
                status={true}
            />
            <StatusCard
                title="Total Current"
                value={bmsData.totalCurrent.toFixed(2)}
                unit="A"
                icon={Zap}
                status={true}
            />
            <StatusCard
                title="Battery Power"
                value={bmsData.batteryPower.toFixed(1)}
                unit="W"
                icon={Activity}
                status={true}
            />
            <StatusCard
                title="Remain Capacity"
                value={bmsData.remainCapacity.toFixed(1)}
                unit="%"
                icon={Battery}
                status={true}
            />
        </div>

        {/* Temperature */}
        <div className="grid grid-cols-2 gap-4">
            <StatusCard
                title="MOS Temp"
                value={bmsData.mosTemp.toFixed(1)}
                unit="°C"
                icon={Thermometer}
                status={bmsData.mosTemp < 50}
            />
            <StatusCard
                title="Battery Temp"
                value={bmsData.battTemp.toFixed(1)}
                unit="°C"
                icon={Thermometer}
                status={bmsData.battTemp < 45}
            />
        </div>

        {/* Cell Voltage Summary */}
        <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Battery className="w-5 h-5 mr-2" />
                Cell Voltage Summary
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-2xl font-bold text-green-500">{maxVoltage.toFixed(3)}V</div>
                    <div className="text-sm text-gray-400">Max</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-blue-500">{avgVoltage.toFixed(3)}V</div>
                    <div className="text-sm text-gray-400">Average</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-red-500">{minVoltage.toFixed(3)}V</div>
                    <div className="text-sm text-gray-400">Min</div>
                </div>
            </div>
            <div className="mt-4 text-center">
                <div className={`text-lg font-semibold ${voltageDiff > 0.02 ? 'text-red-500' : voltageDiff > 0.01 ? 'text-yellow-500' : 'text-green-500'}`}>
                    Difference: {voltageDiff.toFixed(3)}V
                </div>
            </div>
        </div>

        {/* Status Indicators */}
        <div className="grid grid-cols-2 gap-4">
            <div className={`bg-gray-800 rounded-lg p-4 border ${bmsData.chargeStatus ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center justify-between">
                    <span>Charge Status</span>
                    <div className={`w-3 h-3 rounded-full ${bmsData.chargeStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
            </div>
            <div className={`bg-gray-800 rounded-lg p-4 border ${bmsData.dischargeStatus ? 'border-green-500' : 'border-red-500'}`}>
                <div className="flex items-center justify-between">
                    <span>Discharge Status</span>
                    <div className={`w-3 h-3 rounded-full ${bmsData.dischargeStatus ? 'bg-green-500' : 'bg-red-500'}`}></div>
                </div>
            </div>
            <div className={`bg-gray-800 rounded-lg p-4 border ${bmsData.balanceStatus ? 'border-green-500' : 'border-gray-600'}`}>
                <div className="flex items-center justify-between">
                    <span>Balance Status</span>
                    <div className={`w-3 h-3 rounded-full ${bmsData.balanceStatus ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between">
                    <span>Cycle Count</span>
                    <span className="font-bold">{bmsData.cycleCount}</span>
                </div>
            </div>
        </div>
    </div>
);

const VoltageTab = ({ cellVoltages, voltageDiff, avgVoltage }) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Cell Voltages</h2>
            <div className="text-sm text-gray-400">
                Diff: {voltageDiff.toFixed(3)}V
            </div>
        </div>
        <CellGrid data={cellVoltages} unit="V" type="voltage" avgValue={avgVoltage} />
    </div>
);

const ResistanceTab = ({ cellResistances }) => (
    <div>
        <h2 className="text-xl font-bold mb-4">Cell Wire Resistance</h2>
        <CellGrid data={cellResistances} unit="mΩ" type="resistance" />
    </div>
);

const ControlTab = ({
    bmsData,
    toggleCharge,
    toggleDischarge,
    toggleBalance,
    toggleBuzzer,
    emergencyStop
}) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold mb-4">BMS Control</h2>

        <div className="grid grid-cols-1 gap-4">
            <button
                onClick={toggleCharge}
                className={`p-4 rounded-lg font-semibold text-lg ${bmsData.chargeStatus
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
            >
                Charge: {bmsData.chargeStatus ? 'ON' : 'OFF'}
            </button>

            <button
                onClick={toggleDischarge}
                className={`p-4 rounded-lg font-semibold text-lg ${bmsData.dischargeStatus
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
            >
                Discharge: {bmsData.dischargeStatus ? 'ON' : 'OFF'}
            </button>

            <button
                onClick={toggleBalance}
                className={`p-4 rounded-lg font-semibold text-lg ${bmsData.balanceStatus
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
            >
                Balance: {bmsData.balanceStatus ? 'ON' : 'OFF'}
            </button>

            <button
                onClick={toggleBuzzer}
                className={`p-4 rounded-lg font-semibold text-lg ${bmsData.buzzerStatus
                        ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
            >
                Buzzer: {bmsData.buzzerStatus ? 'ON' : 'OFF'}
            </button>
        </div>

        {/* Emergency Stop */}
        <div className="mt-8 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-500 font-semibold">Emergency Controls</span>
            </div>
            <button
                onClick={emergencyStop}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg"
            >
                EMERGENCY STOP ALL
            </button>
        </div>
    </div>
);

const SettingsTab = ({ settings, setSettings, updateSetting }) => (
    <div>
        <h2 className="text-xl font-bold mb-4">BMS Settings</h2>
        <SettingsPanel
            settings={settings}
            setSettings={setSettings}
            updateSetting={updateSetting}
        />
    </div>
);

export default JKBMSApp;
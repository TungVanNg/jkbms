import { useState, useEffect, useRef } from 'react';

const useMQTT = () => {
    const [mqttConnected, setMqttConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const mqttClient = useRef(null);

    useEffect(() => {
        const connectMQTT = () => {
            setConnectionStatus('Connecting...');

            // Mock connection - replace with actual MQTT client
            // import mqtt from 'mqtt';
            // const client = mqtt.connect('ws://localhost:9001');

            setTimeout(() => {
                setMqttConnected(true);
                setConnectionStatus('Connected');
            }, 2000);
        };

        connectMQTT();

        return () => {
            if (mqttClient.current) {
                mqttClient.current.end();
            }
        };
    }, []);

    const publishMQTT = (topic, message) => {
        if (mqttConnected) {
            console.log(`Publishing to ${topic}:`, message);
            // Actual MQTT publish
            // mqttClient.current.publish(topic, JSON.stringify(message));
        }
    };

    return {
        mqttConnected,
        connectionStatus,
        publishMQTT
    };
};

export default useMQTT;
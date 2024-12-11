"use client"
import { FC, useState } from 'react';

interface PublishMessageProps {
    selectedExchange: string;
}

const PublishMessage: FC<PublishMessageProps> = ({ selectedExchange }) => {
    const [msgRoutingKey, setMsgRoutingKey] = useState<string>('');
    const [payload, setPayload] = useState<string>('');

    const handlePublishMessage = async () => {
        const exchange = selectedExchange || 'default';

        const response = await fetch('http://localhost:8081/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exchange_name: exchange, routing_key: msgRoutingKey, payload: payload }),
        });

        if (response.ok) {
            console.log('Message sebt to ${exchange} with routing key ${msgRoutingKey}');
        } else {
            console.error('Failed to publish the message');
        }
    };

    return (
        <div>            
            <h1 className="text-2xl font-bold mt-8 mb-4">Publish Message</h1>
            <p className="mb-4">
                The message will be published to the exchange <b>{selectedExchange}</b> with the given routing key.
            </p>

            <div className="mb-4">
            <input
                    type="text"
                    value={msgRoutingKey}
                    onChange={(e) => setMsgRoutingKey(e.target.value)}
                    className="border p-2 w-full text-black"
                />
                <label className="block mb-2">Payload:</label>
                <input
                    type="text"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="border p-2 w-full text-black"
                />
            </div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={handlePublishMessage}>Publish</button>
        </div>
    );
};

export default PublishMessage;
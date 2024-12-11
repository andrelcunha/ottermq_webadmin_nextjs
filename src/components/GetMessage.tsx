// src/components/GetMessage.tsx
import { FC, useState } from 'react';

interface GetMessageProps {
    selectedQueue: string | null;
}

const GetMessage: FC<GetMessageProps> = ({ selectedQueue }) => {
    const [message, setMessage] = useState<string | null>(null);

    const handleGetMessage = async () => {
        if (!selectedQueue) {
        console.error('No queue selected');
        return;
        }

        const response = await fetch(`http://localhost:8081/queues/${selectedQueue}/consume`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (response.ok) {
            const data = await response.json();
            setMessage(data.message);
        } else {
            console.error('Failed to get message');
        }

    };

    return (
        <div>
        <h1 className="text-2xl font-bold mt-8 mb-4">Get Message</h1>
        <p className="mb-4 text-red-600">
            Warning: This action is destructive and will remove the message from the queue.
        </p>
        {selectedQueue ? (
            <>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={handleGetMessage}>
                Get Message from {selectedQueue}
            </button>
            {message && (
                <div className="mt-4 p-4 border border-gray-700">
                <h2 className="text-xl font-bold mb-2">Message:</h2>
                <pre className="bg-gray-100 p-2">{message}</pre>
                </div>
            )}
            </>
        ) : (
            <p>Please select a queue to get messages.</p>
        )}
        </div>
    );
};

export default GetMessage;

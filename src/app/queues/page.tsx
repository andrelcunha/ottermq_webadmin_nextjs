// src/app/queues/page.tsx
"use client"
import { useState, useEffect } from 'react';
import GetMessage from "@/components/GetMessage";

interface QueueResponse {
    queues: string[];
}

export async function getQueues(): Promise<string[]> {
    let response = await fetch('http://localhost:8081/queues');
    const data: QueueResponse = await response.json();
    return data.queues;
}

const Page = () => {
    const [queues, setQueues] = useState<string[]>([]);
    const [selectedQueue, setSelectedQueue] = useState<string | null>(null);

    useEffect(() => {
        getQueues().then(setQueues);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Queues
            </h1>
            <table className="min-w-full border border-gray-900">
                <thead>
                    <tr>
                        <th className="py-7 border border-gray-900">Virtual host</th>
                        <th className="py-7 border border-gray-900">Name</th>
                        <th className="py-7 border border-gray-900">State</th>
                        <th className="py-7 border border-gray-900">Ready</th>
                        <th className="py-7 border border-gray-900">Unacked</th>
                        <th className="py-7 border border-gray-900">Persistent</th>
                        <th className="py-7 border border-gray-900">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {queues.map((queue, index) => (
                        <tr 
                            key={index}
                            className={`border border-gray-900 ${index % 2 === 0 ? 'bg-gray-900' : ''}`}
                            onClick={() => setSelectedQueue(queue)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td className="py-2 px-4 border border-gray-900">localhost</td>
                            <td className="py-2 px-4 border border-gray-900">{queue}</td>
                            <td className="py-2 px-4 border border-gray-900">running</td>
                            <td className="py-2 px-4 border border-gray-900">0</td>
                            <td className="py-2 px-4 border border-gray-900">0</td>
                            <td className="py-2 px-4 border border-gray-900">0</td>
                            <td className="py-2 px-4 border border-gray-900">0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedQueue && <GetMessage selectedQueue={selectedQueue} />}
        </div>
    );
};

export default Page;

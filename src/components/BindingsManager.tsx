"use client"
import { FC, useState, useEffect } from 'react';

interface BindingsManagerProps {
    selectedExchange: string;
    fetchBindings: (exchange: string) => Promise<Record<string, string[]>>;
}

const BindingsManager: FC<BindingsManagerProps> = ({ selectedExchange, fetchBindings }) => {
    const [bindings, setBindings] = useState<Record<string, string[]>>({});
    const [newQueue, setNewQueue] = useState<string>('');
    const [newRoutingKey, setNewRoutingKey] = useState<string>('');

    useEffect(() => {
        if (selectedExchange) {
            fetchBindings(selectedExchange).then(setBindings)                
        }
    }, [selectedExchange, fetchBindings]);

    const handleAddBinding = async() => {
        if (!selectedExchange || !newQueue || !newRoutingKey) {
            console.error('Please fill in all fields');
            return;
        }

        const response = await fetch('http://localhost:8081/bindings', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            body: JSON.stringify({exchange_name: selectedExchange, routing_key: newRoutingKey, queue_name: newQueue}),
                
        });

        if (response.ok) {
            console.log('Bind ${newQueue} to ${selectedExchange} with routing key ${newRoutingKey}');
            const updatedBindings = await fetchBindings(selectedExchange);
            setBindings(updatedBindings);
        } else {
            console.error('Failed to add the binding');
        }
    };

    const handleUnbind = async (exchange: string, routingKey: string, queue: string) => {
        const response = await fetch('http://localhost:8081/bindings', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ exchange_name: exchange, routing_key: routingKey, queue_name: queue }),
        });
    
        if (response.ok) {
            console.log('Queue ${queue} unbound to ${exchange}');
            const updatedBindings = await fetchBindings(exchange);
            setBindings(updatedBindings);
        } else {
            console.error('Failed to unbind the queue');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold mt-6 mb-4">Bindings for {selectedExchange}</h2>
            <table className="min-w-full border border-gray-900 mb-4">
                <thead>
                    <tr>
                        <th className="py-2 border border-gray-900">Routing Key</th>
                        <th className="py-2 border border-gray-900">Queue</th>
                        <th className="py-2 border border-gray-900"></th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(bindings).map(([routingKey, queues], index) => (
                        queues.map((queue, queueIndex) => (
                            <tr key={`${index}-${queueIndex}`} className={`border ${index % 2 === 0 ? 'bg-gray-800' : ''}`}>
                                <td className="py-2 px-4 border border-gray-900">{routingKey}</td>
                                <td className="py-2 px-4 border border-gray-900">{queue}</td>
                                <td className="py-2 px-4 border border-gray-900">
                                    <button className="bg-gray-700 text-white px-2 py-1 rounded" onClick={() => handleUnbind(selectedExchange, routingKey, queue)}>Unbind</button>
                                </td>
                            </tr>
                        ))
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mt-6 mb-4">Add a Binding to this Exchange</h2>
            <div className="mb-4">
                <label className="block mb-2">To queue:</label>
                <input
                    type="text"
                    value={newQueue}
                    onChange={(e) => setNewQueue(e.target.value)}
                    className="border p-2 w-full text-black"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Routing key:</label>
                <input
                    type="text"
                    value={newRoutingKey}
                    onChange={(e) => setNewRoutingKey(e.target.value)}
                    className="border p-2 w-full text-black"
                />
            </div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded" onClick={handleAddBinding}>Bind</button>
        </div>
    );
};

export default BindingsManager;

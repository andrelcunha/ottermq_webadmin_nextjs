"use client"
import { useState, useEffect } from 'react';

interface ExchangeResponse {
    exchanges: string[];
}

interface BindingsResponse {
    bindings: Bindings;
}

interface Bindings {
    [routingKey: string]: string[];
}

async function getExchanges(): Promise<string[]> {
    const response = await fetch('http://localhost:8081/exchanges');
    const data: ExchangeResponse = await response.json();
    return data.exchanges;
}

async function getBindings(exchange: string): Promise<Bindings> {
    const response = await fetch(`http://localhost:8081/bindings/${exchange}`);
    const data: BindingsResponse = await response.json();
    return data.bindings;
}

const Page = () => {
    const [exchanges, setExchanges] = useState<string[]>([]);
    const [bindings, setBindings] = useState<Bindings>({});
    const [selectedExchange, setSelectedExchange] = useState<string>("default");
    const [newQueue, setNewQueue] = useState<string>('');
    const [newRoutingKey, setNewRoutingKey] = useState<string>('');
    const [msgRoutingKey, setMsgRoutingKey] = useState<string>('');
    const [payload, setPayload] = useState<string>('');


    useEffect(() => {
        const fetchExchanges = async () => {
            const res = await getExchanges();
            setExchanges(res);
        };

        fetchExchanges();
    }, []);

    useEffect(() => {
        if (selectedExchange) {
            const fetchBindings = async () => {
                const res = await getBindings(selectedExchange);
                setBindings(res);
            };

            fetchBindings();
        }
    }, [selectedExchange]);

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
            const updatedBindings = await getBindings(selectedExchange);
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
            const updatedBindings = await getBindings(exchange);
            setBindings(updatedBindings);
        } else {
            console.error('Failed to unbind the queue');
        }
    
    };

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
            <h1 className="text-2xl font-bold mb-4">Exchanges</h1>
            <table className="min-w-full border border-gray-900">
                <thead>
                    <tr>
                        <th className="py-3 border border-gray-900">Virtual host</th>
                        <th className="py-3 border border-gray-900">Name</th>
                        <th className="py-3 border border-gray-900">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {exchanges.map((exchange, index) => (
                        <tr
                            key={index}
                            className={`border ${index % 2 === 0 ? 'bg-gray-800' : ''}`}
                            onClick={() => setSelectedExchange(exchange)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td className="py-2 px-4 border border-gray-900">localhost</td>
                            <td className="py-2 px-4 border border-gray-900">{exchange}</td>
                            <td className="py-2 px-4 border border-gray-900">direct</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedExchange && (
                <>
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
                </>
            )}

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

export default Page;


interface ExchangeResponse {
    exchanges: string[];
}

interface BindingsResponse {
    bindings: Bindings[];
}

interface Bindings {    
    [routingKey: string]: string[];
}



export async function getExchanges(): Promise<string[]> {
    let response = await fetch('http://localhost:8081/exchanges');
    const data: ExchangeResponse = await response.json();
    return data.exchanges;
}

export async function getBindings(): Promise<Bindings[]> {
    let response = await fetch('http://localhost:8081/bindings');
    const data: BindingsResponse = await response.json();
    return data.bindings;
}

export default async function Page() {
    let exchanges = await getExchanges();
    let bindings = await getBindings();


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Exchanges
            </h1>
            <table className="min-w-full border border-gray-900">
                <thead>
                    <tr>
                        <th className="py-3  border border-gray-900">Virtual host</th>
                        <th className="py-3  border border-gray-900">Name</th>
                        <th className="py-3  border border-gray-900">Type</th>
                    </tr>
                </thead>
                <tbody>
                    {exchanges.map((exchange, index) => (
                        <tr key={index} className={`border border-gray-900 ${index % 2 === 0 ? 'bg-gray-900' : ''}`}>
                            <td className="py-2 px-4 border border-gray-900">localhost</td>
                            <td className="py-2 px-4 border border-gray-900">{exchange}</td>
                            <td className="py-2 px-4 border border-gray-900">direct</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mt-6 mb-4">Bindings</h2>
            <table className="min-w-full bg-white border border-gray-900 mb-4">
            <thead>
            <tr>
                <th className="py-2 border">Exchange</th>
                <th className="py-2 border">Routing Key</th>
                <th className="py-2 border">Queue</th>
                <th className="py-2 border"></th>
            </tr>
            </thead>
                <tbody>
                {bindings.map((binding, index) => (
                    <tr key={index} className={`border ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'}`}>
                    <td className="py-2 px-4 border">{binding.routingKey}</td>
                    <td className="py-2 px-4 border">{binding.queue}</td>
                    <td className="py-2 px-4 border">
                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleUnbind(binding.exchange, binding.queue)}>Unbind</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mt-6 mb-4">
                Add a Binding to this Exchange
            </h2>
            <div className="mb-4">
                <label className="block mb-2">To queue:</label>
                <input type="text" value={newQueue} onChange={(e) => setNewQueue(e.target.value)} className="border p-2 w-full" />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Routing key:</label>
                <input type="text" value={newRoutingKey} onChange={(e) => setNewRoutingKey(e.target.value)} className="border p-2 w-full" />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddBinding}>Bind</button>
        </div>
    );
};

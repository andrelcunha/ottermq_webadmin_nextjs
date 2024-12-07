// import axios from 'axios';

interface ExchangeResponse {
    exchanges: string[];
}


export async function getExchanges(): Promise<string[]> {
    let response = await fetch('http://localhost:8081/exchanges');
    const data: ExchangeResponse = await response.json();
    return data.exchanges;
}

export default async function Page() {
    let exchanges = await getExchanges();


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
        </div>
    );
};

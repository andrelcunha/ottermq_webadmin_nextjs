import { FC } from 'react';


interface ExchangeTableProps {
    exchanges: string[];
    onSelectExchange: (exchange: string) => void;
}


const ExchangesTable: React.FC<ExchangeTableProps> = ({ exchanges ,onSelectExchange }) => {
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
                            onClick={() => onSelectExchange(exchange)}
                            style={{ cursor: 'pointer' }}
                        >
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

export default ExchangesTable;

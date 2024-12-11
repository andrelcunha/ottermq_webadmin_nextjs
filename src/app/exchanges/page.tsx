"use client"
import { useState, useEffect } from 'react';
import ExchangesTable from "@/components/ExchangesTable";
import BindingsManager from "@/components/BindingsManager";
import PublishMessage from "@/components/PublishMessage";


async function getExchanges(): Promise<string[]> {
    const response = await fetch('http://localhost:8081/exchanges');
    const data: { exchanges: string[] } = await response.json();
    return data.exchanges;
}

async function getBindings(exchange: string): Promise<Record<string, string[]>> {
    const response = await fetch(`http://localhost:8081/bindings/${exchange}`);
    const data: { bindings: Record<string,string[]> } = await response.json();
    return data.bindings;
}

const Page = () => {
    const [exchanges, setExchanges] = useState<string[]>([]);
    const [selectedExchange, setSelectedExchange] = useState<string>("default");

    useEffect(() => {
        getExchanges().then(setExchanges);
    }, []);

    return (
    <div>
        <h1 className="text-2xl font-bold mb-4">Exchanges</h1>
        <ExchangesTable exchanges={exchanges} onSelectExchange={setSelectedExchange} />
        {selectedExchange && (
            <>
            <BindingsManager selectedExchange={selectedExchange} fetchBindings={getBindings} />
            <PublishMessage selectedExchange={selectedExchange} />
            </>
        )}
    </div>
    );
};

export default Page;

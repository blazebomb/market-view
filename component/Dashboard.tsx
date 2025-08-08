// ...existing code...
'use client'

import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

type StockData = {
  date: string | Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type Company = {
  id: string;
  name: string;
  stockData: StockData[];
};

type Props = {
  companies: Company[];
};

export default function StockDashboard({ companies }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCompanyId = searchParams.get('companyId') || companies[0]?.id;

  const selectedCompany = companies.find(c => c.id === selectedCompanyId);
  const dataPoints = selectedCompany?.stockData || [];

  const average = dataPoints.reduce((sum, item) => sum + item.close, 0) / (dataPoints.length || 1);

  const chartData = {
    labels: dataPoints.map(d =>
      typeof d.date === 'string' ? d.date.split('T')[0] : d.date.toISOString().split('T')[0]
    ),
    datasets: [
      {
        label: 'Close Price',
        data: dataPoints.map(d => d.close),
        borderColor: 'orange',
        backgroundColor: 'rgba(255, 165, 0, 0.2)',
      },
    ],
  };

  // Handle company click: update query param
  const handleCompanyClick = (id: string) => {
    router.push(`/?companyId=${id}`);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-zinc-900 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Companies</h2>
        {companies.map(company => (
          <button
            key={company.id}
            onClick={() => handleCompanyClick(company.id)}
            className={`block w-full text-left p-2 rounded mb-2 hover:bg-zinc-700 ${
              selectedCompanyId === company.id ? 'bg-orange-500' : ''
            }`}
          >
            {company.name}
          </button>
        ))}
      </div>

      <div className="w-3/4 bg-white p-6 overflow-y-auto">
        {selectedCompany ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">{selectedCompany.name}</h2>
            <div className="mb-6">
              <Line data={chartData} />
            </div>
            <div className="text-lg">
              <p>
                <strong>Average Close Price:</strong> ₹{average.toFixed(2)}
              </p>
              <p>
                <strong>Total Entries:</strong> {dataPoints.length}
              </p>
              <p>
                <strong>Latest Close Price:</strong> ₹
                {dataPoints[dataPoints.length - 1]?.close.toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <p className="text-gray-700">No company selected.</p>
        )}
      </div>
    </div>
  );
}

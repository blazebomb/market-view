import { prisma } from '@/lib/prisma';
import StockDashboard from '@/component/Dashboard';
import { Suspense } from 'react';

export default async function Home() {
  const companies = await prisma.company.findMany({
    include: { stocks: true }
  });

  const formattedCompanies = companies.map(company => ({
    id: company.id,
    name: company.name,
    stockData: company.stocks.map(stock => ({
      date: stock.date,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      close: stock.close,
      volume: stock.volume
    }))
  }));

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StockDashboard companies={formattedCompanies} />
    </Suspense>
  );
}
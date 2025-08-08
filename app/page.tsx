import { prisma } from '@/lib/prisma';
import StockDashboard from '@/component/Dashboard';

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
    <div>
      <StockDashboard companies={formattedCompanies} />
    </div>
  );
}
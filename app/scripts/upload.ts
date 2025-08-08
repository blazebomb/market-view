import fs from 'fs/promises';

type StockEntry = {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
};

type StockPayload = {
  ticker: string;
  companyName: string;
  entries: StockEntry[];
};

async function uploadAll() {
  let raw = '';
  try {
    raw = await fs.readFile('public/stock_data.json', 'utf8');
  } catch (err) {
    console.error('Error reading stock_data.json:', err);
    return;
  }
  const data: Record<string, StockEntry[]> = JSON.parse(raw);

  const companyNames: Record<string, string> = {
    AAPL: 'Apple Inc',
    GOOG: 'Alphabet Inc',
    MSFT: 'Microsoft Corporation',
    TSLA: 'Tesla Inc',
    AMZN: 'Amazon.com Inc',
    META: 'Meta Platforms Inc',
    'INFY.NS': 'Infosys Ltd',
    'TCS.NS': 'Tata Consultancy Services Ltd',
    'HDFCBANK.NS': 'HDFC Bank Ltd',
    'RELIANCE.NS': 'Reliance Industries Ltd'
  };

  const stockData: StockPayload[] = Object.entries(data).map(([ticker, entries]) => ({
    ticker,
    companyName: companyNames[ticker] || 'Unknown Company',
    entries: entries.map(({ Date, Open, High, Low, Close, Volume }) => ({ Date, Open, High, Low, Close, Volume }))
  }));

  for (const stock of stockData) {
    try {
      const res = await fetch('http://localhost:3000/api/stocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stock)
      });
      const result = await res.json();
      if (!res.ok) {
        console.error(`Error uploading ${stock.ticker}:`, result);
      } else {
        console.log(`Uploaded ${stock.ticker}:`, result);
      }
    } catch (error) {
      console.error(`Error uploading ${stock.ticker}:`, error);
    }
  }
}

uploadAll();

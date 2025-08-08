This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



### 
#So first, we use Python and yfinance to get stock data like open, close, volume etc. for companies like Apple, Infosys, TCS, etc.

Then we save that data as a JSON file, like stock_data.json, in the public folder.

Next, we have a TypeScript script (upload.ts) in our Next.js project which reads that JSON file.

That script basically maps the data into our Prisma schema format — where we’ve got two models: Company and StockEntry.

We add company names manually using a dictionary object in the script (since yfinance just gives us the ticker).

Then for each company, we hit our Next.js API route (/api/stocks) with a POST request, sending company name, ticker, and its stock entries.

The API then takes care of creating/upserting the Company, and adding all its stock entries into the database via Prisma.

Final result: the data we got from yfinance in Python is now stored cleanly in our DB, ready to be used in the frontend.

Once the data is in the database, we build a dashboard to show it.

The UI has two panels:

Left panel shows a list of all companies (fetched via prisma.company.findMany()).

Right panel shows detailed data when a company is selected — including a line chart, all historical entries, averages, and predictions (fetched via prisma.company.findUnique() with stock data included).

We use Tailwind CSS for styling and react-chartjs-2 to render the charts.

then we get the result that is  A clean, simple stock dashboard where you can click any company and view all the relevant data at a glance.
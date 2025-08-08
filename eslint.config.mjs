// app/page.tsx

import { prisma } from './lib/prisma';

export default async function Home() {
  const companies = await prisma.company.findMany();

  return (
    <div>
      <h1>Stock Companies</h1>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name} ({company.ticker})
          </li>
        ))}
      </ul>
    </div>
  );
}

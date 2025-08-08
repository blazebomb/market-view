import { PrismaClient } from "@/app/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { companyName, ticker, entries } = body;

    if (!companyName || !ticker || !Array.isArray(entries)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    let company = await prisma.company.findUnique({ where: { ticker } });

    if (!company) {
      company = await prisma.company.create({
        data: { name: companyName, ticker },
      });
    }

    const stockEntries = entries.map((entry) => ({
      date: new Date(entry.Date),
      open: entry.Open,
      high: entry.High,
      low: entry.Low,
      close: entry.Close,
      volume: entry.Volume,
      companyId: company.id,
    }));

    await prisma.stockData.createMany({
      data: stockEntries,
      skipDuplicates: true,
    });

    return NextResponse.json({
      message: 'data inserted successfully',
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
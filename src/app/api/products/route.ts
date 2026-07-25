import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    const res = await fetch(siteConfig.apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 30 } // Было 60 -> стало 30 секунд
    });
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=150', // Было 60/300 -> стало 30/150
      },
    });
  } catch {
    return NextResponse.json(
      { products: [], stories: [], descriptions: [] },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
        },
      }
    );
  }
}

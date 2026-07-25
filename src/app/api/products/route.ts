import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    const res = await fetch(siteConfig.apiUrl, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 60 } // Запрос к Google Таблице раз в 60 сек
    });
    const data = await res.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json(
      { products: [], stories: [], descriptions: [] },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}

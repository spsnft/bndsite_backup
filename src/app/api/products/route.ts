import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET() {
  try {
    const res = await fetch(siteConfig.apiUrl, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ products: [], stories: [], descriptions: [] });
  }
}

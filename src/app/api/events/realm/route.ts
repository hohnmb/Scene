import { NextRequest, NextResponse } from 'next/server';
import { fetchCultureApi, extractEvents } from '@/lib/api/culture-server';
import { getFixtures } from '@/lib/api/fixtures';

export async function GET(request: NextRequest) {
  if (process.env.USE_FIXTURE === 'true') {
    return NextResponse.json(getFixtures());
  }

  const searchParams = Object.fromEntries(request.nextUrl.searchParams);

  try {
    const data = await fetchCultureApi('/realm2', searchParams);
    const events = extractEvents(data);
    return NextResponse.json(events);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { fetchCultureApi, extractDetail } from '@/lib/api/culture-server';
import { getFixtureDetail } from '@/lib/api/fixtures';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.USE_FIXTURE === 'true') {
    const resolvedParams = await params;
    const item = getFixtureDetail(resolvedParams.id);
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(item);
  }

  const resolvedParams = await params;

  try {
    const data = await fetchCultureApi('/detail2', { seq: resolvedParams.id });
    const event = extractDetail(data);
    if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(event);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

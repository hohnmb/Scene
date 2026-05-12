import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address');
  if (!address) return NextResponse.json({ error: 'No address provided' }, { status: 400 });

  const apiKey = process.env.KAKAO_REST_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No Kakao API key' }, { status: 500 });

  const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
  
  try {
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` }
    });
    if (!res.ok) throw new Error('Kakao API error');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

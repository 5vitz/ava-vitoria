import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.PRINTFUL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'PRINTFUL_API_KEY não configurada no .env',
      }, { status: 400 });
    }

    const res = await fetch('https://api.printful.com/oauth/scopes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        status: res.status,
        error: 'Erro na comunicação com a API da Printful',
      }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      scopes: data.result?.scopes || [],
      tokenActive: true,
      lastPing: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}

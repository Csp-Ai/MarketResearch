import { NextResponse } from 'next/server';

interface Lead {
  email: string;
  company: string;
  size: string;
  vertical: string;
}

// In-memory storage for leads. Data resets on server restart.
const leads: Lead[] = [];

export async function POST(request: Request) {
  try {
    const { email, company, size, vertical } = await request.json();
    if (!email || !company || !size || !vertical) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const lead: Lead = { email, company, size, vertical };
    leads.push(lead);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

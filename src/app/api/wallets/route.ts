import { NextResponse } from 'next/server';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import { appendWallets, readWallets, type StoredWallet } from '@/lib/walletStore';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const wallets = readWallets();
    return NextResponse.json({ wallets });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read wallets' }, { status: 500 });
  }
}

type PostBody = {
  count?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as PostBody;
    const countRaw = body?.count ?? 1;
    const count = Number.isFinite(countRaw) ? Math.max(1, Math.min(1000, Math.floor(countRaw))) : 1;

    const newWallets: StoredWallet[] = [];
    for (let i = 0; i < count; i += 1) {
      const keypair = Keypair.generate();
      const address = keypair.publicKey.toBase58();
      const secretKeyBase58 = bs58.encode(keypair.secretKey);
      newWallets.push({ address, secretKeyBase58 });
    }

    appendWallets(newWallets);
    return NextResponse.json({ wallets: newWallets }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate wallets' }, { status: 500 });
  }
}




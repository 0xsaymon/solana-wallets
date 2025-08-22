import fs from 'fs';
import path from 'path';

export type StoredWallet = {
  address: string;
  secretKeyBase58: string;
};

const DATA_DIR = process.cwd();
const WALLETS_FILE = path.join(DATA_DIR, 'wallets.json');

function ensureFileExists(): void {
  if (!fs.existsSync(WALLETS_FILE)) {
    fs.writeFileSync(WALLETS_FILE, '[]', { encoding: 'utf-8' });
  }
}

export function readWallets(): StoredWallet[] {
  ensureFileExists();
  const raw = fs.readFileSync(WALLETS_FILE, { encoding: 'utf-8' });
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as StoredWallet[];
    return [];
  } catch {
    return [];
  }
}

export function appendWallets(newWallets: StoredWallet[]): void {
  ensureFileExists();
  const current = readWallets();
  const combined = [...current, ...newWallets];
  fs.writeFileSync(WALLETS_FILE, JSON.stringify(combined, null, 2), {
    encoding: 'utf-8',
  });
}




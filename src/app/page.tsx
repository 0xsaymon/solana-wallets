"use client";
import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";

type Wallet = {
  address: string;
  secretKeyBase58: string;
};

async function fetchWallets(): Promise<Wallet[]> {
  const res = await fetch("/api/wallets", { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return data.wallets ?? [];
}

async function generateWallets(count: number): Promise<Wallet[]> {
  const res = await fetch("/api/wallets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count }),
  });
  if (!res.ok) throw new Error("Failed to generate wallets");
  const data = await res.json();
  return data.wallets ?? [];
}

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const total = useMemo(() => wallets.length, [wallets]);

  useEffect(() => {
    fetchWallets().then(setWallets).catch(() => setWallets([]));
  }, []);

  const onGenerate = async () => {
    setIsLoading(true);
    try {
      const created = await generateWallets(count);
      setWallets((prev) => [...created, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard");
    } catch {}
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value || "1", 10))))}
            style={{ padding: 8, width: 120 }}
          />
          <button onClick={onGenerate} disabled={isLoading} style={{ padding: "8px 12px" }}>
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <span>Total saved: {total}</span>
        </div>

        <div style={{ marginTop: 24, width: "100%", maxWidth: 900 }}>
          {wallets.length === 0 ? (
            <div>No wallets yet.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #444", padding: "8px" }}>#</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #444", padding: "8px" }}>Address</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #444", padding: "8px" }}>Secret Key (base58)</th>
                  <th style={{ textAlign: "left", borderBottom: "1px solid #444", padding: "8px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wallets.map((w, i) => (
                  <tr key={`${w.address}-${i}`}>
                    <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>{i + 1}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #333", fontFamily: "monospace" }}>{w.address}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #333", fontFamily: "monospace" }}>{w.secretKeyBase58}</td>
                    <td style={{ padding: "8px", borderBottom: "1px solid #333" }}>
                      <button onClick={() => copyToClipboard(w.address)} style={{ marginRight: 8 }}>Copy Address</button>
                      <button onClick={() => copyToClipboard(w.secretKeyBase58)}>Copy Secret</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

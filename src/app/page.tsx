"use client";
import { useMemo, useRef, useState } from "react";
import styles from "./page.module.css";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { Button } from "@radix-ui/themes";
import { useVirtualizer } from "@tanstack/react-virtual";

type Wallet = {
  address: string;
  secretKeyBase58: string;
};

function generateClientWallets(count: number): Wallet[] {
  const safeCount = Number.isFinite(count) ? Math.max(1, Math.min(1000, Math.floor(count))) : 1;
  const created: Wallet[] = [];
  for (let i = 0; i < safeCount; i += 1) {
    const keypair = Keypair.generate();
    const address = keypair.publicKey.toBase58();
    const secretKeyBase58 = bs58.encode(keypair.secretKey);
    created.push({ address, secretKeyBase58 });
  }
  return created;
}

type DownloadFormat = "csv" | "txt";

export default function Home() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(1);
  const [format, setFormat] = useState<DownloadFormat>("csv");
  const total = useMemo(() => wallets.length, [wallets]);

  const onGenerate = () => {
    setIsLoading(true);
    try {
      const created = generateClientWallets(count);
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

  const onDownload = () => {
    if (wallets.length === 0) return;
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:]/g, "")
      .replace("T", "-")
      .slice(0, 15);

    let content = "";
    if (format === "csv") {
      const header = "address,secretKeyBase58";
      const rows = wallets.map((w) => `${w.address},${w.secretKeyBase58}`);
      content = [header, ...rows].join("\n");
    } else {
      content = wallets.map((w) => `${w.address},${w.secretKeyBase58}`).join("\n");
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallets-${timestamp}.${format}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const parentRef = useRef<HTMLDivElement | null>(null);
  const rowVirtualizer = useVirtualizer({
    count: wallets.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 12,
  });

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", margin: "0 auto" }}>
          <input
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(e) => setCount(Math.max(1, Math.min(1000, parseInt(e.target.value || "1", 10))))}
            style={{ padding: 8, width: 120 }}
          />
          <Button onClick={onGenerate} disabled={isLoading} color="jade">
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          <span>Total generated: {total}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <select value={format} onChange={(e) => setFormat(e.target.value as DownloadFormat)} style={{ padding: 8 }}>
              <option value="csv">CSV</option>
              <option value="txt">TXT</option>
            </select>
            <Button onClick={onDownload} disabled={wallets.length === 0} color="plum">
              Download
            </Button>
          </div>
        </div>

        <div style={{ marginTop: 24, width: "100dvw", maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}>
          {wallets.length === 0 ? (
            <div>No wallets yet.</div>
          ) : (
            <>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "56px 1fr 2fr minmax(180px,auto)",
                  gap: 8,
                  padding: "8px 12px",
                  borderBottom: "1px solid #444",
                  position: "sticky",
                  top: 0,
                  background: "var(--background)",
                  zIndex: 1,
                }}
              >
                <div style={{ fontWeight: 600 }}>#</div>
                <div style={{ fontWeight: 600 }}>Address</div>
                <div style={{ fontWeight: 600 }}>Secret Key (base58)</div>
                <div style={{ fontWeight: 600 }}>Actions</div>
              </div>

              <div
                ref={parentRef}
                style={{
                  height: "65vh",
                  overflow: "auto",
                  width: "100%",
                  border: "1px solid var(--gray-alpha-200)",
                  borderRadius: 8,
                }}
              >
                <div
                  style={{
                    height: rowVirtualizer.getTotalSize(),
                    width: "100%",
                    position: "relative",
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const i = virtualRow.index;
                    const w = wallets[i];
                    return (
                      <div
                        key={`${w.address}-${i}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          transform: `translateY(${virtualRow.start}px)`,
                          padding: "0 12px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "56px 1fr 2fr minmax(180px,auto)",
                            gap: 8,
                            alignItems: "center",
                            padding: "8px 0",
                            borderBottom: "1px solid #333",
                          }}
                        >
                          <div>{i + 1}</div>
                          <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{w.address}</div>
                          <div style={{ fontFamily: "monospace", wordBreak: "break-all" }}>{w.secretKeyBase58}</div>
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            <Button onClick={() => copyToClipboard(w.address)} variant="soft" size="1">Copy Address</Button>
                            <Button onClick={() => copyToClipboard(w.secretKeyBase58)} variant="soft" size="1">Copy Secret</Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

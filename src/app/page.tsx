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
  const safeCount = Number.isFinite(count) ? Math.max(1, Math.min(100000, Math.floor(count))) : 1;
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
    if (!count || count <= 0) {
      alert("Error: Please enter a number greater than 0");
      return;
    }
    setIsLoading(true);
    try {
      const created = generateClientWallets(count);
      setWallets((prev) => [...created, ...prev]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInput = () => {
    setCount(1);
  };

  const clearAllWallets = () => {
    setWallets([]);
  };

  const copyAllPrivateKeys = () => {
    if (wallets.length === 0) return;
    const allPrivateKeys = wallets.map(w => w.secretKeyBase58).join(' ');
    copyToClipboard(allPrivateKeys);
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
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              type="number"
              min={1}
              max={100000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100000, parseInt(e.target.value || "1", 10))))}
              style={{ padding: "8px 32px 8px 8px", width: 120 }}
            />
            <div 
              className="tooltip-wrapper" 
              data-tooltip="Clear input"
              style={{
                position: "absolute",
                right: 4,
                top: "50%",
                transform: "translateY(-50%)"
              }}
            >
              <button
                onClick={clearInput}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--foreground)",
                  fontSize: "16px",
                  width: 24,
                  height: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 2
                }}
              >
                ×
              </button>
            </div>
          </div>
          <div className="tooltip-wrapper" data-tooltip={isLoading ? "Generating..." : "Generate wallets"}>
            <Button onClick={onGenerate} disabled={isLoading} color="jade">
              {isLoading ? "⏳" : "⚡"}
            </Button>
          </div>
          <span>Total generated: {total}</span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div className="tooltip-wrapper" data-tooltip="Export format">
              <select value={format} onChange={(e) => setFormat(e.target.value as DownloadFormat)} style={{ padding: 8 }}>
                <option value="csv">CSV</option>
                <option value="txt">TXT</option>
              </select>
            </div>
            <div className="tooltip-wrapper" data-tooltip="Download wallets">
              <Button onClick={onDownload} disabled={wallets.length === 0} color="plum">
                📥
              </Button>
            </div>
            <div className="tooltip-wrapper" data-tooltip="Copy all private keys">
              <Button onClick={copyAllPrivateKeys} disabled={wallets.length === 0} color="orange" variant="soft">
                📋
              </Button>
            </div>
            <div className="tooltip-wrapper" data-tooltip="Clear all wallets">
              <Button onClick={clearAllWallets} disabled={wallets.length === 0} color="red" variant="soft">
                🗑️
              </Button>
            </div>
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
                            <div className="tooltip-wrapper" data-tooltip="Copy address">
                              <Button onClick={() => copyToClipboard(w.address)} variant="soft" size="1">
                                📋
                              </Button>
                            </div>
                            <div className="tooltip-wrapper" data-tooltip="Copy private key">
                              <Button onClick={() => copyToClipboard(w.secretKeyBase58)} variant="soft" size="1">
                                🔑
                              </Button>
                            </div>
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

'use client';
import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon, LaptopIcon } from '@radix-ui/react-icons';
import { Flex, IconButton, Select } from '@radix-ui/themes';

type Mode = 'system' | 'light' | 'dark';

function getSystemPreference(): Mode | undefined {
  if (typeof window === 'undefined' || !window.matchMedia) return undefined;
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

function applyTheme(mode: Mode) {
  const html = document.documentElement;
  const resolved = mode === 'system' ? getSystemPreference() ?? 'dark' : mode;
  html.classList.remove('light', 'dark');
  html.classList.add(resolved);
  try {
    localStorage.setItem('theme', mode);
  } catch {}
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' ? (localStorage.getItem('theme') as Mode | null) : null) ?? 'system';
    setMode(saved);
    applyTheme(saved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(mode);
  }, [mode, mounted]);

  const resolved = mode === 'system' ? getSystemPreference() ?? 'dark' : mode;

  return (
    <Flex align="center" gap="2">
      <Select.Root value={mode} onValueChange={(v: Mode) => setMode(v)}>
        <Select.Trigger aria-label="Theme">
          {mode === 'system' ? 'System' : mode === 'dark' ? 'Dark' : 'Light'}
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>Theme</Select.Label>
            <Select.Item value="system">System</Select.Item>
            <Select.Item value="light">Light</Select.Item>
            <Select.Item value="dark">Dark</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <IconButton variant="soft" aria-label="Current theme icon">
        {resolved === 'dark' ? <MoonIcon /> : resolved === 'light' ? <SunIcon /> : <LaptopIcon />}
      </IconButton>
    </Flex>
  );
}
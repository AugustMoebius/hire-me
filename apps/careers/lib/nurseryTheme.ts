// No nursery-branding data exists yet (no logo, no colours) — this derives a
// stable, distinct look per nursery so the page doesn't read as a generic
// Famly page, without needing anyone to upload branding assets.
const PALETTE = [
  { bg: "#eef5f0", accent: "#2f7a52" },
  { bg: "#e8f7f0", accent: "#1f9d67" },
  { bg: "#f1f5ea", accent: "#6b8f3a" },
  { bg: "#eaf6f3", accent: "#2c8c7a" },
  { bg: "#f0f6e8", accent: "#4c7a3d" },
];

export function nurseryTheme(nurseryId: string) {
  let hash = 0;
  for (let i = 0; i < nurseryId.length; i++) {
    hash = (hash * 31 + nurseryId.charCodeAt(i)) >>> 0;
  }
  return PALETTE[hash % PALETTE.length];
}

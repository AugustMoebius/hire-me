import { nurseryTheme } from "../lib/nurseryTheme";

// Stands in for a real nursery photo, which we don't have — themed per
// nursery so it still reads as "this specific place" rather than a generic
// placeholder.
export function NurseryBanner({
  nurseryId,
  nurseryName,
}: {
  nurseryId: string;
  nurseryName: string;
}) {
  const theme = nurseryTheme(nurseryId);

  return (
    <div
      style={{
        height: 220,
        background: `linear-gradient(135deg, ${theme.accent}, ${theme.bg})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.6rem",
        overflow: "hidden",
      }}
    >
      <svg
        width="56"
        height="56"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        style={{ opacity: 0.65 }}
      >
        <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
        <circle cx="8.5" cy="10" r="1.75" />
        <path d="M4 16.5l5-5 4.5 4.5" />
        <path d="M11 16.5l5.5-5.5 4 4" />
      </svg>
      <span
        style={{
          fontSize: "0.8rem",
          fontWeight: 600,
          color: "white",
          opacity: 0.65,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        Photo placeholder — {nurseryName}
      </span>
    </div>
  );
}

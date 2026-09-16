export const CAREERS_URL = process.env.NEXT_PUBLIC_CAREERS_URL ?? "http://localhost:3001";

export function nurseryPublicUrl(nurseryId: string) {
  return `${CAREERS_URL}/nurseries/${nurseryId}`;
}

export function positionPublicUrl(nurseryId: string, positionId: string) {
  return `${CAREERS_URL}/nurseries/${nurseryId}/positions/${positionId}`;
}

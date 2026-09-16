// Hardcoded for the prototype — in the real world a manager would already be signed in to that persons nursery or group
export const NURSERIES = [
  { id: "nursery-1", name: "Willow Tree Nursery" },
  { id: "nursery-2", name: "Bramble Bank Nursery" },
  { id: "nursery-3", name: "Sunflower Fields Nursery" },
];

export function getNursery(id: string) {
  return NURSERIES.find((n) => n.id === id);
}

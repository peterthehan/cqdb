export function color(min, max, value) {
  const normalized = (value - min) / (max - min);
  const h = 120 - (1 - normalized) * 120; // green to red
  return `hsl(${h}, 100%, 80%)`;
}
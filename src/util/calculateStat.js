export function calculateStat(base, growth, level, training) {
  return (((level - 1) * growth) + base) * (training / 10 + 1);
}
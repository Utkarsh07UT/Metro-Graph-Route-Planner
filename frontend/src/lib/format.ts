export function formatMinutes(value: number): string {
  const total = Math.round(value);
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}

export function stopsLabel(count: number): string {
  return count === 1 ? "1 stop" : `${count} stops`;
}

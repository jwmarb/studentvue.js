export default function readable(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

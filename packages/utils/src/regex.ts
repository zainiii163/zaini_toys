// Escape user input before interpolating into a RegExp string to prevent
// regex injection / ReDoS (e.g. in $regex Mongo queries).
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateSku(
  prefix: string,
  categoryCode: string,
  index: number,
): string {
  const padded = index.toString().padStart(4, '0');
  return `${prefix.toUpperCase()}-${categoryCode.toUpperCase()}-${padded}`;
}

export function generateOrderNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TOY-${year}${month}${day}-${random}`;
}

export function generateTicketNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const random = Math.floor(10000 + Math.random() * 90000);
  return `TK-${year}-${random}`;
}

export function generatePONumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PO-${year}${month}-${random}`;
}

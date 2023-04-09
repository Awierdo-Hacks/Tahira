// TODO: fulfill function
export function countryByBarcode(barcode: string): string {
  if (barcode.length < 3) return 'Error';
  const GS1Prefix = Number(barcode.slice(0, 3));
  if (GS1Prefix <= 139) return 'US and Canada';
  if (GS1Prefix >= 300 && GS1Prefix <= 379) return 'France';
  if (GS1Prefix >= 400 && GS1Prefix <= 440) return 'Germany';
  if (GS1Prefix == 729) return 'Israel';
  if (GS1Prefix >= 868 && GS1Prefix <= 869) return 'Türkiye';
  return 'Not Found';
}

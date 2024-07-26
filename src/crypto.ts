export let subtleCrypto: SubtleCrypto;

if (typeof window !== 'undefined' && window.crypto) {
  // Browser environment
  subtleCrypto = window.crypto.subtle;
} else if (typeof global !== 'undefined' && (global as any).crypto) {
  // Node.js environment
  subtleCrypto = (global as any).crypto.subtle;
} else {
  throw new Error('No Web Crypto API available.');
}
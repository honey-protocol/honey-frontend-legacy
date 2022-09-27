export const stripTrailingNullBytes = (data: Buffer): Buffer => {
  // need to call this in order to not mutate the original buffer
  const reversed = Uint8Array.prototype.slice.call(data).reverse();
  const lastNonNullByte =
    reversed.length - reversed.findIndex((b) => b !== 0) - 1;
  return Buffer.from(
    Uint8Array.prototype.slice.call(data, 0, lastNonNullByte + 1)
  );
};

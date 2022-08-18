export const formatAddress = (address: any) => {
  if (!address) return null;
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};

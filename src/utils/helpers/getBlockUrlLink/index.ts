const handleLinkTxHash = ({ txHashUrl, txHash }: { txHashUrl: string; txHash: string }) => {
  const link = txHashUrl.replaceAll('tx_hash_string', txHash);
  window.open(link, '_blank');
  return link;
};

const handleLinkAddress = ({ addressUrl, address }: { addressUrl: string; address: string }) => {
  const link = addressUrl.replaceAll('address_string', address);
  window.open(link, '_blank');
  return link;
};

export { handleLinkAddress, handleLinkTxHash };

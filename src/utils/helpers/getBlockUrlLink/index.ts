const handleLinkTxHash = ({ txHashUrl, txHash }: { txHashUrl: string; txHash: string }) => {
  const link = txHashUrl.replaceAll('tx_hash_string', txHash);
  window.open(link, '_blank');
  return link;
};

export { handleLinkTxHash };

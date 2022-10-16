export const truncateHash = (hash?: string, length = 38): string => {
  if (!hash) return ''
  let truncatedHash = hash
  truncatedHash = truncatedHash.replace(truncatedHash.substring(6, length), '…')
  return truncatedHash
}

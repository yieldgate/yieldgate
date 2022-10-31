export const truncateHash = (hash?: string, length = 38): string => {
  if (!hash) return ''
  return hash.replace(hash.substring(6, length), '…')
}

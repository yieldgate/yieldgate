export const enum RevertReasons {
  OnlyBeneficiary = 'only beneficiary',
  AlreadyInitialized = 'already initialized',
  AmountTooLow = 'amount too low',
  StakeStillLocked = 'stake still locked',
  NoSupporter = 'no supporter',
  wethgwApprovalFailed = 'ethgw approval failed',
  AavePoolApprovalFailed = 'AavePool approval failed',
  ZeroAmount = 'zero amount',
  TokenTransferFailed = 'token transfer failed',
}

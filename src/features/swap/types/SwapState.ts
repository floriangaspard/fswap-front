export const SWAP_STATE = {
    INSUFFICIENTLIQUIDITY: 0,
    INITIAL: 1,
    APPROVE: 2,
    APPROVED: 3,
    SWAPPED: 4,
} as const

export type SwapState = (typeof SWAP_STATE)[keyof typeof SWAP_STATE]

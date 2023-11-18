export const DEPOSITE_STATE = {
    INITIAL: 0,
    APPROVE0: 1,
    APPROVE1: 2,
    APPROVED: 3,
    SENT: 4,
} as const

export type DepositState = (typeof DEPOSITE_STATE)[keyof typeof DEPOSITE_STATE]

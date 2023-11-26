import { renderHook } from '@testing-library/react'
import { usePoolContract } from '../usePoolContract'
import { Wallet } from '@/features/wallet'
import { AbstractProvider, BrowserProvider, JsonRpcSigner } from 'ethers'
import { NETWORKS } from '@/features/wallet/utils/networks'

jest.mock('@/constants/addresses', () => ({
    pools: [
        {
            token0: 'AAA',
            token1: 'BBB',
            pool: '0x01',
        },
        {
            token0: 'BBB',
            token1: 'CCC',
            pool: '0x02',
        },
    ],
}))

test('set pool address and contract', () => {
    let browserProvider = BrowserProvider as jest.Mocked<typeof BrowserProvider>
    let jsonRpcSigner = JsonRpcSigner as jest.Mocked<typeof JsonRpcSigner>

    let wallet: Wallet = {
        defaultProvider: new AbstractProvider(),
        browserProvider: browserProvider.prototype,
        network: NETWORKS['sepolia'],
        signer: jsonRpcSigner.prototype,
        ready: true,
    }
    const { result } = renderHook(() => usePoolContract(wallet, 'BBB', 'CCC'))

    expect(result.current.poolAddress).toBe('0x02')
    expect(result.current.poolContract).toBeDefined()
})

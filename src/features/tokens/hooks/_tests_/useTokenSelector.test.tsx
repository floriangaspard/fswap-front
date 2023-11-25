import { act, renderHook } from '@testing-library/react'
import { useTokenSelector } from '../useTokenSelector'

jest.mock('@/constants/addresses', () => ({
    tokenList: { AAA: '0x01', BBB: '0x02', CCC: '0x03' },
}))

test('set first token', () => {
    const { result } = renderHook(() => useTokenSelector())
    expect(result.current.token0).toBe('AAA')
    expect(result.current.token1).toBe('BBB')

    act(() => {
        result.current.setToken0('CCC')
    })

    expect(result.current.token0).toBe('CCC')
    expect(result.current.token1).toBe('BBB')
})

test('set second token', () => {
    const { result } = renderHook(() => useTokenSelector())
    expect(result.current.token0).toBe('AAA')
    expect(result.current.token1).toBe('BBB')

    act(() => {
        result.current.setToken1('CCC')
    })

    expect(result.current.token0).toBe('AAA')
    expect(result.current.token1).toBe('CCC')
})

test('set first token same as second token', () => {
    const { result } = renderHook(() => useTokenSelector())
    expect(result.current.token0).toBe('AAA')
    expect(result.current.token1).toBe('BBB')

    act(() => {
        result.current.setToken0('BBB')
    })

    expect(result.current.token0).toBe('BBB')
    expect(result.current.token1).toBe('AAA')
})

test('set second token same as first token', () => {
    const { result } = renderHook(() => useTokenSelector())
    expect(result.current.token0).toBe('AAA')
    expect(result.current.token1).toBe('BBB')

    act(() => {
        result.current.setToken1('AAA')
    })

    expect(result.current.token0).toBe('BBB')
    expect(result.current.token1).toBe('AAA')
})

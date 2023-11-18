import { useState } from 'react'

import { tokenList } from '../../../constants/addresses'

export const useTokenSelector = () => {
    const [token0, _setToken0] = useState<string>(Object.keys(tokenList)[0])
    const [token1, _setToken1] = useState<string>(Object.keys(tokenList)[1])

    const setToken0 = (token: string) => {
        if (token === token1) {
            const tmp = token0
            _setToken0(token)
            _setToken1(tmp)
        } else {
            _setToken0(token)
        }
    }

    const setToken1 = (token: string) => {
        if (token === token0) {
            const tmp = token1
            _setToken1(token)
            _setToken0(tmp)
        } else {
            _setToken1(token)
        }
    }

    return { token0, setToken0, token1, setToken1 }
}

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { AbstractProvider, BrowserProvider, JsonRpcSigner } from 'ethers'
import { faCheck, faRepeat } from '@fortawesome/free-solid-svg-icons'

import { useWallet } from '../hooks/useWallet'
import { NETWORKS, NETWORKS_HEX } from '../utils/networks'

export interface Wallet {
    defaultProvider: AbstractProvider
    browserProvider: BrowserProvider | null
    signer: JsonRpcSigner | null
    network: bigint
    ready: boolean
}

interface WalletProps {
    wallet: Wallet
    setWallet: (wallet: React.SetStateAction<Wallet>) => void
}

export function Web3Wallet(props: WalletProps) {
    const { connectWallet, switchNetwork, address } = useWallet(
        props.wallet,
        props.setWallet
    )

    return (
        <>
            {props.wallet.browserProvider && props.wallet.signer ? (
                <div className="flex justify-between mb-7 items-center">
                    <div className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-3 text-md overflow-hidden text-ellipsis text-left w-3/5 whitespace-nowrap text-white">
                        Wallet {address}
                    </div>
                    {props.wallet.network !== NETWORKS['sepolia'] ? (
                        <button
                            className="rounded-md ml-2 w-2/5 p-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold"
                            onClick={() =>
                                switchNetwork(NETWORKS_HEX['sepolia'])
                            }
                        >
                            Network
                            <FontAwesomeIcon
                                icon={faRepeat}
                                className="text-white pl-2"
                            />
                        </button>
                    ) : (
                        <div className="rounded-md ml-2 w-2/5 p-3 bg-gradient-to-r from-lime-500 to-green-500 text-white font-semibold">
                            Sepolia
                            <FontAwesomeIcon
                                icon={faCheck}
                                className="text-white pl-2"
                            />
                        </div>
                    )}
                </div>
            ) : (
                <button
                    className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 p-3 text-xl flex mb-8 w-3/5 text-white justify-center"
                    onClick={connectWallet}
                >
                    Connect Wallet
                </button>
            )}
        </>
    )
}

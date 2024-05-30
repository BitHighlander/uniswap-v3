import * as React from 'react'
import { useAccount, useContractWrite } from 'wagmi'

const abi = [
    "function mint((address token0, address token1, uint24 fee, int24 tickLower, int24 tickUpper, uint128 amount0Desired, uint128 amount1Desired, uint128 amount0Min, uint128 amount1Min, address recipient, uint256 deadline)) external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
]

export function MintLPPosition() {
    const { address } = useAccount()
    const [fromAddress, setFromAddress] = React.useState(address || '')
    const [isLoading, setIsLoading] = React.useState(false)
    const [transactionHash, setTransactionHash] = React.useState<string | null>(null)
    const [error, setError] = React.useState<string | null>(null)

    React.useEffect(() => {
        if (address) {
            setFromAddress(address)
        }
    }, [address])

    const params = {
        token0: '0x4200000000000000000000000000000000000006',
        token1: '0xef743df8eda497bcf1977393c401a636518dd630',
        fee: 3000,
        tickLower: -60000,
        tickUpper: 60000,
        amount0Desired: 10000000000000000n, // 0.01 token0
        amount1Desired: 41200000000000000000n, // 41.2 token1
        amount0Min: 1000000000000000n, // 0.001 token0
        amount1Min: 900000000000000000n, // 0.9 token1
        recipient: fromAddress,
        deadline: BigInt(Math.floor(Date.now() / 1000) + 60 * 20),
    }

    const { write, data, isLoading: isWriting, error: writeError } = useContractWrite({
        address: '0x03a520b32c04bf3beef7beb72e919cf822ed34f1',
        abi,
        functionName: 'mint',
        args: [params],
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)
        try {
            console.log("Sending transaction...")
            write?.()
            console.log("Transaction result:", data)
            setTransactionHash(data?.hash || null)
        } catch (e: any) {
            console.error(e)
            setError(e.message)
        } finally {
            setIsLoading(false)
        }
    }

    React.useEffect(() => {
        if (writeError) {
            setError(writeError.message)
        }
    }, [writeError])

    return (
        <form onSubmit={handleSubmit}>
            <button disabled={isWriting || isLoading} type="submit">
                {isWriting || isLoading ? 'Minting...' : 'Mint LP Position'}
            </button>
            {transactionHash && <div>Transaction Hash: {transactionHash}</div>}
            {error && <div>Error: {error}</div>}
        </form>
    )
}

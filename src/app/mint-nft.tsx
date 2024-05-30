import * as React from 'react'
import {
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { abi } from './abi'

export function MintNFT() {
    const {
        data: hash,
        isPending,
        writeContract
    } = useWriteContract()

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        const tokenId = formData.get('tokenId') as string
        writeContract({
            address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
            abi,
            functionName: 'mint',
            args: [BigInt(tokenId)],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <form onSubmit={submit}>
            <input name="tokenId" placeholder="Token ID" required />
            <button
                disabled={isPending}
                type="submit"
            >
                {isPending ? 'Confirming...' : 'Mint'}
            </button>
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
        </form>
    )
}

export default MintNFT

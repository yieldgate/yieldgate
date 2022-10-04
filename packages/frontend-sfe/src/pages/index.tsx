import { ConnectButton } from '@rainbow-me/rainbowkit'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <div tw="flex flex-col justify-center items-center space-y-4 h-screen">
        <h1 tw="font-display">Stake for Earth</h1>
        <ConnectButton />
      </div>
    </>
  )
}

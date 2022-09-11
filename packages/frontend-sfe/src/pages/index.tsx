import { ConnectButton } from '@rainbow-me/rainbowkit'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <div className="flex flex-col justify-center items-center space-y-4 h-screen">
        <div>Stake for Earth</div>
        <ConnectButton />
      </div>
    </>
  )
}

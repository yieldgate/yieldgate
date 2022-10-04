import { CenterBody } from '@components/layout/CenterBody'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <CenterBody>
        <h1 tw="font-display mb-4">Stake for Earth</h1>
        <ConnectButton />
      </CenterBody>
    </>
  )
}

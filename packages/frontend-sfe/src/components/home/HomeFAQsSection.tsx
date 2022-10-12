import { Wrapper } from '@components/layout/Wrapper'
import { FAQItem, FAQsSection } from '@components/shared/FAQsSection'
import { Subheading } from '@components/shared/Subheading'
import { FC } from 'react'
import 'twin.macro'

const faqItems: FAQItem[] = [
  {
    question: 'What is Stake for Earth?',
    answer: `Stake for Earth is a platform where anyone can passively participate in climate action. Anyone can stake USDC in the carbon pool and the yield generated will be used to burn carbon credits, effectively **contributing** to removing carbon from our atmosphere. In return, one receives an NFT which acts as a proof/certificate for climate action.`,
  },
  {
    question: 'Who is behind Stake for Earth?',
    answer: `Stake for Earth was founded by a group of crypto vets (XXX, XXX, {Twitter Handles), that spun out the project after being one of the winners at EthGlobal in Amsterdam in 2022. They won at several other hackathons (i.e. EthBerlin, EthWarsaw, EthCC) and received grant funding from several large players in the crypto space (i.e. Aave, The Graph, Toucan, etc.).`,
  },
  {
    question: 'What assets can I stake in the carbon pool?',
    answer: `For now, you can stake USDC in the carbon pool. Other crypto assets coming soon…`,
  },
]

export interface HomeFAQsSectionProps {}
export const HomeFAQsSection: FC<HomeFAQsSectionProps> = () => {
  return (
    <>
      <Wrapper tw="max-w-[50rem]">
        <div tw="flex flex-col mb-2">
          <Subheading>Questions? We answer.</Subheading>
          <FAQsSection items={faqItems} openFirst={true} />
        </div>
      </Wrapper>
    </>
  )
}

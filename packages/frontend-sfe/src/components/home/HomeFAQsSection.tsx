import { Wrapper } from '@components/layout/Wrapper'
import { FAQItem, FAQSection } from '@components/shared/FaqSection'
import { Subheading } from '@components/shared/Subheading'
import { FC } from 'react'
import 'twin.macro'

const faqItems: FAQItem[] = [
  {
    question: 'Justo Inceptos Ornare?',
    answer: `Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.`,
  },
  {
    question: 'Mattis Venenatis Egestas?',
    answer: `Nullam quis risus eget urna mollis ornare vel eu leo.`,
  },
  {
    question: 'Fusce Malesuada Ipsum?',
    answer:
      'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Donec sed odio dui. Vestibulum id ligula porta felis euismod semper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur blandit tempus porttitor. Nullam quis risus eget urna mollis ornare vel eu leo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  },
  {
    question: 'Sem Tristique Vehicula Vulputate?',
    answer: `Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus.`,
  },
]

export interface HomeFAQsSectionProps {}
export const HomeFAQsSection: FC<HomeFAQsSectionProps> = () => {
  return (
    <>
      <Wrapper tw="max-w-[50rem]">
        <div tw="flex flex-col mb-2">
          <Subheading>Questions? We answer.</Subheading>
          <FAQSection items={faqItems} openFirst={true} />
        </div>
      </Wrapper>
    </>
  )
}

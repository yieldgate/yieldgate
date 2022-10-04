import { Wrapper } from '@components/layout/Wrapper'
import { Disclosure } from '@headlessui/react'
import { FC } from 'react'
import { HiMinus, HiPlus } from 'react-icons/hi'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeFAQItem {
  question: string
  answer: string
}

const items: HomeFAQItem[] = [
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
    answer: `Donec sed odio dui. Vestibulum id ligula porta felis euismod semper.`,
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
          <h2 tw="font-display text-3xl font-bold tracking-tight mb-4">Questions? We answer.</h2>
          {items.map((item, index) => (
            <HomeFAQsSectionEl key={`faq-${index}`} item={item} index={index} />
          ))}
        </div>
      </Wrapper>
    </>
  )
}

export interface HomeFAQsSectionElProps {
  item: HomeFAQItem
  index: number
}
export const HomeFAQsSectionEl: FC<HomeFAQsSectionElProps> = ({ item, index }) => {
  return (
    <>
      <Disclosure defaultOpen={index === 0} as="div" tw="py-4 border-b border-gray-200">
        {({ open }) => (
          <>
            <Disclosure.Button
              css={[
                tw`flex w-full font-semibold cursor-help`,
                open ? tw`text-black` : tw`text-gray-700 hover:text-black`,
              ]}
            >
              <h3 tw="grow text-left mr-2">{item.question}</h3>
              {open ? (
                <HiMinus tw="h-5 w-5 shrink-0 grow-0" />
              ) : (
                <HiPlus tw="h-5 w-5 shrink-0 grow-0" />
              )}
            </Disclosure.Button>
            <Disclosure.Panel tw="mt-2 text-sm">{item.answer}</Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}

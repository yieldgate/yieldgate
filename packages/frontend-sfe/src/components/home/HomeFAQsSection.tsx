import { Wrapper } from '@components/layout/Wrapper'
import { Subheading } from '@components/shared/Subheading'
import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import { FC } from 'react'
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
          <Subheading>Questions? We answer.</Subheading>
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
  const animationProps: AnimationProps = {
    initial: {
      opacity: 0,
      y: -5,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      y: -5,
      transition: {
        duration: 0.15,
      },
    },
  }

  return (
    <>
      <Disclosure defaultOpen={index === 0} as="div" tw="pt-2 pb-3 border-b border-gray-200">
        {({ open }) => {
          const Icon = open ? MinusIcon : PlusIcon
          return (
            <>
              <Disclosure.Button
                css={[
                  tw`flex items-center w-full font-semibold cursor-help`,
                  open ? tw`text-black` : tw`text-gray-700 hover:text-black`,
                ]}
              >
                <h3 tw="grow text-left pt-2 pb-1 mr-2">{item.question}</h3>
                <Icon tw="h-5 w-5 shrink-0 grow-0" />
              </Disclosure.Button>
              <AnimatePresence mode="wait">
                <Disclosure.Panel key={`disclosure-panel-${index}`} as={m.div} {...animationProps}>
                  <div tw="text-sm my-1">{item.answer}</div>
                </Disclosure.Panel>
              </AnimatePresence>
            </>
          )
        }}
      </Disclosure>
    </>
  )
}

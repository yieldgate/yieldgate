import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQSectionProps {
  items: FAQItem[]
  openFirst?: boolean
}
export const FAQSection: FC<FAQSectionProps> = ({ items, openFirst, ...props }) => {
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
      <div {...props}>
        {items.map((item, index) => (
          <Disclosure
            key={`faq-${index}`}
            defaultOpen={index === 0 && openFirst}
            as="div"
            tw="pt-2 pb-3 border-b border-gray-200"
          >
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
                    <Disclosure.Panel
                      key={`disclosure-panel-${index}`}
                      as={m.div}
                      {...animationProps}
                    >
                      <div tw="text-sm my-1">{item.answer}</div>
                    </Disclosure.Panel>
                  </AnimatePresence>
                </>
              )
            }}
          </Disclosure>
        ))}
      </div>
    </>
  )
}

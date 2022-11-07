import { Disclosure } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { RenderedMarkdownContent } from './RenderedMarkdownContent'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQsSectionProps {
  items: FAQItem[]
  openFirst?: boolean
}
export const FAQsSection: FC<FAQsSectionProps> = ({ items, openFirst, ...props }) => {
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
            tw="border-gray-200 border-b pt-2 pb-3"
          >
            {({ open }) => {
              const Icon = open ? MinusIcon : PlusIcon
              return (
                <>
                  <Disclosure.Button
                    css={[
                      tw`flex w-full cursor-help items-center font-semibold`,
                      open ? tw`text-black` : tw`text-gray-700 hover:text-black`,
                    ]}
                  >
                    <h3 tw="mr-2 grow pt-2 pb-1 text-left">{item.question}</h3>
                    <Icon tw="h-5 w-5 shrink-0 grow-0" />
                  </Disclosure.Button>
                  <AnimatePresence mode="wait">
                    <Disclosure.Panel
                      key={`disclosure-panel-${index}`}
                      as={m.div}
                      {...animationProps}
                    >
                      <RenderedMarkdownContent
                        content={item.answer}
                        tw="prose prose-sm first:prose-p:mt-2 last:prose-p:mb-2"
                      />
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

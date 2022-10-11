import { Tab } from '@headlessui/react'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import { FC, Fragment, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface StakingStepperItem {
  title: string
  shortTitle?: string
  component: FC
}
export interface StakingHorizontalStepperProps {
  items: StakingStepperItem[]
}
export const StakingHorizontalStepper: FC<StakingHorizontalStepperProps> = ({ items }) => {
  const [previousIndex, setPreviousIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState(items[0])
  const animationProps: AnimationProps & { static?: boolean } = {
    static: true,
    initial: {
      opacity: 0,
      x: 10 * (previousIndex < selectedIndex ? 1 : -1),
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.15,
      },
    },
    exit: {
      opacity: 0,
      x: 10 * (previousIndex < selectedIndex ? 1 : -1),
      transition: {
        duration: 0.15,
      },
    },
  }

  return (
    <>
      <Tab.Group
        manual
        selectedIndex={selectedIndex}
        as="div"
        tw="flex flex-col h-full"
        onChange={(index: any) => {
          setPreviousIndex(selectedIndex)
          setSelectedIndex(index)
          setSelectedItem(items[index])
        }}
      >
        {/* Stepper Titles  */}
        <Tab.List tw="flex justify-center items-center space-x-6 -mt-0.5 mb-4">
          {items.map((item, idx) => (
            <Fragment key={`stepper-button-${idx}`}>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    css={[
                      tw`flex items-center space-x-3 transition-opacity`,
                      idx <= selectedIndex ? tw`opacity-100` : tw`opacity-40 hover:(opacity-100)`,
                    ]}
                  >
                    <div
                      css={[
                        tw`w-9 h-9 flex justify-center items-center bg-black text-white font-semibold rounded-full`,
                        idx === selectedIndex && tw`ring-2 ring-offset-2 ring-primary-200`,
                      ]}
                    >
                      {idx + 1}
                    </div>
                    <div tw="font-semibold">
                      {!!item.shortTitle && <span tw="lg:hidden">{item.shortTitle}</span>}
                      <span css={[item.shortTitle && tw`hidden lg:inline`]}>{item.title}</span>
                    </div>
                  </button>
                )}
              </Tab>
              {idx !== items.length - 1 && (
                <div>
                  <ChevronRightIcon tw="text-gray-400 h-5 w-5 grow-0 shrink-0" />
                </div>
              )}
            </Fragment>
          ))}
        </Tab.List>

        {/* Stepper Content  */}
        <Tab.Panels tw="grow flex flex-col">
          <AnimatePresence mode="wait">
            <Tab.Panel
              key={`stepper-panel-${selectedIndex}`}
              as={m.div}
              tw="grow flex flex-col justify-center items-center"
              {...animationProps}
            >
              <selectedItem.component />
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

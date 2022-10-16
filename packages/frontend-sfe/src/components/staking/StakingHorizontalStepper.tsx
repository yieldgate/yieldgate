import { Tab } from '@headlessui/react'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useIsSSR } from '@lib/useIsSSR'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import { FC, forwardRef, Fragment, useEffect, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface StakingStepperItemComponentProps {
  onGoPrev: () => void
  onGoNext: () => void
  firstRender?: boolean
}
export interface StakingStepperItem {
  title: string
  component: FC<StakingStepperItemComponentProps>
  shortTitle?: string
  subTitle?: string
  disabled?: boolean
}

export interface StakingHorizontalStepperProps {
  items: StakingStepperItem[]
}
export const StakingHorizontalStepper: FC<StakingHorizontalStepperProps> = ({ items }) => {
  const [previousIndex, setPreviousIndex] = useState<number | undefined>(undefined)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState(items[0])

  // Navigate back to first if currently selected one gets disabled
  useEffect(() => {
    const isDisabled = items?.[selectedIndex]?.disabled
    if (isDisabled && selectedIndex !== 0) setIndex(0)
  }, [items])

  // Tab-panel animation properties
  const x = previousIndex === undefined ? 0 : 10 * (previousIndex < selectedIndex ? 1 : -1)
  const animationProps: AnimationProps & { static?: boolean } = {
    static: true,
    initial: {
      opacity: 0,
      x,
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
      x,
      transition: {
        duration: 0.15,
      },
    },
  }

  // Set new index with overflow-check
  const setIndex = (val: number) => {
    setPreviousIndex(selectedIndex)
    const newSelectedIndex = Math.max(0, Math.min(val, items.length - 1))
    setSelectedIndex(newSelectedIndex)
  }

  // Update selected item
  useEffect(() => {
    setSelectedItem(items[selectedIndex])
  }, [selectedIndex, items])

  return (
    <>
      <Tab.Group
        manual
        selectedIndex={selectedIndex}
        as="div"
        tw="flex flex-col h-full"
        onChange={(val: any) => {
          setIndex(val)
        }}
      >
        {/* Stepper Titles/Tabs  */}
        <Tab.List tw="flex justify-center items-center space-x-6 mt-2 sm:mt-0 lg:-mt-0.5">
          {items.map((item, idx) => (
            <Fragment key={`stepper-button-${idx}`}>
              <Tab as={Fragment}>
                {(props) => (
                  <StakingHorizontalStepperTabButton
                    item={item}
                    index={idx}
                    selectedIndex={selectedIndex}
                    {...props}
                  />
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
              tw="grow flex flex-col py-12"
              {...animationProps}
            >
              {!!selectedItem?.component && (
                <selectedItem.component
                  onGoPrev={() => {
                    setIndex(selectedIndex - 1)
                  }}
                  onGoNext={() => {
                    setIndex(selectedIndex + 1)
                  }}
                  firstRender={previousIndex === undefined}
                />
              )}
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

export interface StakingHorizontalStepperTabButtonProps {
  item: StakingStepperItem
  selected: boolean
  index: number
  selectedIndex: number
}
export const StakingHorizontalStepperTabButton = forwardRef<
  HTMLButtonElement,
  StakingHorizontalStepperTabButtonProps
>(function StakingHorizontalStepperTabButton({ item, index, selectedIndex, ...props }, ref) {
  const isSSR = useIsSSR()

  return (
    <button
      type="button"
      ref={ref}
      className="group"
      css={[
        tw`flex items-center space-x-3 transition-opacity outline-none disabled:cursor-not-allowed`,
        index <= selectedIndex ? tw`opacity-100` : tw`opacity-40 not-disabled:hocus:(opacity-100)`,
      ]}
      disabled={item.disabled}
      {...props}
    >
      <div
        css={[
          tw`w-8 h-8 flex justify-center items-center bg-black text-white font-semibold rounded-full`,
          tw`group-focus:(ring-2 ring-offset-2 ring-primary-500)`,
          index === selectedIndex && tw`ring-2 ring-offset-2 ring-black`,
        ]}
      >
        {index < selectedIndex ? <CheckIcon tw="h-4 w-4 grow-0 shrink-0" /> : <>{index + 1}</>}
      </div>
      <div tw="flex flex-col items-start">
        <div tw="font-semibold">
          {!!item.shortTitle && <span tw="lg:hidden">{item.shortTitle}</span>}
          <span css={[item.shortTitle && tw`hidden lg:inline`]}>{item.title}</span>
        </div>
        {!!item.subTitle && !isSSR && (
          <div tw="hidden lg:inline text-xs text-gray-700 -mt-0.5">{item.subTitle}</div>
        )}
      </div>
    </button>
  )
})

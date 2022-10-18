import { Tab } from '@headlessui/react'
import { CheckIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useIsSSR } from '@lib/useIsSSR'
import { AnimatePresence, m } from 'framer-motion'
import { FC, forwardRef, Fragment, useEffect, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export type StakingViewStakeDonateMode = 'stake' | 'donate'
export interface StakingStepperItemComponentProps {
  onGoPrev: () => void
  onGoNext: () => void
  firstRender?: boolean
  mode: StakingViewStakeDonateMode
}
export interface StakingStepperItem {
  title: string
  component: FC<StakingStepperItemComponentProps>
  shortTitle?: string
  subTitle?: string
  disabled?: boolean
  invisible?: boolean
}

export interface StakingStepperProps {
  items: StakingStepperItem[]
  mode: StakingViewStakeDonateMode
}
export const StakingStepper: FC<StakingStepperProps> = ({ items, mode }) => {
  type IndexState = { selected: number; previous: undefined | number }
  const [index, setIndexState] = useState<IndexState>({ selected: 0, previous: undefined })
  const [selectedItem, setSelectedItem] = useState(items[0])
  const setIndex = (val: number) => {
    setIndexState((index) => ({
      selected: Math.max(0, Math.min(val, items.length - 1)),
      previous: index.selected,
    }))
  }

  // Update selected item
  useEffect(() => {
    setSelectedItem(items[index.selected])
  }, [index.selected, items])

  // Navigate back if item gets disabled dynamically
  useEffect(() => {
    const isDisabled = items?.[index.selected]?.disabled
    if (isDisabled && index.selected !== 0) setIndex(0)
  }, [items])

  return (
    <>
      <Tab.Group
        manual
        selectedIndex={index.selected}
        as="div"
        tw="flex flex-col h-full"
        onChange={setIndex as any}
      >
        {/* Stepper Titles/Tabs  */}
        <Tab.List tw="flex justify-center items-center space-x-6 mt-2 sm:mt-0 lg:-mt-0.5">
          {items
            .filter((i) => !i.invisible)
            .map((item, idx) => (
              <Fragment key={`stepper-button-${idx}`}>
                {idx !== 0 && (
                  <div>
                    <ChevronRightIcon tw="text-gray-400 h-5 w-5 grow-0 shrink-0" />
                  </div>
                )}
                <Tab as={Fragment}>
                  {(props) => (
                    <StakingStepperTabButton
                      item={item}
                      index={idx}
                      selectedIndex={index.selected}
                      {...props}
                    />
                  )}
                </Tab>
              </Fragment>
            ))}
        </Tab.List>

        {/* Stepper Content  */}
        <Tab.Panels tw="grow flex flex-col">
          <AnimatePresence mode="wait">
            <Tab.Panel
              key={`stepper-panel-${selectedItem?.title}`}
              as={m.div}
              tw="grow flex flex-col py-12 outline-none"
              static={true}
              initial={{
                opacity: 0,
                x: 10 * ((index.previous || 0) < index.selected ? 1 : -1),
              }}
              animate={{
                opacity: 1,
                x: 0,
                transition: {
                  duration: index.previous === undefined ? 0 : 0.15,
                },
              }}
              exit={{
                opacity: 0,
                x: 10 * ((index.previous || 0) > index.selected ? 1 : -1),
                transition: {
                  duration: 0.15,
                },
              }}
            >
              {!!selectedItem?.component && (
                <selectedItem.component
                  key={`selected-item-${selectedItem.title}`}
                  onGoPrev={() => {
                    setIndex(index.selected - 1)
                  }}
                  onGoNext={() => {
                    setIndex(index.selected + 1)
                  }}
                  firstRender={index.previous === undefined}
                  mode={mode}
                />
              )}
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

export interface StakingStepperTabButtonProps {
  item: StakingStepperItem
  selected: boolean
  index: number
  selectedIndex: number
}
export const StakingStepperTabButton = forwardRef<HTMLButtonElement, StakingStepperTabButtonProps>(
  function StakingStepperTabButton({ item, index, selectedIndex, ...props }, ref) {
    const isSSR = useIsSSR()

    return (
      <button
        type="button"
        ref={ref}
        className="group"
        css={[
          tw`flex items-center space-x-3 transition-opacity outline-none disabled:cursor-not-allowed`,
          index <= selectedIndex
            ? tw`opacity-100`
            : tw`opacity-40 not-disabled:hocus:(opacity-100)`,
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
            <div tw="inline text-xs text-gray-700 -mt-0.5">{item.subTitle}</div>
          )}
        </div>
      </button>
    )
  }
)

import { Wrapper } from '@components/layout/Wrapper'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import { Tab } from '@headlessui/react'
import {
  ArrowPathRoundedSquareIcon,
  CheckBadgeIcon,
  CursorArrowRaysIcon,
  GlobeEuropeAfricaIcon,
} from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
import md from 'markdown-it'
import { FC, Fragment, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeHowItWorksItem {
  title: string
  shortTitle: string
  icon: FC
  content: string
}

const items: HomeHowItWorksItem[] = [
  {
    title: 'Staking to generate yield',
    shortTitle: 'Staking',
    icon: CursorArrowRaysIcon,
    content: `Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Nullam quis risus eget urna mollis ornare vel eu leo. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.`,
  },
  {
    title: 'USDC Yield is swapped to BCT every x period',
    shortTitle: 'Swap',
    icon: ArrowPathRoundedSquareIcon,
    content: `Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.`,
  },
  {
    title: 'Carbon Credits Burning',
    shortTitle: 'Credits',
    icon: GlobeEuropeAfricaIcon,
    content: `Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.`,
  },
  {
    title: 'NFT headline otam rem aperiam',
    shortTitle: 'NFT',
    icon: CheckBadgeIcon,
    content: `Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.`,
  },
]

export interface HomeHowItWorksSectionProps {}
export const HomeHowItWorksSection: FC<HomeHowItWorksSectionProps> = () => {
  return (
    <>
      <div tw="bg-gray-700 text-white py-3 lg:py-6">
        <Wrapper>
          {/* Title & Tagline */}
          <div tw="max-w-[25rem]">
            <SubheadingSmall noHeadingMarkup={true} tw="text-gray-200">
              How it works
            </SubheadingSmall>
            <Subheading tagline="Aenean eu leo quam. Pellentesque ornare sem lacinia quam.">
              How it works headline otam rem aperiam.
            </Subheading>
          </div>

          {/* Tabs  */}
          <HomeHowItWorksTabs />
        </Wrapper>
      </div>
    </>
  )
}

export interface HomeHowItWorksTabsProps {}
export const HomeHowItWorksTabs: FC<HomeHowItWorksTabsProps> = () => {
  const [previousIndex, setPreviousIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedItem, setSelectedItem] = useState(items[0])
  const animationProps: AnimationProps & { static: boolean } = {
    static: true,
    initial: {
      opacity: 0,
      y: 12 * (previousIndex < selectedIndex ? 1 : -1),
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
      y: 12 * (previousIndex < selectedIndex ? 1 : -1),
      transition: {
        duration: 0.15,
      },
    },
  }

  return (
    <>
      <Tab.Group
        vertical
        as="div"
        tw="flex mt-14"
        onChange={(index: any) => {
          setPreviousIndex(selectedIndex)
          setSelectedIndex(index)
          setSelectedItem(items[index])
        }}
      >
        {/* Tab Titles  */}
        <Tab.List tw="shrink-0 grow-0 flex flex-col py-6 border-r-[2px] border-gray-600">
          {items.map((item, idx) => (
            <Tab as={Fragment} key={`tab-button-${idx}`}>
              {({ selected }) => (
                <button
                  css={[
                    tw`text-left tracking-wide whitespace-nowrap py-2 pr-6 sm:pr-12 -mr-[2px] border-r-[2px] border-transparent outline-none`,
                    selected
                      ? tw`text-white  border-white`
                      : tw`text-gray-400 cursor-pointer hover:text-white`,
                  ]}
                >
                  <span tw="mr-4 hidden sm:inline">0{idx + 1}</span>
                  {item.shortTitle}
                </button>
              )}
            </Tab>
          ))}
        </Tab.List>

        {/* Tab Content  */}
        <Tab.Panels tw="flex flex-col justify-start w-full">
          <AnimatePresence mode="wait">
            <Tab.Panel key={`tab-panel-${selectedIndex}`} as={m.div} {...animationProps}>
              <div tw="flex justify-between items-start py-2">
                <div tw="max-w-prose pl-6 md:px-6 lg:px-12">
                  <h3 tw="font-display text-2xl font-bold tracking-tight mb-4">
                    {selectedItem.title}
                  </h3>
                  <div
                    dangerouslySetInnerHTML={{ __html: md().render(selectedItem.content) }}
                  ></div>
                </div>
                <div tw="hidden md:flex h-[9rem] w-[9rem] shrink-0 grow-0 ml-auto justify-center items-center bg-gray-800 rounded-full">
                  <selectedItem.icon tw="h-[4rem] w-[4rem] text-gray-500" />
                </div>
              </div>
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

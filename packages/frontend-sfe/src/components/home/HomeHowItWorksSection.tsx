import { Wrapper } from '@components/layout/Wrapper'
import { RenderedMarkdownContent } from '@components/shared/RenderedMarkdownContent'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import { Tab } from '@headlessui/react'
import {
  ArrowPathRoundedSquareIcon,
  CheckBadgeIcon,
  CursorArrowRaysIcon,
  GlobeEuropeAfricaIcon,
} from '@heroicons/react/24/solid'
import { AnimatePresence, AnimationProps, m } from 'framer-motion'
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
    content: `Stake for Earth is built on top of Polygon and the Aave protocol, which it uses to securely and efficiently enable anyone staking into the carbon pool to generate yield. The staker can decide to either make a withdrawable pledge or a donation. The latter enables the staker to make a perpetual stake, generating yield and buying up carbon tokens in perpetuity from the donated amount. As of now, we only support the staking of USDC with more crypto assets coming in the near future.`,
  },
  {
    title: 'USDC yield is swapped to BCT or NCT ',
    shortTitle: 'Swap',
    icon: ArrowPathRoundedSquareIcon,
    content: `Stake for Earth’s carbon pool and smart contract automatically swaps the yield generated from the staked USDC to BCT or NCT. BCT and NCT are both ERC-20 carbon tokens built on top of the Toucan protocol running on Polygon. They represent real carbon credits which have been bridged to the Toucan blockchain through its meta registry. Each BCT or NCT represent one tonnes of carbon removed from our atmosphere by carbon offset projects. You can read more about Toucan’s NCT tokens <a href="https://blog.toucan.earth/announcing-nct-nature-carbon-tonne/" target="_blank">here</a>.`,
  },
  {
    title: 'Carbon Credits Burning',
    shortTitle: 'Credits',
    icon: GlobeEuropeAfricaIcon,
    content: `After the carbon pool’s yield has been swapped to either BCT or NCT, our smart contract automatically retires the carbon tokens by either locking them irreversible in our treasury or by converting the BCT or NCT into TCO2 and burns them. You can read more about the retirement process <a href="https://docs.toucan.earth/toucan/pool/redeem" target="_blank">here</a>.`,
  },
  {
    title: 'Climate Action Badge',
    shortTitle: 'Badge',
    icon: CheckBadgeIcon,
    content: `As soon as users stake or donate crypto into the carbon pool, they receive a climate action badge NFT. This enables them to prove their participation in climate action through Stake for Earth. It further allows them to highlight their relative contribution to the emissions removed with Stake for Earth. We believe that anyone, including crypto native companies, will use the badge as a new way to promote climate action with crypto embedding it on the footer of their website or in a tweet.`,
  },
]

export interface HomeHowItWorksSectionProps {}
export const HomeHowItWorksSection: FC<HomeHowItWorksSectionProps> = () => {
  return (
    <>
      <div tw="bg-gray-700 py-2 text-white lg:py-4">
        <Wrapper>
          {/* Title & Tagline */}
          <div tw="max-w-[25rem]">
            <SubheadingSmall noHeadingMarkup={true} tw="text-gray-200">
              The process
            </SubheadingSmall>
            <Subheading tagline="Everything from staking to credit burning explained.">
              How it works
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
        tw="mt-14 flex"
        onChange={(index: any) => {
          setPreviousIndex(selectedIndex)
          setSelectedIndex(index)
          setSelectedItem(items[index])
        }}
      >
        {/* Tab Titles  */}
        <Tab.List tw="flex shrink-0 grow-0 flex-col border-gray-600 py-6 border-r-[2px]">
          {items.map((item, idx) => (
            <Tab as={Fragment} key={`tab-button-${idx}`}>
              {({ selected }) => (
                <button
                  css={[
                    tw`whitespace-nowrap border-transparent py-2 pr-6 text-left tracking-wide outline-none -mr-[2px] border-r-[2px] sm:pr-12`,
                    selected
                      ? tw`border-white text-white`
                      : tw`cursor-pointer text-gray-400 hover:text-white`,
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
        <Tab.Panels tw="flex w-full flex-col justify-start">
          <AnimatePresence mode="wait">
            <Tab.Panel key={`tab-panel-${selectedIndex}`} as={m.div} {...animationProps}>
              <div tw="flex items-start justify-between py-2">
                <div tw="max-w-prose pl-6 md:px-6 lg:px-12">
                  <h3 tw="mb-4 font-display font-bold text-2xl tracking-tight">
                    {selectedItem.title}
                  </h3>
                  <RenderedMarkdownContent content={selectedItem.content} tw="prose prose-invert" />
                </div>
                <div tw="ml-auto hidden shrink-0 grow-0 items-center justify-center rounded-full bg-gray-800 h-[9rem] w-[9rem] md:flex">
                  <selectedItem.icon tw="text-gray-500 h-[4rem] w-[4rem]" />
                </div>
              </div>
            </Tab.Panel>
          </AnimatePresence>
        </Tab.Panels>
      </Tab.Group>
    </>
  )
}

import { Wrapper } from '@components/layout/Wrapper'
import { Subheading } from '@components/shared/Subheading'
import { Tab } from '@headlessui/react'
import md from 'markdown-it'
import { FC, Fragment } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface HomeHowItWorksItem {
  title: string
  shortTitle: string
  content: string
}

const items: HomeHowItWorksItem[] = [
  {
    title: 'Staking to generate yield',
    shortTitle: 'Staking',
    content: `Etiam porta sem malesuada magna mollis euismod. Donec id elit non mi porta gravida at eget metus. Nullam quis risus eget urna mollis ornare vel eu leo. Etiam porta sem malesuada magna mollis euismod. Nullam quis risus eget urna mollis ornare vel eu leo. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.`,
  },
  {
    title: 'USDC Yield is swapped to BCT every x period',
    shortTitle: 'Swap',
    content: `Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Nullam quis risus eget urna mollis ornare vel eu leo. Donec id elit non mi porta gravida at eget metus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.`,
  },
  {
    title: 'Carbon Credits Burning',
    shortTitle: 'Carbon Credits',
    content: `Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Maecenas sed diam eget risus varius blandit sit amet non magna. Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Cras mattis consectetur purus sit amet fermentum. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.`,
  },
  {
    title: 'NFT headline otam rem aperiam',
    shortTitle: 'NFT',
    content: `Curabitur blandit tempus porttitor. Sed posuere consectetur est at lobortis. Curabitur blandit tempus porttitor. Vestibulum id ligula porta felis euismod semper. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.`,
  },
]

export interface HomeHowItWorksSectionProps {}
export const HomeHowItWorksSection: FC<HomeHowItWorksSectionProps> = () => {
  return (
    <>
      <div tw="bg-gray-700 text-white">
        <Wrapper>
          {/* Title & Tagline */}
          <div tw="max-w-[25rem]">
            <Subheading tw="text-gray-200">How it works</Subheading>
            <div tw="font-display text-3xl font-bold tracking-tight">
              How it works headline otam rem aperiam.
            </div>
            <p tw="text-sm mt-2 opacity-75">
              Aenean eu leo quam. Pellentesque ornare sem lacinia quam.
            </p>
          </div>

          {/* Tabs  */}
          <Tab.Group vertical as="div" tw="flex mt-14">
            {/* Tab Titles  */}
            <Tab.List tw="shrink-0 grow-0 flex flex-col py-4 border-r-[2px] border-gray-600">
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
            <Tab.Panels tw="flex flex-col justify-center">
              {items.map((item, idx) => (
                <Tab.Panel key={`tab-panel-${idx}`} tw="py-2 pl-6 sm:pl-12 max-w-prose">
                  <h3 tw="font-display text-2xl font-bold tracking-tight mb-4">{item.title}</h3>
                  <div dangerouslySetInnerHTML={{ __html: md().render(item.content) }}></div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Wrapper>
      </div>
    </>
  )
}

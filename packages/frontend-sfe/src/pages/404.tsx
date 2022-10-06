import { HomeHeroIllustration } from '@components/home/HomeHeroIllustration'
import { HomeLayout } from '@components/home/HomeLayout'
import { CenterBody } from '@components/layout/CenterBody'
import { BaseButton } from '@components/shared/BaseButton'
import CountUp from 'react-countup'
import 'twin.macro'

export interface IndexPageProps {}
export default function IndexPage() {
  return (
    <>
      <HomeLayout>
        <CenterBody>
          {/* Custom 404 Notice */}
          <div tw="flex flex-col items-center z-10">
            <div tw="min-h-[3rem] text-[3rem] leading-none font-display font-bold whitespace-nowrap">
              <CountUp end={404} duration={2} decimals={0} />
            </div>
            <div tw="text-gray-500 mt-2">Page not found</div>
            <div tw="w-10 h-[2px] bg-gray-200 my-10" />
            <BaseButton asLink={true} linkProps={{ href: '/' }}>
              Back to Start
            </BaseButton>
          </div>

          {/* Illustration BG */}
          <HomeHeroIllustration tw="opacity-25" />
        </CenterBody>
      </HomeLayout>
    </>
  )
}

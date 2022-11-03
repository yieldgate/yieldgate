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
          <div tw="z-10 flex flex-col items-center">
            <div tw="whitespace-nowrap font-display font-bold leading-none min-h-[3rem] text-[3rem]">
              <CountUp end={404} duration={1} decimals={0} />
            </div>
            <div tw="mt-2 text-gray-500">Page not found</div>
            <div tw="my-10 w-10 bg-gray-200 h-[2px]" />
            <BaseButton asLink={true} href="/">
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

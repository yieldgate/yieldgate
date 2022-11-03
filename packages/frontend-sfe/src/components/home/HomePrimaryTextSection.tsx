import { Wrapper } from '@components/layout/Wrapper'
import { Subheading } from '@components/shared/Subheading'
import { FC } from 'react'
import 'twin.macro'

export interface HomePrimaryTextSectionProps {}
export const HomePrimaryTextSection: FC<HomePrimaryTextSectionProps> = () => {
  return (
    <>
      <Wrapper>
        <div tw="grid space-y-2 sm:(grid-cols-2 gap-6 space-y-0)">
          <Subheading>
            ReFi 🤝 DeFi
            <br />
            Stake to Offset Carbon
          </Subheading>

          <div tw="prose first:prose-p:mt-0 last:prose-p:mb-0">
            <p>
              Stake for Earth is a pool that generates yield and uses it to buy NCT (
              <a
                href="https://blog.toucan.earth/announcing-nct-nature-carbon-tonne/"
                target="_blank"
              >
                Nature Carbon Tonne
              </a>
              ) tokens in perpetuity. The carbon tokens which are bought up are locked forever in
              our treasury, effectively retiring them from the market.{' '}
              <strong>
                The goal is to enable anyone to participate in climate action at zero cost
              </strong>{' '}
              (excl. transaction fees).
            </p>
            <p>
              The moment users stake, they receive a climate action badge, enabling them to prove
              their participation, including their relative contribution to carbon credits removed,
              using Stake For Earth. When they remove their stake, their badge becomes inactive.
              This creates the incentive for anyone to continue staking and make a perpetual impact.
              Stakers can both decide to make a permanent pledge or a withdrawable pledge. The
              difference being that the permanent pledge will continue to both generate yield and
              buy up carbon tokens in perpetuity.
            </p>
            <p>
              <strong>
                We envision the Stake for Earth badges to become a main route for crypto native
                companies to participate in climate action
              </strong>
              , in a similar way to existing ESG badges which are listed at the bottom of corporate
              websites.
            </p>
            {/* <p>
              The Stake for Earth Foundation was spun out of an ETHAmsterdam winning project team in
              2022 which received prizes from Aave, Polygon, ETHGlobal, WalletConnect, and Coinbase.
            </p> */}
          </div>
        </div>
      </Wrapper>
    </>
  )
}

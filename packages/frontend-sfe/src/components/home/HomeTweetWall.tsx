import { Wrapper } from '@components/layout/Wrapper'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import { FC, useState } from 'react'
import { Tweet } from 'react-twitter-widgets'
import 'twin.macro'
import tw from 'twin.macro'

const tweetIds = [
  '1574761203032899585',
  '1573414968246308864',
  '1577460881004167168',
  // '1570054236033155076',
  // '1576864384722563072',
]

export interface HomeTweetWallProps {}
export const HomeTweetWall: FC<HomeTweetWallProps> = () => {
  const [tweetsAreLoaded, setTweetsAreLoaded] = useState<boolean[]>(
    new Array(tweetIds.length).fill(false)
  )

  return (
    <>
      <Wrapper tw="max-w-[55rem]">
        <SubheadingSmall noHeadingMarkup={true} tw="text-center mx-auto">
          What others say
        </SubheadingSmall>
        <Subheading tw="text-center mx-auto mb-10">You’re in good company</Subheading>
        <div tw="flex justify-center flex-wrap -mx-3 mb-4">
          {tweetIds.map((id, idx) => (
            <div
              key={`tweet-${idx}`}
              css={[
                tw`[flex-basis: 250px] shrink-0 grow-0 mx-3`,
                !tweetsAreLoaded[idx] &&
                  tw`my-[8px] h-[250px] rounded-[12px] bg-gray-100 animate-pulse`,
              ]}
            >
              <Tweet
                tweetId={id}
                options={{ width: '250px', conversation: 'none', cards: 'hidden' }}
                onLoad={() => {
                  setTweetsAreLoaded((areLoaded) =>
                    areLoaded.map((val, valIdx) => (valIdx === idx ? true : val))
                  )
                }}
              />
            </div>
          ))}
        </div>
      </Wrapper>
    </>
  )
}

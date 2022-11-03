import { Wrapper } from '@components/layout/Wrapper'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import dayjs, { Dayjs } from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import Image from 'next/image'
import Link from 'next/link'
import twitterSvg from 'public/icons/social/twitter.svg'
import { FC } from 'react'
import 'twin.macro'
dayjs.extend(localizedFormat)

const tweets: StaticTweetDetails[] = [
  {
    id: '1581957458662404100',
    tweet: 'Aenean lacinia bibendum nulla sed consectetur.',
    time: dayjs(),
    author: {
      name: 'Toucan',
      username: 'ToucanProtocol',
    },
  },
  {
    id: '1581957458662404100',
    tweet:
      'Vestibulum id ligula porta felis euismod semper. Morbi leo risus, porta ac consectetur ac.',
    time: dayjs(),
    author: {
      name: 'Josh Stark',
      username: '0xstark',
    },
  },
  {
    id: '1581957458662404100',
    tweet:
      'Curabitur blandit tempus porttitor. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.',
    time: dayjs(),
    author: {
      name: 'Gitcoin',
      username: 'gitcoin',
    },
  },
]

export const HomeStaticTweetWall: FC = () => {
  return (
    <>
      <Wrapper>
        <SubheadingSmall noHeadingMarkup={true} tw="mx-auto text-center">
          What others say
        </SubheadingSmall>
        <Subheading tw="mx-auto mb-10 text-center">You’re in good company</Subheading>
        <div tw="-mx-3 -mt-3 flex flex-wrap justify-center">
          {tweets.map((tweet, idx) => (
            <StaticTweet key={`tweet-${idx}`} {...tweet} tw="mx-3 my-3 w-[20rem]" />
          ))}
        </div>
      </Wrapper>
    </>
  )
}

export interface StaticTweetDetails {
  id: string
  tweet: string
  time: Dayjs
  author: {
    name: string
    username: string
    // imageSrc: string
  }
}
export const StaticTweet: FC<StaticTweetDetails> = ({ id, tweet, time, author, ...props }) => {
  return (
    <>
      <Link
        href={`https://twitter.com/twitter/status/${id}`}
        target="_blank"
        tw="flex cursor-pointer flex-col space-y-3 overflow-hidden rounded-xl border border-gray-200 py-3 px-4 transition-all hover:bg-gray-50"
        {...props}
      >
        <div tw="flex items-start justify-between">
          <div tw="mb-0.5 flex items-start">
            <div tw="relative mr-2 flex shrink-0 grow-0 flex-col overflow-hidden rounded-full bg-gray-100 w-[2.75rem] h-[2.75rem]">
              <Image
                src={`/images/avatars/${author.username}.jpg`}
                width={400}
                height={400}
                alt={`Avatar of @${author.username}`}
              />
            </div>
            <div tw="flex flex-col whitespace-nowrap">
              <div tw="font-semibold">{author.name}</div>
              <div tw="-mt-px text-sm text-gray-600">@{author.username}</div>
            </div>
          </div>
          <div tw="ml-2 shrink-0 grow-0">
            <Image src={twitterSvg} width={25} height={25} alt="Twitter Logo" />
          </div>
        </div>
        <div>{tweet}</div>
        <div tw="mt-0! grow"></div>
        <div tw="text-sm text-gray-600">{time.format('LT · ll')}</div>
      </Link>
    </>
  )
}

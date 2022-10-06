import { Wrapper } from '@components/layout/Wrapper'
import { ArticleStaticPageProps } from '@lib/getArticlePageProps'
import dayjs from 'dayjs'
import md from 'markdown-it'
import { FC } from 'react'
import 'twin.macro'

export const ArticlePageContent: FC<ArticleStaticPageProps> = ({ slug, content, metadata }) => {
  return (
    <>
      <Wrapper>
        {/* Heading */}
        <div tw="flex flex-col border-b border-gray-200 mb-10">
          <h1 tw="font-display text-3xl font-bold tracking-tight mb-4">{metadata.title}</h1>
          {metadata.subtitle && <p tw="text-sm opacity-70 -mt-2 mb-4">{metadata.subtitle}</p>}
        </div>

        {/* Content */}
        <div tw="prose">
          <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
          {metadata.updatedAt && (
            <div tw="text-sm text-gray-400">
              Last updated at {dayjs(metadata.updatedAt).format('YYYY-MM-DD')}
            </div>
          )}
        </div>
      </Wrapper>
    </>
  )
}

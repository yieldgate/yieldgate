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
        <article itemScope itemType="http://schema.org/Article">
          {/* Heading */}
          <div tw="flex flex-col border-b border-gray-200 mb-10">
            <h1 tw="font-display text-3xl font-bold tracking-tight mb-4" itemProp="headline">
              {metadata.title}
            </h1>
            {metadata.subtitle && (
              <p tw="text-sm opacity-70 -mt-2 mb-4" itemProp="description">
                {metadata.subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <section tw="prose" itemProp="articleBody">
            <div dangerouslySetInnerHTML={{ __html: md().render(content) }} />
            {metadata.updatedAt && (
              <div tw="text-sm text-gray-400">
                <span tw="whitespace-pre">Last updated at </span>
                <time
                  dateTime={dayjs(metadata.updatedAt).format('YYYY-MM-DD')}
                  itemProp="dateModified"
                >
                  {dayjs(metadata.updatedAt).format('YYYY-MM-DD')}
                </time>
              </div>
            )}
          </section>
        </article>
      </Wrapper>
    </>
  )
}

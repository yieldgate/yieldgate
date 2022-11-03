import { Wrapper } from '@components/layout/Wrapper'
import { RenderedMarkdownContent } from '@components/shared/RenderedMarkdownContent'
import { ArticleStaticPageProps } from '@lib/getArticlePageProps'
import dayjs from 'dayjs'
import { FC } from 'react'
import 'twin.macro'

export const ArticlePageContent: FC<ArticleStaticPageProps> = ({ slug, content, metadata }) => {
  return (
    <>
      <Wrapper tw="py-10">
        <article itemScope itemType="http://schema.org/Article">
          {/* Heading */}
          <div tw="mb-8 flex flex-col border-gray-200 border-b">
            <h1 tw="mb-5 font-display font-bold text-3xl tracking-tight" itemProp="headline">
              {metadata.title}
            </h1>
            {metadata.subtitle && (
              <p tw="-mt-2.5 mb-5 text-sm opacity-70" itemProp="description">
                {metadata.subtitle}
              </p>
            )}
          </div>

          {/* Content */}
          <section tw="prose" itemProp="articleBody">
            <RenderedMarkdownContent content={content} />
            {metadata.updatedAt && (
              <div tw="my-2 text-sm text-gray-400">
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

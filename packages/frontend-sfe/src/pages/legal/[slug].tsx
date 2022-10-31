import { ArticlePageContent } from '@components/article/ArticlePageContent'
import { HomeLayout } from '@components/home/HomeLayout'
import {
  ArticleStaticPageProps,
  getArticleStaticPagePaths,
  getArticleStaticPageProps,
} from '@lib/getArticlePageProps'
import { NextSeo } from 'next-seo'
import 'twin.macro'

export default function ArticlePage(props: ArticleStaticPageProps) {
  return (
    <>
      <NextSeo title={props.metadata.title} />
      <HomeLayout>
        <ArticlePageContent {...props} />
      </HomeLayout>
    </>
  )
}

export const getStaticProps = getArticleStaticPageProps('/legal')
export const getStaticPaths = getArticleStaticPagePaths('/legal')

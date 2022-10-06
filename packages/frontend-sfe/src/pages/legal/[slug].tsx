import { ArticlePageContent } from '@components/article/ArticlePageContent'
import { HomeLayout } from '@components/home/HomeLayout'
import {
  ArticleStaticPageProps,
  getArticleStaticPagePaths,
  getArticleStaticPageProps,
} from '@lib/getArticlePageProps'
import 'twin.macro'

export default function ArticlePage(props: ArticleStaticPageProps) {
  return (
    <>
      <HomeLayout>
        <ArticlePageContent {...props} />
      </HomeLayout>
    </>
  )
}

export const getStaticProps = getArticleStaticPageProps('/legal')
export const getStaticPaths = getArticleStaticPagePaths('/legal')

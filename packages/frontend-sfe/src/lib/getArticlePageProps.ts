import { readdir, readFile } from 'fs/promises'
import matter from 'gray-matter'
import { GetStaticPaths, GetStaticProps } from 'next'
import path from 'path'

export interface ArticleStaticPageProps {
  slug: string
  content: string
  metadata: ArticleMetadata
}
export interface ArticleMetadata {
  title: string
  subtitle?: string
  updatedAt?: string
}

export const PAGES_DATA_DIR = path.join(process.cwd(), `pages-data`)

/**
 * Loads the markdown file under the given `pagesPath` and `slug`
 * from the context on the server-side, parses it, and returns content & metadata.
 */
export const getArticleStaticPageProps =
  (pagesPath: string): GetStaticProps =>
  async (context) => {
    const { slug } = context.params || {}
    const fullPath = path.join(PAGES_DATA_DIR, pagesPath, `${slug}.md`)
    const fileContents = await readFile(fullPath, 'utf8')
    const { content, data } = matter(fileContents)
    const metadata = Object.keys(data || {}).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: data?.[curr] || null,
      }),
      {}
    )

    return {
      props: {
        slug,
        content,
        metadata,
      } as ArticleStaticPageProps,
    }
  }

/**
 * Scans the given `pagesPath` for available markdown-files and
 * returns their filenames (slugs) as static paths.
 */
export const getArticleStaticPagePaths =
  (pagesPath: string): GetStaticPaths =>
  async () => {
    const dir = path.join(PAGES_DATA_DIR, pagesPath)
    const files = await readdir(dir)
    const paths = files.map((filename) => {
      const slug = filename.replace('.md', '')
      return { params: { slug } }
    })

    return {
      paths,
      fallback: false,
    }
  }

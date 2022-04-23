import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { GetStaticProps } from 'next'

export interface IndexPageProps {
  creators: Creator[]
}
export default function IndexPage({creators}: IndexPageProps) {
  return <>
    <Layout>
      {JSON.stringify(creators)}
    </Layout>
  </>
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`${env.url}/api/creators/getAllCreators`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })

  const { creators }: { creators: Creator[] } = await res.json()

  return {
    props: {
      creators,
    } as IndexPageProps,
    revalidate: 60,
  }
}


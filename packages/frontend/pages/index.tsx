import { Text } from '@chakra-ui/react'
import Layout from '@components/layout/Layout'
import { Creator } from '@entities/Creator.entity'
import { env } from '@lib/environment'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

export interface IndexPageProps {
  creators: Creator[]
}
export default function IndexPage({creators}: IndexPageProps) {
  return <>
    <Layout>
      {creators.map((creator) => <Text key={creator._id} decoration={'underline'}>
        <Link href={`/users/${creator.address}`}>{creator.address}</Link>
      </Text>)}
      {JSON.stringify(creators)}

    </Layout>
  </>
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
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
    // revalidate: 60,
  }
}


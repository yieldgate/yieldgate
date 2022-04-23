import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
} from '@chakra-ui/react'
import { useNotifications } from '@usedapp/core'
import React from 'react'
import Head, { MetaProps } from './Head'
import Navbar from './Navbar'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
  transactionStarted: 'Local Transaction Started',
  transactionSucceed: 'Local Transaction Completed',
}

interface LayoutProps {
  children: React.ReactNode
  customMeta?: MetaProps
}

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  const { notifications } = useNotifications()

  return (
    <>
      <Head customMeta={customMeta} />
      <header>
        <Navbar />
      </header>
      <main>
        <Container maxWidth="container.xl">
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription overflow="hidden">
                    Transaction Hash:{' '}
                    {/* {truncateHash(notification.transaction.hash, 61)} */}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <Box as="footer">Built with ❤️ on top Aave, Polygon and others.</Box>
    </>
  )
}

export default Layout

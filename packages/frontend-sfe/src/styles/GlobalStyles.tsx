import { Global } from '@emotion/react'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css`
  html {
    scroll-behavior: smooth;
  }
  body {
    ${tw`font-body antialiased`}
    ${tw`relative h-screen min-h-screen`}
  }
  #__next,
  #__next > div {
    ${tw`relative flex h-full min-h-full flex-col`}
  }

  /* Progress Bar */
  #nprogress > .bar {
    ${tw`bg-black`}
  }
  #nprogress > .spinner {
    ${tw`hidden!`}
  }
`

const GlobalStyles = () => (
  <>
    <BaseStyles />
    <Global styles={customStyles} />
  </>
)

export default GlobalStyles

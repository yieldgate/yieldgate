import { Global } from '@emotion/react'
import tw, { css, GlobalStyles as BaseStyles } from 'twin.macro'

const customStyles = css`
  html {
    scroll-behavior: smooth;
  }
  body {
    ${tw`antialiased font-body`}
    ${tw`min-h-screen h-screen relative`}
  }
  #__next,
  #__next > div {
    ${tw`h-full relative flex flex-col`}
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

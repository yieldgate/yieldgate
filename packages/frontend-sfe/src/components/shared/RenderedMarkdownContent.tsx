import md from 'markdown-it'
import { FC } from 'react'
import 'twin.macro'

export interface RenderedMarkdownContentProps {
  content: string
}
export const RenderedMarkdownContent: FC<RenderedMarkdownContentProps> = ({
  content,
  ...props
}) => {
  return (
    <>
      <div
        dangerouslySetInnerHTML={{
          __html: md({ html: true, linkify: true, typographer: true }).render(content),
        }}
        {...props}
      />
    </>
  )
}

import { Wrapper } from '@components/layout/Wrapper'
import { Subheading } from '@components/shared/Subheading'
import { FC } from 'react'
import 'twin.macro'

export interface HomePrimaryTextSectionProps {}
export const HomePrimaryTextSection: FC<HomePrimaryTextSectionProps> = () => {
  return (
    <>
      <Wrapper>
        <div tw="grid space-y-2 sm:(grid-cols-2 gap-6 space-y-0)">
          <Subheading>A cool headline about the company impact</Subheading>
          <div tw="prose first:prose-p:(mt-0) last:prose-p:(mb-0)">
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vestibulum id
              ligula porta felis euismod semper. Vivamus sagittis lacus vel augue laoreet rutrum
              faucibus dolor auctor. Donec sed odio dui. Aenean lacinia bibendum nulla sed
              consectetur.
            </p>
            <p>
              Etiam porta sem malesuada magna mollis euismod. Cras justo odio, dapibus ac facilisis
              in, egestas eget quam. Aenean eu leo quam. Pellentesque ornare sem lacinia quam
              venenatis vestibulum. Maecenas faucibus mollis interdum. Maecenas faucibus mollis
              interdum. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id
              nibh ultricies vehicula ut id elit.
            </p>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

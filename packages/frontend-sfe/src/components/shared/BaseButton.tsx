import Link, { LinkProps } from 'next/link'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import tw, { styled } from 'twin.macro'

const BaseButtonWrapper = styled.button(({ variant }: Partial<BaseButtonProps>) => [
  tw`inline-flex items-center justify-center leading-none  rounded font-body py-2.5 px-5`,
  variant === 'outline'
    ? tw`bg-transparent border border-black text-black`
    : tw`bg-black border border-transparent text-white`,
])
const BaseButtonAnchorWrapper = BaseButtonWrapper.withComponent('a')

export interface BaseButtonProps {
  variant?: 'solid' | 'outline'
  isLoading?: boolean
  asLink?: boolean
  linkProps?: LinkProps
}
export const BaseButton: FC<PropsWithChildren<BaseButtonProps>> = ({
  children,
  variant,
  isLoading,
  asLink,
  linkProps,
  ...props
}) => {
  const wrapperProps = { variant, isLoading }
  return asLink && linkProps ? (
    <Link {...linkProps} passHref>
      <BaseButtonAnchorWrapper {...wrapperProps}>{children}</BaseButtonAnchorWrapper>
    </Link>
  ) : (
    <BaseButtonWrapper {...wrapperProps}>{children}</BaseButtonWrapper>
  )
}

import { CSSInterpolation } from '@emotion/css'
import Link, { LinkProps } from 'next/link'
import { AnchorHTMLAttributes, ButtonHTMLAttributes, FC, PropsWithChildren } from 'react'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import tw, { styled, theme } from 'twin.macro'

const BaseButtonWrapper = styled.button(({ variant, disabled }: Partial<BaseButtonProps>) => [
  tw`flex relative items-center justify-center leading-none rounded font-body py-2.5 px-5`,
  variant === 'outline'
    ? tw`bg-transparent backdrop-blur-md border border-black text-black`
    : tw`bg-black border border-transparent text-white`,
  disabled && tw`opacity-80 cursor-not-allowed`,
  disabled && (variant === 'outline' ? tw`text-black/80` : tw`text-white/80`),
])
const BaseButtonAnchorWrapper = BaseButtonWrapper.withComponent('a')

type ButtonAndAnchorProps = ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>
export interface BaseButtonProps extends ButtonAndAnchorProps {
  variant?: 'solid' | 'outline'
  isLoading?: boolean
  asLink?: boolean
  linkProps?: LinkProps
  css?: CSSInterpolation
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
      <BaseButtonAnchorWrapper {...wrapperProps} {...props}>
        {children}
      </BaseButtonAnchorWrapper>
    </Link>
  ) : (
    <BaseButtonWrapper {...wrapperProps} {...props}>
      <div css={[isLoading && tw`opacity-0`]}>{children}</div>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div tw="absolute inset-0 flex justify-center items-center">
          <SpinnerDiamond
            size={20}
            thickness={125}
            color={variant === 'outline' ? theme('colors.gray.900') : theme('colors.gray.200')}
            secondaryColor={
              variant === 'outline' ? theme('colors.gray.400') : theme('colors.gray.600')
            }
          />
        </div>
      )}
    </BaseButtonWrapper>
  )
}

export const BaseButtonGroup = styled.div`
  ${tw`flex flex-wrap -mx-1 -my-1`}
  button, a {
    ${tw`mx-1 my-1`}
  }
`

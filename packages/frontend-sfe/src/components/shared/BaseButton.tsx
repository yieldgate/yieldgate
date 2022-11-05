import { CSSInterpolation } from '@emotion/css'
import Link, { LinkProps } from 'next/link'
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
  RefAttributes,
} from 'react'
import { SpinnerDiamond } from 'spinners-react'
import 'twin.macro'
import tw, { styled, theme } from 'twin.macro'

const BaseButtonWrapper = styled.button(({ variant, disabled }: Partial<BaseButtonProps>) => [
  tw`relative flex items-center justify-center whitespace-nowrap rounded py-2.5 px-5 font-body leading-none`,
  variant === 'outline'
    ? tw`border border-black bg-transparent text-black backdrop-blur-md`
    : tw`border border-transparent bg-black text-white`,
  disabled && tw`cursor-not-allowed opacity-80`,
  disabled && (variant === 'outline' ? tw`text-black/80` : tw`text-white/80`),
])
const BaseButtonLinkWrapper = BaseButtonWrapper.withComponent(Link)

type ButtonAndAnchorProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps &
  RefAttributes<HTMLAnchorElement>
export interface BaseButtonProps extends Partial<ButtonAndAnchorProps> {
  variant?: 'solid' | 'outline'
  isLoading?: boolean
  asLink?: boolean
  css?: CSSInterpolation
}
export const BaseButton: FC<PropsWithChildren<BaseButtonProps>> = ({
  children,
  variant,
  isLoading,
  asLink,
  ...props
}) => {
  const wrapperProps = { variant, isLoading }
  return asLink ? (
    <BaseButtonLinkWrapper {...(props as any)}>{children}</BaseButtonLinkWrapper>
  ) : (
    <BaseButtonWrapper {...wrapperProps} {...(props as any)}>
      <div css={[isLoading && tw`opacity-0`]}>{children}</div>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div tw="absolute inset-0 flex items-center justify-center">
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
  ${tw`-mx-1 -my-1 flex flex-wrap`}
  button, a {
    ${tw`mx-1 my-1`}
  }
`

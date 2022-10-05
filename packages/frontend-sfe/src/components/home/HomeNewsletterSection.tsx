import { Wrapper } from '@components/layout/Wrapper'
import { BaseButton } from '@components/shared/BaseButton'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import Image from 'next/image'
import circleElementSvg from 'public/images/decorative-circle-element.svg'
import { FC, SyntheticEvent, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import 'twin.macro'

export interface HomeNewsletterSectionProps {}
export const HomeNewsletterSection: FC<HomeNewsletterSectionProps> = () => {
  return (
    <>
      <div tw="bg-sky-100">
        <Wrapper tw="overflow-hidden">
          <div tw="relative  z-10">
            {/* Heading & Text */}
            <SubheadingSmall>Newsletter</SubheadingSmall>
            <Subheading noHeadingMarkup={true}>Stay in the loop</Subheading>
            <p tw="text-sm opacity-70 -mt-2">
              Maecenas faucibus mollis interdum.
              <br />
              Nullam quis risus eget urna mollis ornare vel eu leo.
            </p>

            {/* Subscribe Form */}
            <HomeNewsletterSubscribeForm />
          </div>

          <div tw="absolute right-0 top-1/2 -translate-y-1/2 select-none opacity-50 z-0">
            <Image
              src={circleElementSvg}
              width={450}
              height={450}
              layout="fixed"
              alt="Decorative Element"
            />
          </div>
        </Wrapper>
      </div>
    </>
  )
}

export interface HomeNewsletterSubscribeFormProps {}
export const HomeNewsletterSubscribeForm: FC<HomeNewsletterSubscribeFormProps> = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm({ mode: 'onChange' })
  const { isValid } = form.formState

  const onSubmit = async (e: SyntheticEvent) => {
    e?.preventDefault()
    const email = form.getValues('email')
    if (!email) return
    setIsLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1500))
      toast.success(`Success! Please confirm your email…`)
      // TODO
      // const response = await axios.post('/api/newsletter/subscribe', { email })
      // const isDoubleOptin = !!response?.data?.doDoubleOptIn
      // toast.success(isDoubleOptin
      //   ? 'Success! Please confirm your email…'
      //   : 'Successfully added to the waitlist!')
      // form.setValue('email', '')
      // if (!isDoubleOptin) setDialogProps({ isOpen: true })
    } catch (_) {
      toast.error('Something went wrong…')
    }
    setIsLoading(false)
  }

  return (
    <>
      <form onSubmit={onSubmit} tw="relative mt-8">
        <label htmlFor="email" tw="sr-only">
          E-Mail for Newsletter
        </label>
        <div tw="flex items-stretch relative">
          <input
            type="text"
            id="email"
            placeholder="Email Address"
            tw="w-[20rem] mr-2 bg-white text-black border border-gray-300 rounded font-body leading-none py-2.5 px-2.5 focus:(ring-2 ring-sky-500)"
            {...form.register('email', { required: true })}
          />
          <BaseButton
            onClick={onSubmit}
            type="submit"
            disabled={!isValid || isLoading}
            isLoading={isLoading}
          >
            Subscribe
          </BaseButton>
        </div>
      </form>
    </>
  )
}

import { Wrapper } from '@components/layout/Wrapper'
import { BaseButton } from '@components/shared/BaseButton'
import { Subheading, SubheadingSmall } from '@components/shared/Subheading'
import axios from 'axios'
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
      <div tw="bg-primary-100">
        <Wrapper tw="overflow-hidden">
          <div tw="relative  z-10">
            {/* Heading & Text */}
            <SubheadingSmall>Newsletter</SubheadingSmall>
            <Subheading noHeadingMarkup={true} tagline="We notify you when the pool launches.">
              Be ready…
            </Subheading>

            {/* Subscribe Form */}
            <HomeNewsletterSubscribeForm />
          </div>

          <div tw="absolute max-w-[66%] right-0 top-1/2 -translate-y-1/2 select-none opacity-50 z-0">
            <Image src={circleElementSvg} width={450} height={450} alt="Decorative Element" />
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
      const response = await axios.post('/api/newsletter/subscribe', { email })
      const isDoubleOptin = !!response?.data?.doDoubleOptIn
      toast.success(
        isDoubleOptin ? 'Success! Please confirm your email…' : 'Successfully subscribed!'
      )
      form.setValue('email', '')
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
            tw="w-[20rem] mr-2 bg-white text-black border border-gray-300 rounded font-body leading-none py-2.5 px-2.5 outline-none focus:(ring-offset-2 ring-2 ring-sky-500)"
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

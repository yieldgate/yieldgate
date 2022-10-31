import { env } from '@lib/environment'
import * as SibApiV3Sdk from '@sendinblue/client'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { newsletter: slug } = req.query
  const path = ((slug as string[]) || []).join('/')

  switch (path) {
    case 'subscribe':
      return await handleSubscribe(req, res)
    default:
      return res.status(404).end()
  }
}

/**
 * Add email to sendinblue contact-list preferrably via double-opt-in
 * unless the sendinblue quote is exceeded.
 */
export const handleSubscribe = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!env.sendinblueApiKey) return res.status(500).end()

  const { email } = req.body || {}
  if (!email) return res.status(400).end()

  // Determine remaining credits
  const sibAccountApi = new SibApiV3Sdk.AccountApi()
  sibAccountApi.setApiKey(SibApiV3Sdk.AccountApiApiKeys.apiKey, env.sendinblueApiKey)

  let remainingCredits = 0
  try {
    const data = await sibAccountApi.getAccount()
    const plans = (data?.response as any)?.body?.plan
    const freePlan = plans?.find((p: any) => p?.type === 'free')
    remainingCredits = freePlan?.credits || 0
  } catch (e) {
    console.error('Error while fetching remaining credits', e)
  }

  // Instantiate contacts api & build request object
  const sibContactsApi = new SibApiV3Sdk.ContactsApi()
  sibContactsApi.setApiKey(SibApiV3Sdk.ContactsApiApiKeys.apiKey, env.sendinblueApiKey)

  const doDoubleOptIn = remainingCredits > 1
  let requestData
  if (doDoubleOptIn) {
    // If credits remain, send a double opt-in mail
    requestData = new SibApiV3Sdk.CreateDoiContact()
    requestData.email = email
    requestData.templateId = 1
    requestData.includeListIds = [3]
    requestData.redirectionUrl = env.url
  } else {
    // If no credits remain, instantly opt-in user
    requestData = new SibApiV3Sdk.CreateContact()
    requestData.email = email
    requestData.listIds = [3]
  }

  // Perform request
  try {
    await sibContactsApi[doDoubleOptIn ? 'createDoiContact' : 'createContact'](
      requestData as SibApiV3Sdk.CreateDoiContact
    )
    return res.status(200).json({
      doDoubleOptIn,
    })
  } catch (error: any) {
    const code = error?.response?.body?.code
    if (code === 'duplicate_parameter') {
      return res.status(200).end()
    } else {
      return res.status(400).end()
    }
  }
}

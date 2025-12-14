// Force dynamic rendering to prevent static prerendering issues
export const dynamic = 'force-dynamic'

import CreateResumeClient from './create-resume-client'

export default function CreateResumePage() {
  return <CreateResumeClient />
}

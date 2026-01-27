import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { PricingContent } from "./pricing-content"

export const dynamic = "force-dynamic"

const Page = () => {
  return (
    <div className="bg-brand-25 py-24 sm:py-32 dark:bg-dark-background">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-2xl sm:text-center">
          <Heading className="text-center">Simple no-tricks pricing</Heading>
          <p className="mt-6 text-base/7 text-gray-600 max-w-prose text-center text-pretty dark:text-zinc-400">
            We hate subscriptions. And chances are, you do too. That's why we
            offer lifetime access to PingFlow for a one-time payment.
          </p>
        </div>

        <PricingContent />
      </MaxWidthWrapper>
    </div>
  )
}

export default Page

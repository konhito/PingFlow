import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Mail, MessageSquare, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with PingFlow - Contact our support team for help, questions, or feedback",
}

export const dynamic = "force-static"

export default function ContactPage() {
  return (
    <div className="bg-brand-25 py-24 sm:py-32 dark:bg-dark-background min-h-screen">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-4xl">
          <Heading className="text-center mb-4">Contact Us</Heading>
          <p className="text-center text-base/7 text-gray-600 mb-12 dark:text-zinc-400">
            Have a question, suggestion, or need help? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Support Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-100 rounded-lg dark:bg-brand-900">
                  <HelpCircle className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-zinc-300">
                  Support
                </h2>
              </div>
              <p className="text-gray-600 mb-6 dark:text-zinc-400">
                Need help with integration, billing, or technical issues? Our support team is here to assist you.
              </p>
              <a href="mailto:support@pingflow.com">
                <Button className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  support@pingflow.com
                </Button>
              </a>
            </div>

            {/* General Inquiry Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-100 rounded-lg dark:bg-brand-900">
                  <MessageSquare className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-zinc-300">
                  General Inquiry
                </h2>
              </div>
              <p className="text-gray-600 mb-6 dark:text-zinc-400">
                Have a question, feedback, or partnership inquiry? Reach out to us.
              </p>
              <a href="mailto:hello@pingflow.com">
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  hello@pingflow.com
                </Button>
              </a>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
            <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-6 dark:text-zinc-300">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6 text-gray-600 dark:text-zinc-400">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">
                  How quickly will I receive a response?
                </h3>
                <p>
                  We typically respond to all inquiries within 24-48 hours during business days. For urgent technical issues, please mention "URGENT" in your subject line.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">
                  Can I schedule a demo?
                </h3>
                <p>
                  Yes! If you're interested in a personalized demo or have questions about enterprise features, please reach out and we'll schedule a call.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">
                  Where can I find documentation?
                </h3>
                <p>
                  Check out our <a href="/docs" className="text-brand-600 hover:text-brand-700 dark:text-brand-500 dark:hover:text-brand-400 underline">documentation</a> for integration guides, API references, and best practices.
                </p>
              </div>
            </div>
          </div>

          {/* Social Links or Additional Info */}
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-zinc-500">
            <p>
              PingFlow is built with ❤️ by{" "}
              <span className="font-semibold text-gray-700 dark:text-zinc-300">Konhito aka Aditya</span>
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}


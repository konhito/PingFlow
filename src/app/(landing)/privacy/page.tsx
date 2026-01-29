import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PingFlow Privacy Policy - Learn how we collect, use, and protect your data",
}

export const dynamic = "force-static"

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-brand-25 py-24 sm:py-32 dark:bg-dark-background min-h-screen">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-4xl">
          <Heading className="text-center mb-8">Privacy Policy</Heading>
          <p className="text-center text-sm text-gray-500 mb-12 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                1. Introduction
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  PingFlow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
                </p>
                <p>
                  By using PingFlow, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Account Information</h3>
                  <p>When you create an account, we collect information such as your name, email address, and payment information.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Event Data</h3>
                  <p>We process and transmit the event data you send through our API to your configured notification channels (Discord, WhatsApp, Telegram).</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Usage Information</h3>
                  <p>We collect information about how you use our service, including API usage, feature usage, and interaction with our platform.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Technical Information</h3>
                  <p>We automatically collect certain technical information, including IP addresses, browser type, device information, and log data.</p>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                3. How We Use Your Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process and deliver notifications to your configured channels</li>
                  <li>Process payments and manage your account</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues and security threats</li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Service Providers:</strong> We may share information with third-party service providers who perform services on our behalf</li>
                  <li><strong>Notification Channels:</strong> Event data is transmitted to your configured notification channels (Discord, WhatsApp, Telegram) as per your settings</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                  <li><strong>Business Transfers:</strong> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                5. Data Security
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We implement appropriate technical and organizational measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>
                <p>
                  We use encryption, secure authentication, and regular security audits to safeguard your data.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                6. Your Rights
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and receive a copy of your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to or restrict processing of your information</li>
                  <li>Data portability - receive your data in a structured format</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p>To exercise these rights, please contact us at the email address provided in the Contact section.</p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                7. Data Retention
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We retain your personal information for as long as necessary to provide our services and fulfill the purposes described in this policy. When you delete your account, we will delete or anonymize your personal information, except where we are required to retain it for legal purposes.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                8. Changes to This Privacy Policy
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p>
                  You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                9. Contact Us
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <p>
                  <a href="/contact" className="text-brand-600 hover:text-brand-700 dark:text-brand-500 dark:hover:text-brand-400 underline">
                    Contact Support
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  )
}


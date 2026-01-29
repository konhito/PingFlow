import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "PingFlow Terms and Conditions - Terms of service for using PingFlow",
}

export const dynamic = "force-static"

export default function TermsPage() {
  return (
    <div className="bg-brand-25 py-24 sm:py-32 dark:bg-dark-background min-h-screen">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-4xl">
          <Heading className="text-center mb-8">Terms and Conditions</Heading>
          <p className="text-center text-sm text-gray-500 mb-12 dark:text-zinc-500">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                1. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  By accessing and using PingFlow ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms and Conditions, you should not use the Service.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                2. Description of Service
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  PingFlow is a notification service that allows you to send real-time event notifications from your SaaS application to Discord, WhatsApp, and Telegram. The Service processes event data and delivers notifications to your configured channels.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                3. User Accounts
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>To use the Service, you must:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create an account with accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Be responsible for all activities that occur under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>Be at least 18 years old or have parental consent</li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                4. Acceptable Use
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>You agree not to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                  <li>Violate any laws in your jurisdiction</li>
                  <li>Transmit any malicious code, viruses, or harmful data</li>
                  <li>Attempt to gain unauthorized access to the Service or its systems</li>
                  <li>Interfere with or disrupt the Service or servers connected to the Service</li>
                  <li>Use the Service to send spam, phishing, or fraudulent messages</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Exceed the usage limits of your subscription plan</li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                5. Payment and Billing
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  For paid plans, you agree to pay all fees associated with your subscription. Fees are charged in advance on a one-time or recurring basis as specified in your plan.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All fees are non-refundable unless otherwise stated</li>
                  <li>We reserve the right to change our pricing with 30 days notice</li>
                  <li>Failure to pay may result in suspension or termination of your account</li>
                  <li>You are responsible for any taxes applicable to your use of the Service</li>
                </ul>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  The Service and its original content, features, and functionality are owned by PingFlow and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p>
                  You retain ownership of any data you submit through the Service. By using the Service, you grant us a license to use, process, and transmit your data solely for the purpose of providing the Service.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                7. Service Availability
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We strive to provide reliable service but do not guarantee that the Service will be available 100% of the time. The Service may be unavailable due to maintenance, updates, or circumstances beyond our control.
                </p>
                <p>
                  We are not liable for any damages resulting from Service unavailability or interruptions.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                8. Limitation of Liability
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  To the maximum extent permitted by law, PingFlow shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                </p>
                <p>
                  Our total liability for any claims arising from or related to the Service shall not exceed the amount you paid to us in the 12 months preceding the claim.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                9. Termination
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
                </p>
                <p>
                  You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease, and we may delete your account and data.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                10. Changes to Terms
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes via email or through the Service.
                </p>
                <p>
                  Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                11. Governing Law
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.
                </p>
              </div>
            </section>

            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                12. Contact Information
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  If you have any questions about these Terms and Conditions, please contact us:
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


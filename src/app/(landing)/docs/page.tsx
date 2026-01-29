import { Heading } from "@/components/heading"
import { MaxWidthWrapper } from "@/components/max-width-wrapper"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Documentation",
  description: "Complete documentation for PingFlow - Real-time SaaS event notifications to Discord, WhatsApp, and Telegram",
}

export const dynamic = "force-static"

export default function DocumentationPage() {
  return (
    <div className="bg-brand-25 py-24 sm:py-32 dark:bg-dark-background min-h-screen">
      <MaxWidthWrapper>
        <div className="mx-auto max-w-4xl">
          <Heading className="text-center mb-8">Documentation</Heading>
          <p className="text-center text-base/7 text-gray-600 mb-12 dark:text-zinc-400">
            Learn how to integrate PingFlow into your SaaS application and start receiving real-time notifications.
          </p>

          <div className="space-y-12">
            {/* Getting Started */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                Getting Started
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  PingFlow is a powerful notification service that sends real-time alerts about events in your SaaS application to Discord, WhatsApp, and Telegram.
                </p>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Quick Setup</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Sign up for a PingFlow account</li>
                    <li>Create a project and get your API key</li>
                    <li>Configure your notification channels (Discord, WhatsApp, or Telegram)</li>
                    <li>Start sending events via our simple API</li>
                  </ol>
                </div>
              </div>
            </section>

            {/* API Integration */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                API Integration
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  Send events to PingFlow using a simple HTTP POST request. Here's a basic example:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 dark:bg-gray-800">
                  <pre className="text-sm overflow-x-auto">
{`curl -X POST https://api.pingflow.com/v1/events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "user.signup",
    "title": "New User Signup",
    "message": "John Doe just signed up!",
    "data": {
      "email": "john@example.com",
      "plan": "premium"
    }
  }'`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Event Types */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                Event Types
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>PingFlow supports various event types including:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Sales Events:</strong> Track purchases, subscriptions, and revenue</li>
                  <li><strong>User Events:</strong> Monitor signups, logins, and user activity</li>
                  <li><strong>Error Events:</strong> Get notified about application errors and issues</li>
                  <li><strong>Custom Events:</strong> Create your own event types for any use case</li>
                </ul>
              </div>
            </section>

            {/* Channel Configuration */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                Channel Configuration
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Discord</h3>
                  <p>Connect your Discord webhook URL to receive notifications in your Discord server channels.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">WhatsApp</h3>
                  <p>Configure WhatsApp Business API integration to send notifications directly to WhatsApp.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2 dark:text-zinc-300">Telegram</h3>
                  <p>Set up a Telegram bot to receive notifications in your Telegram chats or groups.</p>
                </div>
              </div>
            </section>

            {/* Best Practices */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                Best Practices
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use meaningful event names that clearly describe what happened</li>
                  <li>Include relevant data in the event payload for better context</li>
                  <li>Set up rate limiting to avoid overwhelming your notification channels</li>
                  <li>Test your integration in a development environment first</li>
                  <li>Monitor your event usage to stay within your plan limits</li>
                </ul>
              </div>
            </section>

            {/* Support */}
            <section className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 dark:bg-[#202225] dark:ring-gray-600">
              <h2 className="text-2xl font-heading font-semibold text-gray-900 mb-4 dark:text-zinc-300">
                Need Help?
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-400">
                <p>
                  If you need assistance with integration or have questions, please don't hesitate to contact our support team.
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


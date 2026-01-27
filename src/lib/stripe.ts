import Stripe from "stripe"

let stripeInstance: Stripe | null = null

export const getStripe = (): Stripe => {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    
    if (!apiKey || apiKey === "") {
      throw new Error(
        "STRIPE_SECRET_KEY environment variable is required. " +
        "Please set it in your .env file or environment variables."
      )
    }
    
    stripeInstance = new Stripe(apiKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    })
  }
  return stripeInstance
}

// Lazy initialization - only creates instance when accessed
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  }
})

export const createCheckoutSession = async ({
  userEmail,
  userId,
}: {
  userEmail: string,
  userId: string
}) => {
  const stripeClient = getStripe()
  const session = await stripeClient.checkout.sessions.create({
    line_items: [
      {
        price: "price_1Qb1kTRsozxOSNhLUBUCa7kg",
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: userEmail,
    metadata: {
      userId,
    },
  })
  return session
}


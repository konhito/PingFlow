import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "https://pingflow.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/pricing",
          "/docs",
          "/sign-in",
          "/sign-up",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/_next/",
          "/admin/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: [
          "/",
          "/pricing",
          "/docs",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/_next/",
          "/admin/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}


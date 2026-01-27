export const CopyrightFooter = () => {
  return (
    <footer className="py-6 text-center text-sm text-gray-500">
      <p>
        © {new Date().getFullYear()} PingFlow. All rights reserved.
      </p>
      <p className="mt-1 text-xs">
        Unauthorized copying, reproduction, or distribution of this website's design and code is strictly prohibited.
      </p>
    </footer>
  )
}


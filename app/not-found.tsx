import Link from "next/link"

export default function Component() {
  return (
    <div className="flex h-[100dvh] items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="mx-auto max-w-md space-y-4 text-center">
        <h1 className="text-8xl font-bold tracking-tighter text-gray-900 dark:text-gray-50">404</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Oops, it looks like the page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
          href="/"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
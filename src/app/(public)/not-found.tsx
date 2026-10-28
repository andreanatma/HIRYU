import Link from "next/link";

export default function NotFound() {
  return <div className="container-x py-24 text-center"><h1 className="text-display-md text-navy">Page not found</h1><p className="mt-3 text-body-lg text-on-surface-variant">The content you are looking for does not exist or is not published.</p><Link href="/" className="btn-primary mt-6">Back to home</Link></div>;
}

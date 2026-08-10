import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-surface text-on-surface">
      <span className="text-label-md text-action uppercase tracking-widest">404</span>
      <h1 className="text-headline-lg">Page not found</h1>
      <p className="text-body-md text-on-surface-variant">
        The page you're looking for doesn't exist or was moved.
      </p>
      <Link
        to="/"
        className="mt-2 px-4 py-2 rounded bg-action text-action-on text-body-sm font-medium hover:brightness-110 transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}
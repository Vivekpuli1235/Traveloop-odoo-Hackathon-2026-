import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-extrabold text-indigo-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">Page Not Found</h2>
      <p className="text-neutral-500 mb-8 max-w-md">The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/dashboard" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
        Return Home
      </Link>
    </div>
  );
}

import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="min-h-screen gradient-hero dark:bg-gray-950 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <div className="text-8xl mb-6 animate-float">🍕</div>
      <h1 className="text-8xl font-black text-[#ff5200] mb-2">404</h1>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Oops! Page not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Looks like this page wandered off to get some food.
        Let's get you back on track!
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary px-8 py-3">🏠 Go Home</Link>
        <Link to="/restaurants" className="btn-outline px-8 py-3">🍽 Find Food</Link>
      </div>
    </div>
  </div>
);

export default NotFoundPage;

// Skeleton loader components for placeholder UI
const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
    <div className="skeleton h-48 w-full" />
    <div className="p-4 space-y-3">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/2 rounded" />
      <div className="skeleton h-4 w-1/3 rounded" />
      <div className="flex justify-between items-center pt-2">
        <div className="skeleton h-4 w-1/4 rounded" />
        <div className="skeleton h-4 w-1/4 rounded" />
      </div>
    </div>
  </div>
);

const SkeletonMenuRow = () => (
  <div className="flex gap-4 border-b border-gray-100 dark:border-gray-700 pb-6">
    <div className="flex-1 space-y-2">
      <div className="skeleton h-5 w-3/4 rounded" />
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
    </div>
    <div className="skeleton w-36 h-32 rounded-xl shrink-0" />
  </div>
);

const SkeletonOrderCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700 space-y-3">
    <div className="flex justify-between">
      <div className="skeleton h-5 w-1/3 rounded" />
      <div className="skeleton h-5 w-20 rounded-full" />
    </div>
    <div className="skeleton h-4 w-1/2 rounded" />
    <div className="skeleton h-4 w-2/3 rounded" />
    <div className="flex justify-between pt-2">
      <div className="skeleton h-4 w-1/4 rounded" />
      <div className="skeleton h-8 w-24 rounded-full" />
    </div>
  </div>
);

export { SkeletonCard, SkeletonMenuRow, SkeletonOrderCard };
export default SkeletonCard;

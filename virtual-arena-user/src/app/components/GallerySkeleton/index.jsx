const GallerySkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="aspect-video rounded-2xl bg-gray-800 animate-pulse shadow-lg"
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;

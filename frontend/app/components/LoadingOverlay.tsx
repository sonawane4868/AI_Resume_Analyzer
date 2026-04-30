export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="card p-6 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
        <p className="text-sm text-gray-500">
          Running AI analysis...
        </p>
      </div>
    </div>
  );
}
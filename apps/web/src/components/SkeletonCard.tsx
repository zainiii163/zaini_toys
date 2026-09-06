export default function SkeletonCard() {
  return (
    <div className="card-toy animate-pulse overflow-hidden">
      <div className="aspect-square w-full bg-gray-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-4/5 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-slate-200 rounded"></div>
          <div className="h-4 w-64 bg-slate-100 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded"></div>
      </div>
      
      <div className="h-10 w-full max-w-sm bg-slate-100 rounded"></div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 bg-slate-100 rounded-2xl"></div>
        ))}
      </div>
    </div>
  )
}

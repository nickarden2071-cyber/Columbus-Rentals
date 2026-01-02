export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-10 w-64 bg-slate-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-slate-100 rounded"></div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 h-96 bg-slate-100 rounded-xl"></div>
        <div className="col-span-3 h-96 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  )
}

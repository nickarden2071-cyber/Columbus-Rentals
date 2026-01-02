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
      
      <div className="bg-white rounded-2xl h-96 w-full border border-slate-100"></div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { runDiagnostics } from './actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const handleRunDiagnostics = async () => {
    setStatus('running')
    setResult(null)
    
    const res = await runDiagnostics()
    setResult(res)
    setStatus(res.success ? 'success' : 'error')
  }

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
          <CardDescription>
            Run this tool to verify your database connection and permissions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4">
            <Button 
                onClick={handleRunDiagnostics} 
                disabled={status === 'running'}
                className="w-full sm:w-auto"
            >
              {status === 'running' && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Run Diagnostics
            </Button>

            {status !== 'idle' && (
                <div className={`rounded-md p-4 border ${
                    status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                    <div className="flex items-start">
                        {status === 'success' ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                        ) : (
                            <XCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2" />
                        )}
                        <div>
                            <h3 className={`font-medium ${
                                status === 'success' ? 'text-green-900' : 'text-red-900'
                            }`}>
                                {status === 'success' ? 'System Healthy' : 'Issues Detected'}
                            </h3>
                            <p className={`mt-1 text-sm ${
                                status === 'success' ? 'text-green-700' : 'text-red-700'
                            }`}>
                                {result?.message}
                            </p>
                            {result?.details && (
                                <pre className="mt-2 text-xs bg-white/50 p-2 rounded overflow-auto">
                                    {result.details}
                                </pre>
                            )}
                            {result?.code === '42501' && (
                                <div className="mt-4">
                                    <p className="font-semibold text-red-800">Row-Level Security (RLS) Error</p>
                                    <p className="text-sm text-red-700 mt-1">
                                        Your database is blocking writes. You need to run the following SQL in your Supabase SQL Editor:
                                    </p>
                                    <div className="mt-2 relative">
                                        <pre className="bg-slate-900 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`-- Run this in Supabase SQL Editor
alter table equipment enable row level security;
drop policy if exists "Enable all for authenticated users" on equipment;
create policy "Enable all for authenticated users" on equipment 
for all to authenticated using (true) with check (true);

alter table bookings enable row level security;
drop policy if exists "Enable all for authenticated users" on bookings;
create policy "Enable all for authenticated users" on bookings 
for all to authenticated using (true) with check (true);`}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

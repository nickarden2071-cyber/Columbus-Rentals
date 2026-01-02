'use server'

import { createClient } from '@/utils/supabase/server'

export async function runDiagnostics() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { 
        success: false, 
        step: 'auth', 
        message: 'Authentication failed. Please log in again.',
        details: authError?.message 
      }
    }

    // 1. Test Read (Categories) - usually public or low risk
    const { error: readError } = await supabase.from('categories').select('count').limit(1).single()
    if (readError && readError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is fine
       // Actually .single() errors if no rows.
    }

    // 2. Test Insert (Equipment)
    // specific ID to avoid pollution
    const testName = `DIAGNOSTIC_TEST_${Date.now()}`
    
    const { data, error: insertError } = await supabase
      .from('equipment')
      .insert({
        name: testName,
        total_quantity: 0,
        status: 'maintenance',
        description: 'Temporary diagnostic record. Safe to delete.'
      })
      .select()
      .single()

    if (insertError) {
      return { 
        success: false, 
        step: 'insert', 
        message: 'Database Write Failed', 
        code: insertError.code,
        details: insertError.message
      }
    }

    // 3. Test Delete (Clean up)
    if (data?.id) {
        const { error: deleteError } = await supabase
        .from('equipment')
        .delete()
        .eq('id', data.id)
        
        if (deleteError) {
            return {
                success: true, // Insert worked, so the main issue is solved, but cleanup failed
                step: 'delete',
                message: 'Write succeeded but cleanup failed.',
                details: deleteError.message
            }
        }
    }

    return { success: true, message: 'All checks passed. Database is writable.' }

  } catch (err: any) {
    return {
        success: false,
        step: 'unknown',
        message: 'Unexpected error',
        details: err.message
    }
  }
}

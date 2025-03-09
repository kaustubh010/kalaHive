import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = await createClient();
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data?.user) {
      // Check if this is a new user by looking for their profile
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      // If no profile exists or onboarding is not completed, redirect to onboarding
      if (profileError || !existingProfile || !existingProfile.onboardingCompleted) {
        return NextResponse.redirect(new URL('/onboarding/user-type', requestUrl.origin));
      }
      
      // If profile exists and onboarding is completed, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
    }
  }

  // Default redirect if something goes wrong
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
} 
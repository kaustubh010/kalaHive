import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  
  if (code) {
    const supabase = await createClient();
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (!error && data?.user) {
        // Check if this is a new user by looking for their profile
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('onboardingCompleted, createdAt, userType')
          .eq('id', data.user.id)
          .single();
        
        // If no profile exists or onboarding is not completed, redirect to onboarding
        if (profileError || !existingProfile) {
          console.log('Redirecting to onboarding: New user');
          return NextResponse.redirect(new URL('/onboarding/user-type', requestUrl.origin));
        }
        
        // If onboarding is not completed, redirect to the appropriate onboarding step
        if (existingProfile.onboardingCompleted === false) {
          if (existingProfile.userType === 'artist') {
            console.log('Redirecting to artist setup: Onboarding not completed');
            return NextResponse.redirect(new URL('/onboarding/artist-setup', requestUrl.origin));
          } else if (existingProfile.userType === 'buyer') {
            console.log('Redirecting to buyer setup: Onboarding not completed');
            return NextResponse.redirect(new URL('/onboarding/buyer-setup', requestUrl.origin));
          } else {
            console.log('Redirecting to user type selection: User type not selected');
            return NextResponse.redirect(new URL('/onboarding/user-type', requestUrl.origin));
          }
        }
        
        // If profile exists and onboarding is completed, redirect to dashboard
        console.log('Redirecting to dashboard: Existing user with completed onboarding');
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin));
      }
    } catch (error) {
      console.error('Error in auth callback:', error);
    }
  }

  // Default redirect if something goes wrong
  console.log('Default redirect to login: Something went wrong');
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
} 
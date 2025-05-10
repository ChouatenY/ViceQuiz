import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export function middleware(request: NextRequest) {
  // Get the user ID from the cookie
  const userId = request.cookies.get('quizzy_local_user_id')?.value;
  
  // If there's no user ID, create one and set it in a cookie
  if (!userId) {
    const response = NextResponse.next();
    const newUserId = uuidv4();
    
    // Set the cookie with a long expiration (1 year)
    response.cookies.set('quizzy_local_user_id', newUserId, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    });
    
    return response;
  }
  
  return NextResponse.next();
}

// Run the middleware on all routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

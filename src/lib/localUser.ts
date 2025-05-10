import { v4 as uuidv4 } from 'uuid';

// Function to get or create a local user ID
export const getLocalUserId = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // Try to get existing user ID from localStorage
    let userId = localStorage.getItem('quizzy_local_user_id');
    
    // If no user ID exists, create a new one and store it
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem('quizzy_local_user_id', userId);
    }
    
    return userId;
  }
  
  // For server-side rendering, return a temporary ID
  // This will be replaced with the actual ID on the client
  return 'temp-user-id';
};

// Function to initialize the local user ID on the client side
export const initLocalUser = (): void => {
  // Ensure we're in a browser environment
  if (typeof window !== 'undefined') {
    // Get or create the local user ID
    getLocalUserId();
  }
};

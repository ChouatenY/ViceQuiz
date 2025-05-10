import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

// Function to get or create a local user ID on the server side
export const getServerLocalUser = async () => {
  const cookieStore = cookies();
  let userId = cookieStore.get('quizzy_local_user_id')?.value;

  // If no user ID exists in cookies, create a new one
  if (!userId) {
    userId = uuidv4();
  }

  return {
    user: {
      id: userId,
      name: 'Local User',
    }
  };
};

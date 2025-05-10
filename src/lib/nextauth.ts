import { getServerLocalUser } from "./serverLocalUser";

// Define a type for our local user session
export interface LocalUserSession {
  user: {
    id: string;
    name: string;
  };
}

// Function to get the local user session
export const getAuthSession = async (): Promise<LocalUserSession | null> => {
  return getServerLocalUser();
};

// This file is kept for compatibility with existing imports
// We're not using Prisma anymore, but keeping this file to avoid breaking imports

import "server-only";

// Mock Prisma client for compatibility
export const prisma = {
  // Add any mock methods that might be needed
  game: {
    count: async () => 0,
  },
  topic_count: {
    findMany: async () => [],
  },
};

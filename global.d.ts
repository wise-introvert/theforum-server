declare module Interfaces {
  type DateTime = string;

  interface UserWithMethods {
    getID: () => string;
    getUsername: () => string;
    getPasswordHash: () => string;
    getEmail: () => string;
    getDescription: () => string;
    isVerified: () => boolean;
    isArchived: () => boolean;
    getHash: () => string;
    getLastActive: () => DateTime;
    getAvatar: () => string;
  }

  interface ForumWithMethods {
    getID: () => string;
    getTitle: () => string;
    getDescription: () => string;
    getImage: () => string;
    getAuthorID: () => string;
    getThreadIDs: () => Array<string>;
  }
}

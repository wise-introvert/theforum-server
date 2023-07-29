declare module Interfaces {
  type DateTime = string;

  interface UserNetwork {
    followers: Array<string>;
    following: Array<string>;
  }

  // TODO
  interface Karma {
    value: number;
  }

  // TODO
  interface Log {
    _id: string;
    actors: Array<string>;
    actions: Array<string>;
    createdAt: DateTime;
  }

  interface User {
    _id: string;
    username: string;
    password: string;
    email: string;
    avatar: string;
    isVerified: boolean;
    isArchived: boolean;
    hash: string;
    lastActive: DateTime;
    forums: Array<string>;
    threads: Array<string>;
    posts: Array<string>;
    saved: Array<string>;
    network: UserNetwork;
    karma: Karma;
    createdAt: DateTime;
    updatedAt: DateTime;
    activityLog: Array<Log>;
  }

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

  // Define UserProfile and UserReport interfaces used in UserWithMethods
  interface UserProfile {
    username: string;
    email: string;
    karma: number;
    forums: Array<string>;
    threads: Array<string>;
    posts: Array<string>;
  }

  // TODO
  interface UserReport extends UserProfile {
    postsCount: number;
    threadsCount: number;
    followersCount: number;
    followingCount: number;
  }

  interface BaseResponse {
    success: boolean;
  }

  interface LoginResponse extends BaseResponse {
    token: string;
    user: Pick<User, "username" | "_id">;
  }

  interface UpdateUserProfileResponse extends BaseResponse {
    user: Omit<User, "password">;
  }

  interface FollowUserResponse extends BaseResponse {}
  interface UnFollowUserResponse extends BaseResponse {}

  interface RegisterUserInput {
    username: string;
    password: string;
    email: string;
    avatar?: string;
  }
  interface UpdateUserProfileInput {
    username: string;
    email: string;
    karma: number;
    forums: Array<string>;
    threads: Array<string>;
    posts: Array<string>;
  }
}

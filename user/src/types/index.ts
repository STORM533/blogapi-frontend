export interface User {
  id: number;
  username: string;
  email: string;
  role: "USER" | "AUTHOR";
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    username: string;
  };
  _count?: {
    comments: number;
  };
}

export interface PostDetail extends Post {
  comments: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedPosts {
  posts: Post[];
  pagination: Pagination;
}

export interface MyComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  post: {
    id: number;
    title: string;
  };
}

export interface PaginatedComments {
  comments: MyComment[];
  pagination: Pagination;
}

export interface ApiError {
  message: string;
  errors?: {
    field?: string;
    message: string;
  }[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

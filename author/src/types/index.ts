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

export interface PostFormData {
  title: string;
  content: string;
  published: boolean;
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

export interface LoginResponse {
  token: string;
}

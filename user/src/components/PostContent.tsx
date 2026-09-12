import type { PostDetail } from "../types";

interface PostContentProps {
  post: PostDetail;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {post.title}
      </h1>
      <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-gray-500">
        <span>by {post.author.username}</span>
        <span className="hidden sm:inline">·</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-4 sm:mt-6 prose prose-gray max-w-none text-sm sm:text-base">
        {post.content.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

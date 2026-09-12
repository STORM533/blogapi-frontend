import type { PostDetail } from "../types";

interface PostContentProps {
  post: PostDetail;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <article className="bg-white rounded-lg shadow p-6">
      <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
        <span>by {post.author.username}</span>
        <span>·</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mt-6 prose prose-gray max-w-none">
        {post.content.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}

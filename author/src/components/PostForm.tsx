import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";
import { FetchError } from "../api/client";
import commonStyles from "../styles/common.module.css";
import postsStyles from "../styles/posts.module.css";
import type { PostFormData } from "../types";
interface PostFormProps {
  initialData?: PostFormData;
  onSubmit: (data: PostFormData) => Promise<void>;
  submitLabel: string;
}

export default function PostForm({
  initialData,
  onSubmit,
  submitLabel,
}: PostFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [published, setPublished] = useState(initialData?.published || false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await onSubmit({ title, content, published });
    } catch (err) {
      if (err instanceof FetchError && err.data.errors?.length) {
        const fields: Record<string, string> = {};
        err.data.errors.forEach((e) => {
          if (e.field) fields[e.field] = e.message;
        });
        setFieldErrors(fields);
        setError(err.data.message);
      } else {
        setError(err instanceof Error ? err.message : "Failed to save post");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={postsStyles.postForm}>
      {error && <div className={commonStyles.errorAlert}>{error}</div>}

      <div>
        <label htmlFor="title" className={commonStyles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          required
          maxLength={200}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={commonStyles.input}
        />
        {fieldErrors.title && (
          <p className={postsStyles.errorText}>{fieldErrors.title}</p>
        )}
      </div>

      <div>
        <label className={commonStyles.label}>Content</label>
        <div className={postsStyles.editorWrap}>
          <Editor
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey="gpl"
            value={content}
            onEditorChange={(newContent) => setContent(newContent)}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | bold italic underline strikethrough | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | link | removeformat",
              content_style:
                "body { font-family: 'Cormorant Garamond', serif; font-size: 18px; line-height: 1.7; color: #1B1930; }",
              branding: false,
              promotion: false,
            }}
          />
        </div>
        {fieldErrors.content && (
          <p className={postsStyles.errorText}>{fieldErrors.content}</p>
        )}
      </div>

      <div className={postsStyles.checkboxRow}>
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        <label htmlFor="published" className={postsStyles.checkboxLabel}>
          Publish immediately
        </label>
      </div>

      <button type="submit" disabled={loading} className={commonStyles.btnPrimary}>
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

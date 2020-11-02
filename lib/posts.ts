import fs from "fs";
import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

export type EsaFrontMatter = {
  readonly title: string;
  readonly category: string;
  readonly tags: string | undefined;
  readonly created_at: string; // esa の形式は 2020-10-30 11:06:34 +0900
  readonly updated_at: string;
  readonly published: boolean;
  readonly number: number;
};

export type PostContent = {
  readonly slug: string;
  readonly title: string;
  readonly tags: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly content: string;
  readonly id: number;
};

export type PostMap = {
  [slug: string]: PostContent;
};

let postCache: PostContent[];
let postMapCache: PostMap;

export function fetchPosts(): { posts: PostContent[]; postMap: PostMap } {
  if (postCache && postMapCache) {
    return { posts: postCache, postMap: postMapCache };
  }

  const fileNames = fs.readdirSync(postsDirectory);

  postCache = fileNames
    .filter((it) => it.endsWith(".md"))
    .map((fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { content, data } = (matter(fileContents) as unknown) as {
        content: string;
        data: EsaFrontMatter;
      };

      return {
        slug: data.category,
        title: data.title,
        tags: data.tags?.split(",")?.map((t) => t.trim()) ?? [],
        createdAt: new Date(data.created_at).toISOString(),
        updatedAt: new Date(data.updated_at).toISOString(),
        content,
      } as PostContent;
    })
    .sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } else {
        return -1;
      }
    });

  postMapCache = {};
  postCache.forEach((post) => {
    postMapCache[post.slug] = post;
  });

  return { posts: postCache, postMap: postMapCache };
}

export function countPosts(tag?: string): number {
  return fetchPosts().posts.filter((it) => !tag || it.tags?.includes(tag))
    .length;
}

export function listPostContent(
  page: number,
  limit: number,
  tag?: string
): PostContent[] {
  return fetchPosts()
    .posts.filter((post) => !tag || post.tags?.includes(tag))
    .slice((page - 1) * limit, page * limit);
}

import fs from "fs/promises";
import matter from "gray-matter";
import path from "path";
import unified from "unified";
import parse from "remark-parse";
import breaks from "remark-breaks";
import emoji from "remark-emoji";
import gfm from "remark-gfm";
import remark2rehype from "remark-rehype";
import rehypePrism from "@mapbox/rehype-prism";
import html from "rehype-stringify";

const processor = unified()
  .use(parse)
  .use(gfm)
  .use(breaks)
  .use(emoji)
  .use(remark2rehype)
  .use(rehypePrism)
  .use(html);

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

let postsCache: PostContent[];

export async function fetchPosts(): Promise<PostContent[]> {
  if (postsCache) {
    return postsCache;
  }

  const fileNames = await fs.readdir(postsDirectory);

  const jobs = fileNames
    .filter((it) => it.endsWith(".md"))
    .map(async (fileName) => {
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.readFile(fullPath, "utf8");

      const { content: markdown, data } = matter(fileContents);
      const { contents } = await processor.process(markdown);

      return {
        slug: data.category,
        title: data.title,
        tags: data.tags?.split(",")?.map((t) => t.trim()) ?? [],
        createdAt: new Date(data.created_at).toISOString(),
        updatedAt: new Date(data.updated_at).toISOString(),
        content: contents,
      } as PostContent;
    });

  const posts = await Promise.all(jobs);

  postsCache = posts.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    } else {
      return -1;
    }
  });

  return postsCache;
}

export async function getPost(slug: string): Promise<PostContent> {
  const posts = await fetchPosts();
  return posts.find((post) => post.slug === slug);
}

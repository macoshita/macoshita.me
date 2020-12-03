import FS from "fs";
import path from "path";
import wfm from "@macoshita/wasm-frontmatter-markdown";

const fs = FS.promises;

const postsDirectory = path.join(process.cwd(), "posts");
const publishedAtRegex = /^(\d{4}-\d{2}-\d{2})-/;

export type EsaFrontmatter = {
  readonly title: string;
  readonly category: string;
  readonly tags: string | undefined;
  readonly created_at: string; // esa の形式は 2020-10-30 11:06:34 +0900
  readonly updated_at: string;
  readonly published: boolean;
};

export type PostInfo = {
  readonly slug: string;
  readonly title: string;
  readonly tags: string[];
  readonly publishedAt: string;
  readonly updatedAt: string;
};

export type PostContent = {
  info: PostInfo;
  content: string;
};

let postsCache: PostInfo[];
let postsFilePathCache: { [key: string]: string };

export async function fetchPostInfo(): Promise<PostInfo[]> {
  if (postsCache) {
    return postsCache;
  }

  const now = new Date().getTime();

  const fileNames = await fs.readdir(postsDirectory);
  const jobs = fileNames
    .filter((it) => it.endsWith(".md"))
    .map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = await fs.readFile(filePath, "utf8");
      const fm: EsaFrontmatter = wfm.parse(fileContent, {
        frontmatter: true,
        content: false,
      }).frontmatter;

      const slugPublishedAt = fm.category.match(publishedAtRegex)?.[1];

      const publishedAt = new Date(
        slugPublishedAt ? `${slugPublishedAt} 00:00:00 +0900` : fm.created_at
      );

      return {
        filePath,
        publishedAt,
        fm,
      };
    });

  const tmp = (await Promise.all(jobs))
    .filter(({ publishedAt }) => now >= publishedAt.getTime())
    .sort((a, b) =>
      a.publishedAt.getTime() < b.publishedAt.getTime() ? 1 : -1
    );

  postsCache = [];
  postsFilePathCache = {};

  tmp.forEach(({ filePath, publishedAt, fm }) => {
    postsFilePathCache[fm.category] = filePath;

    postsCache.push({
      slug: fm.category,
      title: fm.title,
      tags: fm.tags?.split(",")?.map((t) => t.trim()) ?? [],
      publishedAt: publishedAt.toISOString(),
      updatedAt: new Date(fm.updated_at).toISOString(),
    });
  });

  return postsCache;
}

export async function getPost(slug: string): Promise<PostContent> {
  const posts = await fetchPostInfo();
  const info = posts.find((post) => post.slug === slug);
  if (!info) {
    throw Error("file not found");
  }

  const filePath = postsFilePathCache[slug];
  const fileContent = await fs.readFile(filePath, "utf8");
  return {
    info,
    content: wfm.parse(fileContent, { frontmatter: false, content: true })
      .content,
  };
}

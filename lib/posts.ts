import FS from "fs";
import path from "path";
import wfm from "@macoshita/wasm-frontmatter-markdown";

const fs = FS.promises;

const postsDirectory = path.join(process.cwd(), "posts");

export type EsaFrontmatter = {
  readonly title: string;
  readonly category: string;
  readonly tags: string | undefined;
  readonly created_at: string; // esa の形式は 2020-10-30 11:06:34 +0900
  readonly updated_at: string;
  readonly published: boolean;
};

export type PostInfo = {
  readonly filePath: string;
  readonly slug: string;
  readonly title: string;
  readonly tags: string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PostContent = {
  info: PostInfo;
  content: string;
};

let postsCache: PostInfo[];

export async function fetchPostInfo(): Promise<PostInfo[]> {
  if (postsCache) {
    return postsCache;
  }

  const fileNames = await fs.readdir(postsDirectory);

  const jobs = fileNames
    .filter((it) => it.endsWith(".md"))
    .map(async (fileName) => {
      const filePath = path.join(postsDirectory, fileName);
      const fileContent = await fs.readFile(filePath, "utf8");
      const frontmatter: EsaFrontmatter = wfm.parse(fileContent, {
        frontmatter: true,
        content: false,
      }).frontmatter;

      return {
        filePath,
        slug: frontmatter.category,
        title: frontmatter.title,
        tags: frontmatter.tags?.split(",")?.map((t) => t.trim()) ?? [],
        createdAt: new Date(frontmatter.created_at).toISOString(),
        updatedAt: new Date(frontmatter.updated_at).toISOString(),
      };
    });

  const now = new Date().getTime();
  const posts = (await Promise.all(jobs)).filter(
    ({ createdAt }) => now >= new Date(createdAt).getTime()
  );

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
  const posts = await fetchPostInfo();
  const info = posts.find((post) => post.slug === slug);
  if (!info) {
    throw Error("file not found");
  }

  const fileContent = await fs.readFile(info.filePath, "utf8");
  return {
    info,
    content: wfm.parse(fileContent, { frontmatter: false, content: true })
      .content,
  };
}

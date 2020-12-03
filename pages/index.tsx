import Layout from "@/components/layout";
import { GetStaticProps } from "next";
import { fetchPostInfo, PostInfo } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";

type Post = Pick<PostInfo, "slug" | "title" | "publishedAt">;

type Props = {
  posts: Post[];
};

export default function Home({ posts }: Props): JSX.Element {
  return (
    <Layout home>
      <div className="max-w-screen-lg mx-auto px-4 grid lg:grid-cols-3 md:grid-cols-2 gap-4">
        {posts.map(({ slug, title, publishedAt }, i) => (
          <Link key={i} href={`/posts/${slug}`}>
            <a className="block bg-surface text-on-surface p-4 rounded shadow">
              <div className="text-secondary text-sm">
                {format(new Date(publishedAt), "yyyy-MM-dd")}
              </div>
              <h2 className="post-title">{title}</h2>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await fetchPostInfo();
  return {
    props: {
      posts: posts.map(({ slug, title, publishedAt }) => ({
        slug,
        title,
        publishedAt,
      })),
    },
  };
};

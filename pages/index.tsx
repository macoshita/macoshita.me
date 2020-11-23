import Layout from "@/components/layout";
import { GetStaticProps } from "next";
import { fetchPostInfo, PostInfo } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";

type Post = Pick<PostInfo, "slug" | "title" | "createdAt">;

type Props = {
  posts: Post[];
};

export default function Home({ posts }: Props): JSX.Element {
  return (
    <Layout home>
      <div className="posts">
        {posts.map(({ slug, title, createdAt }, i) => (
          <div key={i} className="post">
            <div className="post-date">
              {format(new Date(createdAt), "yyyy-MM-dd")}
            </div>
            <h2 className="post-title">
              <Link href={`/posts/${slug}`}>
                <a className="post">{title}</a>
              </Link>
            </h2>
          </div>
        ))}
      </div>

      <style jsx>{`
        .posts {
          max-width: var(--width-main);
          margin: auto;
        }
        .post {
          text-align: center;
        }
        .post-date {
          color: var(--color-sub-text);
        }
        .post-title {
          margin-top: 0;
          color: var(--color-text);
        }
      `}</style>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const posts = await fetchPostInfo();
  return {
    props: {
      posts: posts.map((post) => ({
        slug: post.slug,
        title: post.title,
        createdAt: post.createdAt,
      })),
    },
  };
};

import Head from "next/head";
import Layout from "@/components/layout";
import { GetStaticProps } from "next";
import { listPostContent, PostContent } from "@/lib/posts";
import Link from "next/link";
import { format } from "date-fns";

type Props = {
  posts: PostContent[];
};

export default function Home({ posts }: Props): JSX.Element {
  return (
    <Layout home>
      <Head>
        <title>@macoshita</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
  const posts = listPostContent(1, 5);
  return {
    props: {
      posts,
    },
  };
};

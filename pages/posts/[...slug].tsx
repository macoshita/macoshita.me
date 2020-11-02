import Layout from "@/components/layout";
import { fetchPosts, getPost, PostContent } from "@/lib/posts";
import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import "prism-themes/themes/prism-a11y-dark.css";

export default function Post({
  content,
  title,
  createdAt,
}: PostContent): JSX.Element {
  return (
    <Layout title={title}>
      <article>
        <header>
          <time dateTime={createdAt}>
            {format(new Date(createdAt), "yyyy-MM-dd")}
          </time>
          <h1 className="title">{title}</h1>
        </header>
        <section dangerouslySetInnerHTML={{ __html: content }} />
      </article>
      <style jsx>{`
        article {
          max-width: var(--width-main);
          margin: 0 auto;
          padding: 0 16px;
        }
        header {
          text-align: center;
          margin-bottom: 48px;
        }
        .title {
          margin-top: 0;
          color: var(--color-title);
          font-size: min(9vw, 3rem);
        }
        section :global(img) {
          max-width: 100%;
        }
        section :global(a) {
          color: var(--color-link);
        }
      `}</style>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPosts();
  return {
    paths: posts.map((post) => `/posts/${post.slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostContent> = async ({
  params,
}) => {
  const slug =
    typeof params.slug === "string" ? params.slug : params.slug.join("/");
  return {
    props: await getPost(slug),
  };
};

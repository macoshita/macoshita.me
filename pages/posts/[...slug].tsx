import Layout from "@/components/layout";
import { fetchPostInfo, getPost, PostContent } from "@/lib/posts";
import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";

export default function Post({ content, info }: PostContent): JSX.Element {
  const { title, publishedAt } = info;
  return (
    <Layout title={title}>
      <article className="max-w-screen-lg mx-auto px-8">
        <header className="text-center mb-8">
          <time className="text-sm text-secondary" dateTime={publishedAt}>
            {format(new Date(publishedAt), "yyyy-MM-dd")}
          </time>
          <h1 className="title">{title}</h1>
        </header>
        <section
          className="post-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>
      <style jsx>{`
        .title {
          font-size: min(9vw, 3rem);
        }
      `}</style>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await fetchPostInfo();
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

import Layout from "@/components/layout";
import { fetchPosts, PostContent } from "@/lib/posts";
import { format } from "date-fns";
import { GetStaticPaths, GetStaticProps } from "next";
import ReactMarkdownWithHtml from "react-markdown/with-html";
import breaks from "remark-breaks";
import emoji from "remark-emoji";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { okaidia } from "react-syntax-highlighter/dist/cjs/styles/prism";

const code = ({ language, value }) => {
  return (
    <SyntaxHighlighter style={okaidia} language={language}>
      {value}
    </SyntaxHighlighter>
  );
};

const renderers = {
  code,
};

export default function Post({
  content,
  title,
  createdAt,
}: PostContent): JSX.Element {
  return (
    <Layout>
      <article>
        <header>
          <time dateTime={createdAt}>
            {format(new Date(createdAt), "yyyy-MM-dd")}
          </time>
          <h1 className="title">{title}</h1>
        </header>
        <section>
          <ReactMarkdownWithHtml
            plugins={[gfm, breaks, emoji]}
            renderers={renderers}
            allowDangerousHtml
          >
            {content}
          </ReactMarkdownWithHtml>
        </section>
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
  return {
    paths: fetchPosts().posts.map((post) => `/posts/${post.slug}`),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PostContent> = async ({
  params,
}) => {
  const slug =
    typeof params.slug === "string" ? params.slug : params.slug.join("/");
  return {
    props: fetchPosts().postMap[slug],
  };
};

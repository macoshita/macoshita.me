import Link from "next/link";
import config from "../config";

function PostHeader(): JSX.Element {
  return (
    <header>
      <Link href="/">
        <a>{config.title}</a>
      </Link>
      <style jsx>{`
        header {
          text-align: center;
          margin: 48px auto;
          font-size: 1.5rem;
        }
      `}</style>
    </header>
  );
}

export default PostHeader;

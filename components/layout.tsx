import Head from "next/head";
import HomeHeader from "./HomeHeader";
import PageHeader from "./PageHeader";
import SNS from "./SNS";

type Props = {
  children: React.ReactNode;
  home?: boolean;
  title?: string;
};

function Layout({ home, title, children }: Props): JSX.Element {
  return (
    <>
      <Head>
        <title>{title ? `${title} - ` : ""}@macoshita</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col space-y-4">
        {home ? <HomeHeader className="my-24" /> : <PageHeader />}
        <main className="flex-grow">{children}</main>
        <footer className="text-center">
          {home ? null : <SNS />}
          <div className="my-4">©2020</div>
        </footer>
      </div>
    </>
  );
}

export default Layout;

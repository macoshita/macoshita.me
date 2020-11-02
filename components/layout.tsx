import HomeHeader from "./HomeHeader";
import PageHeader from "./PageHeader";
import SNS from "./SNS";

type Props = {
  children: React.ReactNode;
  home?: boolean;
};

function Layout({ home, children }: Props): JSX.Element {
  return (
    <div className="container">
      {home ? <HomeHeader /> : <PageHeader />}
      <main>{children}</main>
      <footer>
        {home ? null : <SNS />}
        <div className="copyright">©2020</div>
      </footer>
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        main {
          flex: 1;
        }
        footer {
          margin: 32px auto;
          text-align: center;
        }
        .copyright {
          margin-top: 16px;
          color: var(--color-sub-text);
        }
      `}</style>
    </div>
  );
}

export default Layout;

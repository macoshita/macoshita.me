import config from "../config";
import SNS from "./SNS";

function HomeHeader(): JSX.Element {
  return (
    <header>
      <h1 className="title">{config.title}</h1>
      <p className="description">
        Software Engineer ❤ Flutter/Dart, Vue, React, etc.
      </p>
      <SNS />
      <style jsx>{`
        header {
          text-align: center;
          margin: 64px auto;
        }
        .title {
          font-size: min(10vw, 80px);
          margin: 0;
        }
        .description {
          font-size: min(3vw, 24px);
          margin-top: 0;
        }
      `}</style>
    </header>
  );
}

export default HomeHeader;

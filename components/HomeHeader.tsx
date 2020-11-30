import config from "../config";
import SNS from "./SNS";

type Props = {
  className?: string;
};

const HomeHeader: React.FC<Props> = ({ className }) => {
  return (
    <header className={`text-center space-y-4 ${className ?? ""}`}>
      <h1 className="title">{config.title}</h1>
      <p className="description">
        Software Engineer ❤ Flutter/Dart, Vue, React, etc.
      </p>
      <SNS />
      <style jsx>{`
        .title {
          font-size: min(10vw, 80px);
        }
        .description {
          font-size: min(3vw, 24px);
        }
      `}</style>
    </header>
  );
};

export default HomeHeader;

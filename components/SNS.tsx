import { Github, Twitter } from "@icons-pack/react-simple-icons";

type Props = {
  className?: string;
};

const SNS: React.FC<Props> = (props) => {
  return (
    <div className={`flex justify-center space-x-4 ${props.className ?? ""}`}>
      <a href="https://github.com/macoshita">
        <Github />
      </a>
      <a href="https://twitter.com/macoshita">
        <Twitter />
      </a>
      <style jsx>{`
        .icons > .icon {
          margin: 0 1rem;
        }
      `}</style>
    </div>
  );
};

export default SNS;

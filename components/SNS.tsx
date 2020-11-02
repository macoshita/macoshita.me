import { Github, Twitter } from "@icons-pack/react-simple-icons";

function SNS(): JSX.Element {
  return (
    <div className="icons">
      <a className="icon" href="https://github.com/macoshita">
        <Github />
      </a>
      <a className="icon" href="https://twitter.com/macoshita">
        <Twitter />
      </a>
      <style jsx>{`
        .icons > .icon {
          margin: 0 1rem;
        }
      `}</style>
    </div>
  );
}

export default SNS;

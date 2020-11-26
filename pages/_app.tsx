import { AppProps } from "next/app";
import "./styles.css";
import "@macoshita/wasm-frontmatter-markdown/highlight.css";

function App({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}

export default App;

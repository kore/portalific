import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../styles/globals.scss";
import "../styles/theme.scss";

function MyApp({ Component, pageProps }) {
  return (
    <DndProvider backend={HTML5Backend}>
      <Component {...pageProps} />
    </DndProvider>
  );
}

export default MyApp;

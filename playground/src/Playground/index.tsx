import { FastXChartsPlaygroundContextProvider } from "./context";
import Playground from "./Playground";
import "./index.scss";

const FastXChartsPlayground = () => {
  return (
    <FastXChartsPlaygroundContextProvider>
      <Playground />
    </FastXChartsPlaygroundContextProvider>
  );
};

export default FastXChartsPlayground;

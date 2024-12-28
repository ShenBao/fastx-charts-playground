import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IFastXChartsPlaygroundContext } from "./type";
import { chartOptions } from "../constants";
import { compileCode } from "../utils";

export const FastXChartsPlaygroundContext = createContext<{
  state: IFastXChartsPlaygroundContext;
  setState: (newState: IFastXChartsPlaygroundContext) => void;
}>({
  state: {} as IFastXChartsPlaygroundContext,
  setState: (newState: IFastXChartsPlaygroundContext) => {
    console.log("newState:", newState);
  },
});

export const FastXChartsPlaygroundContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<IFastXChartsPlaygroundContext>(
    {} as IFastXChartsPlaygroundContext
  );

  useEffect(() => {
    const defaultItem = chartOptions[0];
    setState({
      chartName: defaultItem?.value,
      chartVersion: defaultItem.defaultCodeVersion,
      scripts: [],
      renderType: "sandbox",
      // renderType: "iframe" ,
      code: defaultItem?.defaultCode,
      compiledCode: compileCode(defaultItem?.defaultCode)
    });
  }, []);

  const handleSetState = useCallback(
    (newState: IFastXChartsPlaygroundContext) => {
      setState({
        ...state,
        ...newState,
      });
    },
    [state]
  );

  return (
    <FastXChartsPlaygroundContext
      value={{
        state,
        setState: handleSetState,
      }}
    >
      {children}
    </FastXChartsPlaygroundContext>
  );
};

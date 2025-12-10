import { useContext } from "react";
import {_ActiveLayersContext} from "./_ActiveLayersContext.ts";


export default function useActiveLayersContext() {
  const context = useContext(_ActiveLayersContext);
  if (!context) {
    throw new Error("useLayerContext must be used within the context");
  }
  return context;
}
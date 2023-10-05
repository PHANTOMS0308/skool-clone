import React, { useReducer, createContext, useContext, useEffect } from "react";
import { EditorData } from "../types";
import dataReducer, { Action } from "../reducers/dataReducer";

export interface DataProviderProps {
  children: React.ReactNode;
  initialData: EditorData;
}

const DataContext = createContext<EditorData | null>(null);
const DataDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export function DataProvider(props: DataProviderProps) {
  const { children, initialData } = props;
  const [data, dataDispatch] = useReducer(dataReducer, initialData);

  useEffect(() => {
    console.log(data);
  });

  return (
    <DataContext.Provider value={data}>
      <DataDispatchContext.Provider value={dataDispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataContext.Provider>
  );
}

export function useData() {
  const dataContext = useContext(DataContext);

  if (!dataContext) {
    throw new Error("useData can only be used within DataProvider");
  }

  return dataContext;
}

export function useDataDispatch() {
  const dataDispatchContext = useContext(DataDispatchContext);

  if (!dataDispatchContext) {
    throw new Error("useDataDispatch can only be used within DataProvider");
  }

  return dataDispatchContext;
}

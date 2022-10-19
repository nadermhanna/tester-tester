/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useReducer } from "react";
import { readCollection, readDoc } from "./reeadOnce";
import { DocumentReference, Query } from "firebase/firestore";

interface Data {
  error: any;
  doc: any;
}

const initialState: Data = {
  doc: {},
  error: {},
};

type ACTIONS =
  | { type: "setError"; payload: any }
  | { type: "setData"; payload: any };

const reducer = (state: typeof initialState, action: ACTIONS) => {
  switch (action.type) {
    case "setError":
      return {
        ...state,
        error: action.payload,
      };
    case "setData":
      return {
        ...state,
        doc: action.payload,
      };
    default:
      return state;
  }
};

export const useReadDocOnce = (
  uniqueId?: string,
  docRef?: DocumentReference,
) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  const getData = async (docRef: DocumentReference) => {
    try {
      const response = await readDoc(docRef);
      dispatch({ type: "setData", payload: response });
    } catch (e) {
      dispatch({ type: "setError", payload: e });
    }
  };

  useEffect(() => {
    !!docRef && getData(docRef);
  }, [uniqueId]);

  return data;
};

export const useReadCollectionOnce = (query: Query, uniqueId: string) => {
  const [data, dispatch] = useReducer(reducer, initialState);

  const getData = async (query: Query) => {
    try {
      const response = await readCollection(query);
      dispatch({ type: "setData", payload: response });
    } catch (e) {
      dispatch({ type: "setError", payload: e });
    }
  };

  useEffect(() => {
    getData(query);
  }, [uniqueId]);

  return data;
};

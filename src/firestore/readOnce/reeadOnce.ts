import { DocumentReference, getDoc, getDocs, Query } from "firebase/firestore";

const throwErr = (msg: string) => {
  throw new Error(msg);
};

export const readDoc = async (docRef: DocumentReference) => {
  const doc = await getDoc(docRef);
  const { exists } = doc;
  !exists && throwErr("Document does not exist");
  return {
    id: doc.id,
    ...doc.data(),
  };
};

export const readCollection = async (query: Query) => {
  const querySnapshot = await getDocs(query);
  const { empty, docs } = querySnapshot;
  const docsFromDb = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  const lastDoc = empty ? null : docs[docs.length - 1];
  const isAtEnd = empty && docs.length === 0;
  return {
    data: docsFromDb,
    lastDoc,
    isAtEnd,
  };
};

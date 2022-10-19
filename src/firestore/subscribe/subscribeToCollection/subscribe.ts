// libs
import { Unsubscribe, onSnapshot, QuerySnapshot } from "firebase/firestore";

// types
import {
  SubscribeToCollection,
  ItemWithId,
  CompileChanges,
  PerformCallback,
} from "./types";

/**
 * get all the changes from the snapshot of a
 * specific change type
 *  */
const compileChanges = <t extends ItemWithId>({
  snapshot,
  changeType,
}: CompileChanges): t[] => {
  const changes = snapshot.docChanges().reduce((dataSoFar, change) => {
    const { doc, type } = change;
    const shouldAdd = type === changeType;
    return shouldAdd
      ? [...dataSoFar, { ...doc.data(), id: doc.id } as t]
      : dataSoFar;
  }, [] as t[]);
  return changes;
};

/**
 * will only commit the changes if there are changes
 * to commit
 */
const performCallback = <t extends ItemWithId>({
  callback,
  snapshot,
  changeType,
}: PerformCallback<t>) => {
  const changes = compileChanges({
    snapshot,
    changeType,
  });
  changes.length > 0 && callback(changes as t[]);
};

export const subscribeToCollection = <t extends ItemWithId>({
  query,
  operations,
}: SubscribeToCollection<t>): Unsubscribe => {
  const unsubscribe = onSnapshot(query, (snapshot: QuerySnapshot) => {
    const { onAdd, onRemove, onModify } = operations;

    !!onAdd &&
      performCallback({
        callback: onAdd,
        snapshot,
        changeType: "added",
      });

    !!onRemove &&
      performCallback({
        callback: onRemove,
        snapshot,
        changeType: "removed",
      });

    !!onModify &&
      performCallback({
        callback: onModify,
        snapshot,
        changeType: "modified",
      });
  });
  return unsubscribe;
};

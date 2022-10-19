// libs
import { useEffect, useState } from "react";

// types
import { UseSubscribeToCollection, ItemWithId, ChangeType } from "./types";

// helpers
import { subscribeToCollection } from "./subscribe";

export const useSubscribeToCollection = <i extends ItemWithId>({
  query,
  changesToTrack = ["add", "modify", "remove"],
  log = false,
  moderatorOnly = false,
  desc = false,
  uidOnly = false,
  uid,
}: UseSubscribeToCollection<i>) => {
  const [items, setItems] = useState<i[]>([]);

  const onAdd = (newItems: i[]) => {
    desc
      ? setItems((prevItems) => [...newItems, ...prevItems])
      : setItems((prevItems) => [...prevItems, ...newItems]);
  };

  const onRemove = (removedItems: i[]) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          removedItems.findIndex((removedItem) => removedItem.id === item.id) <
          0,
      ),
    );
  };

  const onModify = (modifiedItems: i[]) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        modifiedItems.includes(item)
          ? modifiedItems.find((modifiedItem) => modifiedItem.id === item.id) ||
            item
          : item,
      ),
    );
  };

  const shouldUseOperation = (changeType: ChangeType) =>
    changesToTrack.includes(changeType);

  const operations = {
    ...(shouldUseOperation("add") ? { onAdd } : {}),
    ...(shouldUseOperation("modify") ? { onModify } : {}),
    ...(shouldUseOperation("remove") ? { onRemove } : {}),
  };

  useEffect(() => {
    log && console.log("subscribing to collection");
    if (uidOnly && !!uid) {
      const unsub = subscribeToCollection<i>({
        query,
        operations,
      });
      return unsub;
    } else if (!uidOnly) {
      const unsub = subscribeToCollection<i>({
        query,
        operations,
      });
      return unsub;
    }
  }, [moderatorOnly, uidOnly, uid]);

  return items;
};

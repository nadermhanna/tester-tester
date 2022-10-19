import { DocumentChangeType, Query, QuerySnapshot } from "firebase/firestore";

export type ChangeType = "add" | "remove" | "modify";

export interface ItemWithId {
  id: string | number;
}

export interface SubscriptionOperations<t extends ItemWithId> {
  onAdd?: (items: t[]) => void;
  onRemove?: (items: t[]) => void;
  onModify?: (items: t[]) => void;
}

export interface UseSubscribeToCollection<t extends ItemWithId> {
  query: Query;
  changesToTrack?: ChangeType[];
  moderatorOnly?: boolean;
  uidOnly?: boolean;
  uid?: string;
  log?: boolean;
  desc?: boolean;
}

export interface SubscribeToCollection<t extends ItemWithId> {
  query: Query;
  operations: SubscriptionOperations<t>;
}

export interface CompileChanges {
  snapshot: QuerySnapshot;
  changeType: DocumentChangeType;
}

export interface PerformCallback<t extends ItemWithId> {
  callback: (items: t[]) => void;
  snapshot: QuerySnapshot;
  changeType: DocumentChangeType;
}

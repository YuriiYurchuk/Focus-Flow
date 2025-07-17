import { useState, useEffect, useCallback, useRef } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  getCountFromServer,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/shared/lib/firebase";
import { useToastStore } from "@/shared/store/toast";
import type { Task } from "@/entities/task/types";

const PAGE_SIZE = 36;

export const useTaskPagination = (
  uid: string | undefined,
  filterStatus: "all" | Task["status"]
) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const { showToast } = useToastStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);

  const buildBaseQuery = useCallback(() => {
    const base = collection(db, "users", uid!, "tasks");
    const statusFilter =
      filterStatus === "all" ? [] : [where("status", "==", filterStatus)];
    return query(base, ...statusFilter, orderBy("createdAt", "desc"));
  }, [uid, filterStatus]);

  useEffect(() => {
    mountedRef.current = true;

    if (!uid) {
      setTasks([]);
      setLoading(false);
      setTotalCount(null);
      return;
    }

    if (unsubscribeRef.current) {
      unsubscribeRef.current();
    }

    setLoading(true);
    setError(false);
    setLastVisible(null);
    setHasMore(true);

    const baseQuery = buildBaseQuery();
    const firstQuery = query(baseQuery, limit(PAGE_SIZE));

    const unsubscribe = onSnapshot(
      firstQuery,
      (snapshot) => {
        if (!mountedRef.current) return;

        const docs = snapshot.docs;
        const fetchedTasks = docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Task[];

        setTasks(fetchedTasks);
        setLastVisible(docs[docs.length - 1] ?? null);
        setHasMore(docs.length === PAGE_SIZE);
        setLoading(false);
      },
      (error) => {
        if (!mountedRef.current) return;
        console.error("Snapshot error:", error);
        setError(true);
        setLoading(false);
        showToast({
          message: "Не вдалося завантажити завдання.",
          type: "error",
        });
      }
    );

    unsubscribeRef.current = unsubscribe;

    getCountFromServer(baseQuery)
      .then((snapshot) => {
        if (mountedRef.current) {
          setTotalCount(snapshot.data().count);
        }
      })
      .catch((err) => {
        console.error("Error getting total count:", err);
      });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, [uid, filterStatus, buildBaseQuery, showToast]);

  const loadMore = useCallback(async () => {
    if (!uid || !lastVisible || loadingMore) return;

    setLoadingMore(true);
    try {
      const nextQuery = query(
        buildBaseQuery(),
        startAfter(lastVisible),
        limit(PAGE_SIZE)
      );
      const snapshot = await getDocs(nextQuery);

      if (!mountedRef.current) return;

      const newTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];

      setTasks((prev) => [...prev, ...newTasks]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } catch (err) {
      if (!mountedRef.current) return;
      console.error("Error loading more tasks:", err);
      showToast({
        message: "Не вдалося завантажити ще завдань.",
        type: "error",
      });
    } finally {
      if (mountedRef.current) {
        setLoadingMore(false);
      }
    }
  }, [uid, lastVisible, loadingMore, buildBaseQuery, showToast]);

  return {
    tasks,
    setTasks,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    totalCount,
    setTotalCount,
  };
};

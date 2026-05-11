import { useCallback, useEffect, useState } from "react";

interface PollingOptions<T> {
  enabled?: boolean;
  intervalMs?: number;
  queryFn: () => Promise<T>;
}

export function usePollingQuery<T>({
  queryFn,
  enabled = true,
  intervalMs = 30000,
}: PollingOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    if (!enabled) {
      return;
    }

    setError(null);
    try {
      const result = await queryFn();
      setData(result);
    } catch (queryError) {
      setError(queryError instanceof Error ? queryError.message : "Unable to load data.");
    } finally {
      setIsLoading(false);
    }
  }, [enabled, queryFn]);

  useEffect(() => {
    let intervalId: number | undefined;
    void run();

    if (enabled) {
      intervalId = window.setInterval(() => {
        void run();
      }, intervalMs);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [enabled, intervalMs, run]);

  return { data, isLoading, error, refetch: run };
}


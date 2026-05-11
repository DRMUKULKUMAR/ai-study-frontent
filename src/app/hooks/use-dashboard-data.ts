import { useMemo } from "react";
import { fetchMistakes, fetchTopics } from "../lib/study-api";
import { getHistory } from "../lib/local-db";
import { usePollingQuery } from "./use-polling-query";
import type { MistakeRecord, Topic, TopicInsight } from "../types/domain";

interface DashboardData {
  topics: Topic[];
  mistakes: MistakeRecord[];
}

function buildTopicInsights(topics: Topic[], mistakes: MistakeRecord[]): TopicInsight[] {
  const topicById = new Map(topics.map((topic) => [topic.id, topic.name]));

  const aggregate = new Map<number, { attempts: number; mistakes: number }>();
  for (const topic of topics) {
    aggregate.set(topic.id, {
      attempts: topic.questions_count ?? 0,
      mistakes: 0,
    });
  }

  for (const mistake of mistakes) {
    const id = mistake.topic_id ?? mistake.topic?.id;
    if (!id || !aggregate.has(id)) {
      continue;
    }

    const current = aggregate.get(id);
    if (!current) {
      continue;
    }

    current.attempts += 1;
    current.mistakes += 1;
    aggregate.set(id, current);
  }

  return [...aggregate.entries()].map(([topicId, item], index) => {
    const safeAttempts = Math.max(item.attempts, 1);
    const accuracy = Math.max(0, Math.round(((safeAttempts - item.mistakes) / safeAttempts) * 100));
    const confidence = Math.max(35, Math.min(98, accuracy));

    let recentTrend: TopicInsight["recentTrend"] = "stable";
    if (accuracy >= 80) {
      recentTrend = "improving";
    } else if (accuracy < 55) {
      recentTrend = "declining";
    }

    return {
      id: topicId,
      topic: topicById.get(topicId) ?? `Topic ${index + 1}`,
      attempts: safeAttempts,
      mistakes: item.mistakes,
      accuracy,
      confidence,
      recentTrend,
    };
  });
}

function buildWeeklySeries(mistakes: MistakeRecord[]) {
  const points = new Array(7).fill(0).map((_, dayOffset) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - dayOffset));
    date.setHours(0, 0, 0, 0);
    return {
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString(undefined, { weekday: "short" }),
      mistakes: 0,
    };
  });

  const map = new Map(points.map((point) => [point.key, point]));
  for (const mistake of mistakes) {
    const date = mistake.created_at ? new Date(mistake.created_at) : null;
    if (!date || Number.isNaN(date.getTime())) {
      continue;
    }
    const key = date.toISOString().slice(0, 10);
    const point = map.get(key);
    if (point) {
      point.mistakes += 1;
    }
  }

  return points.map((point, index, list) => {
    const baseline = list[0]?.mistakes ?? 0;
    const denominator = Math.max(baseline + 5, 1);
    const accuracy = Math.max(25, Math.min(100, Math.round((1 - point.mistakes / denominator) * 100)));
    return {
      day: point.label,
      mistakes: point.mistakes,
      accuracy,
    };
  });
}

export function useDashboardData() {
  const query = usePollingQuery<DashboardData>({
    queryFn: async () => {
      const [topics, mistakes] = await Promise.all([fetchTopics(), fetchMistakes()]);
      return { topics, mistakes };
    },
  });

  const derived = useMemo(() => {
    const topics = query.data?.topics ?? [];
    const mistakes = query.data?.mistakes ?? [];
    const insights = buildTopicInsights(topics, mistakes);
    const weakTopics = insights
      .slice()
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 4);

    const totalAttempts = insights.reduce((sum, item) => sum + item.attempts, 0);
    const totalMistakes = insights.reduce((sum, item) => sum + item.mistakes, 0);
    const masteryRate = totalAttempts > 0 ? Math.round(((totalAttempts - totalMistakes) / totalAttempts) * 100) : 0;
    const history = getHistory();

    const recentActivity = history.slice(0, 6);
    const weeklySeries = buildWeeklySeries(mistakes);

    return {
      topics,
      mistakes,
      weakTopics,
      recentActivity,
      weeklySeries,
      stats: {
        topicsTracked: topics.length,
        totalAttempts,
        masteryRate,
        mistakesLogged: totalMistakes,
      },
    };
  }, [query.data]);

  return {
    ...query,
    ...derived,
  };
}


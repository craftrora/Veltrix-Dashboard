/**
 * Lightweight rule-based insight generator.
 * Computes simple statistics from the dashboard's existing datasets and turns
 * them into short, readable analytical sentences — no external AI call,
 * just deterministic comparisons (deltas, trends, outliers) over real data
 * already in the app, so insights always match what's on screen.
 */

/**
 * @param {{ month: string, tonnes: number, target: number }[]} monthlyTrend
 * @param {{ zone: string, tonnes: number, share: number, trend: "up"|"down", deltaPct: number }[]} byZone
 * @param {{ day: string, actual: number, target: number }[]} weekData
 */
export function generateProductionInsights(monthlyTrend, byZone, weekData) {
  const insights = [];

  // 1. Month-over-month trend
  const last = monthlyTrend.at(-1);
  const prev = monthlyTrend.at(-2);
  if (last && prev) {
    const deltaPct = (((last.tonnes - prev.tonnes) / prev.tonnes) * 100).toFixed(1);
    const direction = last.tonnes >= prev.tonnes ? "up" : "down";
    insights.push({
      type: direction === "up" ? "positive" : "negative",
      text: `Production is ${direction} ${Math.abs(deltaPct)}% in ${last.month} compared to ${prev.month}, reaching ${(last.tonnes / 1000).toFixed(0)}K tonnes${last.tonnes >= last.target ? ", clearing the monthly target" : ", still short of the monthly target"}.`,
    });
  }

  // 2. Best and worst performing zone
  const topZone = [...byZone].sort((a, b) => b.share - a.share)[0];
  const laggingZone = [...byZone].filter((z) => z.trend === "down").sort((a, b) => a.deltaPct - b.deltaPct)[0];
  if (topZone) {
    insights.push({
      type: "positive",
      text: `${topZone.zone} is the top contributor at ${topZone.share}% of today's tonnage, led by unit ${topZone.topPerformer}.`,
    });
  }
  if (laggingZone) {
    insights.push({
      type: "negative",
      text: `${laggingZone.zone} is trending down ${Math.abs(laggingZone.deltaPct)}% — ${laggingZone.note.toLowerCase()}`,
    });
  }

  // 3. Week consistency / volatility
  const actuals = weekData.map((d) => d.actual);
  const avg = actuals.reduce((s, v) => s + v, 0) / actuals.length;
  const variance = actuals.reduce((s, v) => s + (v - avg) ** 2, 0) / actuals.length;
  const stdDev = Math.sqrt(variance);
  const volatilityPct = ((stdDev / avg) * 100).toFixed(1);
  const daysAboveTarget = weekData.filter((d) => d.actual >= d.target).length;
  insights.push({
    type: daysAboveTarget >= weekData.length / 2 ? "positive" : "neutral",
    text: `${daysAboveTarget} of ${weekData.length} days this week met or exceeded target. Daily output varies by about ${volatilityPct}% from the weekly average — ${Number(volatilityPct) > 10 ? "consider reviewing what's driving the swings" : "a fairly consistent pace"}.`,
  });

  return insights;
}

/**
 * @param {{ overall: number, deltaPts: number, breakdown: { label: string, value: number }[] }} performanceScore
 */
export function generatePerformanceInsight(performanceScore) {
  const sorted = [...performanceScore.breakdown].sort((a, b) => b.value - a.value);
  const strongest = sorted[0];
  const weakest = sorted.at(-1);
  const direction = performanceScore.deltaPts >= 0 ? "improved" : "dropped";

  return {
    type: performanceScore.deltaPts >= 0 ? "positive" : "negative",
    text: `Your score ${direction} ${Math.abs(performanceScore.deltaPts)} points since last shift. ${strongest.label} is your strongest area at ${strongest.value}, while ${weakest.label.toLowerCase()} (${weakest.value}) has the most room to grow.`,
  };
}

/**
 * @param {{ id: string, health: number, risk: "low"|"medium"|"high" }[]} machineHealth
 */
export function generateFleetHealthInsight(machineHealth) {
  const critical = machineHealth.filter((m) => m.risk === "high");
  const watch = machineHealth.filter((m) => m.risk === "medium");
  const avgHealth = (machineHealth.reduce((s, m) => s + m.health, 0) / machineHealth.length).toFixed(0);

  if (critical.length > 0) {
    return {
      type: "negative",
      text: `${critical.length} unit${critical.length > 1 ? "s" : ""} (${critical.map((m) => m.id).join(", ")}) ${critical.length > 1 ? "are" : "is"} in critical condition — fleet average health is ${avgHealth}/100, pulled down significantly by ${critical.length > 1 ? "these units" : "this unit"}.`,
    };
  }
  if (watch.length > 0) {
    return {
      type: "neutral",
      text: `Fleet average health is ${avgHealth}/100. ${watch.length} unit${watch.length > 1 ? "s" : ""} (${watch.map((m) => m.id).join(", ")}) ${watch.length > 1 ? "need" : "needs"} monitoring but no critical issues right now.`,
    };
  }
  return {
    type: "positive",
    text: `Fleet average health is ${avgHealth}/100 — every unit is in low-risk condition with no immediate concerns.`,
  };
}

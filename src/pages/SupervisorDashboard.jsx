import { Boxes, Gauge, Truck, Fuel } from "lucide-react";
import DashboardShell from "../components/DashboardShell";
import KpiCard from "../components/KpiCard";
import MineMap from "../components/MineMap";
import FleetBalancer from "../components/FleetBalancer";
import ProductionTrend from "../components/ProductionTrend";
import ProductionLossAnalyzer from "../components/ProductionLossAnalyzer";
import MachineHealthIndex from "../components/MachineHealthIndex";
import AiRecommendationPanel from "../components/AiRecommendationPanel";
import InsightPanel from "../components/InsightPanel";
import { generateFleetHealthInsight, generateProductionInsights } from "../lib/insightEngine";
import {
  KPI_SUMMARY,
  MACHINE_HEALTH,
  PRODUCTION_MONTHLY_TREND,
  PRODUCTION_BY_ZONE,
  TARGET_VS_ACTUAL_WEEK,
} from "../data/supervisorData";

export default function SupervisorDashboard() {
  const productionInsights = generateProductionInsights(PRODUCTION_MONTHLY_TREND, PRODUCTION_BY_ZONE, TARGET_VS_ACTUAL_WEEK);
  const fleetInsight = generateFleetHealthInsight(MACHINE_HEALTH);
  const overviewInsights = [fleetInsight, ...productionInsights.slice(0, 2)];
  return (
    <DashboardShell title="Supervisor Overview">
      {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Production Today"
              value={KPI_SUMMARY.productionToday.value}
              unit={KPI_SUMMARY.productionToday.unit}
              deltaPct={KPI_SUMMARY.productionToday.deltaPct}
              trend={KPI_SUMMARY.productionToday.trend}
              icon={<Boxes className="h-4 w-4" />}
              accent="orange"
              delay={0}
            />
            <KpiCard
              label="PEI Score"
              value={KPI_SUMMARY.peiScore.value}
              unit={KPI_SUMMARY.peiScore.unit}
              deltaPct={KPI_SUMMARY.peiScore.deltaPct}
              trend={KPI_SUMMARY.peiScore.trend}
              icon={<Gauge className="h-4 w-4" />}
              accent="violet"
              decimals={1}
              delay={80}
            />
            <KpiCard
              label="Fleet Utilization"
              value={KPI_SUMMARY.fleetUtilization.value}
              unit={KPI_SUMMARY.fleetUtilization.unit}
              deltaPct={KPI_SUMMARY.fleetUtilization.deltaPct}
              trend={KPI_SUMMARY.fleetUtilization.trend}
              icon={<Truck className="h-4 w-4" />}
              positiveIsGood
              accent="sky"
              delay={160}
            />
            <KpiCard
              label="Fuel Efficiency"
              value={KPI_SUMMARY.fuelEfficiency.value}
              unit={KPI_SUMMARY.fuelEfficiency.unit}
              deltaPct={KPI_SUMMARY.fuelEfficiency.deltaPct}
              trend={KPI_SUMMARY.fuelEfficiency.trend}
              icon={<Fuel className="h-4 w-4" />}
              positiveIsGood={false}
              accent="emerald"
              decimals={2}
              delay={240}
            />
          </div>

          {/* Mine map + Fleet balancer */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animate-fade-up" style={{ animationDelay: "320ms" }}>
            <div className="xl:col-span-2">
              <MineMap />
            </div>
            <FleetBalancer />
          </div>

          {/* Production trend + loss analyzer */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up" style={{ animationDelay: "380ms" }}>
            <ProductionTrend />
            <ProductionLossAnalyzer />
          </div>

          {/* Machine health + AI recommendations */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 animate-fade-up" style={{ animationDelay: "440ms" }}>
            <div className="xl:col-span-2">
              <MachineHealthIndex />
            </div>
            <AiRecommendationPanel />
          </div>

          {/* Auto-generated executive summary */}
          <InsightPanel title="Executive Summary — Auto-Generated" insights={overviewInsights} delay={500} />
    </DashboardShell>
  );
}

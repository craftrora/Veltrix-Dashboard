import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import FleetPage from "./pages/FleetPage";
import ProductionPage from "./pages/ProductionPage";
import MaintenancePage from "./pages/MaintenancePage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import OperatorMissionPage from "./pages/OperatorMissionPage";
import OperatorRoutePage from "./pages/OperatorRoutePage";
import OperatorPerformancePage from "./pages/OperatorPerformancePage";
import OperatorCoachingPage from "./pages/OperatorCoachingPage";
import OperatorSafetyPage from "./pages/OperatorSafetyPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />
      <Route path="/dashboard/supervisor" element={<SupervisorDashboard />} />
      <Route path="/dashboard/supervisor/fleet" element={<FleetPage />} />
      <Route path="/dashboard/supervisor/production" element={<ProductionPage />} />
      <Route path="/dashboard/supervisor/maintenance" element={<MaintenancePage />} />
      <Route path="/dashboard/supervisor/reports" element={<ReportsPage />} />
      <Route path="/dashboard/supervisor/settings" element={<SettingsPage />} />
      <Route path="/dashboard/operator" element={<OperatorMissionPage />} />
      <Route path="/dashboard/operator/route" element={<OperatorRoutePage />} />
      <Route path="/dashboard/operator/performance" element={<OperatorPerformancePage />} />
      <Route path="/dashboard/operator/coaching" element={<OperatorCoachingPage />} />
      <Route path="/dashboard/operator/safety" element={<OperatorSafetyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

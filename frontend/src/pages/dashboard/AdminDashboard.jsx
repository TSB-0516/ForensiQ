import { useEffect, useState } from "react";
import { dashboardApi } from "../../api/dashboardApi";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dashboardApi
      .getAdminStats()
      .then(({ data }) => setStats(data))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p className="text-body-sm text-on-surface-variant">Loading dashboard...</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4">
          <p className="text-label-md text-on-surface-variant uppercase mb-2">Total Users</p>
          <p className="text-headline-lg">{stats?.totalUsers ?? "—"}</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-lg p-4">
          <p className="text-label-md text-on-surface-variant uppercase mb-2">Total Evidence</p>
          <p className="text-headline-lg">{stats?.totalEvidenceCount ?? "—"}</p>
        </div>
      </div>

      <p className="text-body-sm text-on-surface-variant">
        Full stat cards, recent activity feed, and quick actions are coming in the next pass.
      </p>
    </div>
  );
}
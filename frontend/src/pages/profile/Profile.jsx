import { useAuth } from "../../context/AuthContext";
import RoleBadge from "../../components/common/RoleBadge";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-md bg-surface-container border border-outline-variant rounded-lg p-6">
      <h2 className="text-headline-sm mb-4">Profile</h2>
      <div className="flex flex-col gap-3 text-body-sm">
        <div>
          <p className="text-label-sm text-on-surface-variant">Full name</p>
          <p>{user?.fullName}</p>
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant">Email</p>
          <p>{user?.email}</p>
        </div>
        <div>
          <p className="text-label-sm text-on-surface-variant mb-1">Role</p>
          <RoleBadge role={user?.role} />
        </div>
      </div>
    </div>
  );
}
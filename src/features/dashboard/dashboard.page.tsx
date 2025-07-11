import { UserInfo } from "./user-info";
import { UserAchievement } from "./user-achievement";
import { useAuthStore } from "@/shared/store/auth";

const Dashboard: React.FC = () => {
  const uid = useAuthStore((state) => state.user?.uid);

  return (
    <div>
      <UserInfo key={uid} userId={uid} />
      <UserAchievement />
      {/* Other dashboard components can be added here */}
    </div>
  );
};

export const Component = Dashboard;

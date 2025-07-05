import { UserInfo } from "./user-info";
import { useAuthStore } from "@/shared/store/auth";

const Dashboard: React.FC = () => {
  const uid = useAuthStore((state) => state.user?.uid);

  return (
    <div>
      <UserInfo key={uid} userId={uid} />
    </div>
  );
};

export const Component = Dashboard;

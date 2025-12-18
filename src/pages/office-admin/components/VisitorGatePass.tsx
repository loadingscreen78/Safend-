
import { useAppData } from "@/contexts/AppDataContext";
import { VisitorManagement } from "./visitors/VisitorManagement";

export function VisitorGatePass() {
  const { isLoading } = useAppData();
  
  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-safend-red border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return <VisitorManagement />;
}

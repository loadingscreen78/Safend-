
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  borderColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  description,
  borderColor,
  textColor,
  icon
}: StatCardProps) {
  return (
    <Card className={`p-6 hover:shadow-lg transition-shadow border-t-4 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-600 dark:text-gray-300">{title}</h4>
          <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
    </Card>
  );
}

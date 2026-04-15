import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

const UsageCard = () => {
  // Placeholder usage data — will be wired to backend later
  const used = 12;
  const total = 50;
  const percent = Math.round((used / total) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          Usage This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold">{used}</span>
            <span className="text-sm text-muted-foreground">of {total} replies</span>
          </div>
          <Progress value={percent} className="h-2" />
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-medium">{total - used} replies</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Resets</span>
          <span className="font-medium">May 1, 2026</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageCard;

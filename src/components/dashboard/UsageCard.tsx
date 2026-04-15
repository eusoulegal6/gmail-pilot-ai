import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const UsageCard = () => {
  // Usage tracking not yet wired — show empty state
  const isLoading = false;
  const hasData = false;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 size={18} className="text-primary" />
          Usage This Month
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-2 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : !hasData ? (
          <div className="py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Usage tracking will appear here once you start using the extension.
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Replies sent</span>
                <span className="font-medium">—</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Quota</span>
                <span className="font-medium">—</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold">0</span>
                <span className="text-sm text-muted-foreground">of — replies</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UsageCard;

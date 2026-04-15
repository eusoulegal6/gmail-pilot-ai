import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Mail, Shield } from "lucide-react";

const AccountStatusCard = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          Account Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Email</span>
          <span className="text-sm font-medium truncate max-w-[200px]">{user?.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant="outline" className="border-accent text-accent gap-1">
            <CheckCircle size={12} />
            Active
          </Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Plan</span>
          <span className="text-sm font-medium">Free Tier</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Member since</span>
          <span className="text-sm font-medium">
            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountStatusCard;

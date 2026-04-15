import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function useExtensionDownload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download the extension.",
      });
      navigate("/auth");
      return;
    }

    const { data, error } = await supabase.storage
      .from("extension-downloads")
      .download("ChromeExtensionAgent 2.rar");

    if (error || !data) {
      toast({
        title: "Download failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = "SendSmart-Extension.rar";
    a.click();
    URL.revokeObjectURL(url);
  };

  return { handleDownload };
}

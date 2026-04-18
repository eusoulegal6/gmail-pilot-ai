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

    // List whatever is in the bucket and grab the first file (most recent).
    const { data: files, error: listError } = await supabase.storage
      .from("extension-downloads")
      .list("", { limit: 100, sortBy: { column: "updated_at", order: "desc" } });

    if (listError || !files || files.length === 0) {
      toast({
        title: "Download failed",
        description: "No extension package found. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    const file = files.find((f) => f.name && !f.name.endsWith("/"));
    if (!file) {
      toast({
        title: "Download failed",
        description: "No extension package found.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase.storage
      .from("extension-downloads")
      .download(file.name);

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
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { handleDownload };
}

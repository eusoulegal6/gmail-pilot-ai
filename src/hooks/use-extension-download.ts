import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { EXTENSION_DOWNLOAD_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

export function useExtensionDownload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to download the extension.",
      });
      navigate("/auth");
      return;
    }
    window.open(EXTENSION_DOWNLOAD_URL, "_blank");
  };

  return { handleDownload };
}

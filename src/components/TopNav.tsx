import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/extension", label: "Extension" },
];

const TopNav = () => {
  const { pathname } = useLocation();
  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center gap-6 px-6">
        <span className="font-semibold text-foreground">Send Smart</span>
        <div className="flex items-center gap-1">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default TopNav;

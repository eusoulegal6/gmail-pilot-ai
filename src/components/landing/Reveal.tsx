import { ReactNode } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}

const Reveal = ({ children, className, delay = 0, as: Tag = "div" }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", inView && "in-view", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;

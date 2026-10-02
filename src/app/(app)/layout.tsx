import { DemoProvider } from "@/components/providers/demo-provider";
import { TooltipLayer } from "@/components/providers/tooltip-layer";
import { Shell } from "@/components/shell/shell";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <DemoProvider>
      <Shell>{children}</Shell>
      <TooltipLayer />
    </DemoProvider>
  );
}

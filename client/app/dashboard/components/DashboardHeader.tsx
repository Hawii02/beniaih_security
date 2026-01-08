import { Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  // const { theme, setTheme } = useTheme();
  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-slate-300 h-12 ease-linear">
      <div className="flex w-full items-center px-4 md:px-8 lg:px-12">
        <SidebarTrigger />
        {/* <h1 className="mx-auto font-bold text-2xl text-red-500">
          Admin Dashboard
        </h1> */}
      </div>
    </header>
  );
}

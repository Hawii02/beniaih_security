import { Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  // const { theme, setTheme } = useTheme();
  return (
    <header className="flex shrink-0 items-center gap-2 border-b border-slate-300 h-12 ease-linear">
      <div className="flex w-full items-center px-4 md:px-8 lg:px-12">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-2 h-8 ml-auto" />
        {/* <button
          className="ml-auto p-2 rounded"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme == "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button> */}
      </div>
    </header>
  );
}

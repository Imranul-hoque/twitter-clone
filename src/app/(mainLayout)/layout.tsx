import { ReactNode } from "react";
import { LeftSidebar } from "@/components/layout/left-sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { TweetComposerModal } from "@/components/tweet/tweet-composer-modal";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
   <div className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-325">
        {/* Left Sidebar - Hidden on mobile */}
        <aside className="sticky top-0 hidden h-screen w-68.75 shrink-0 md:flex lg:w-68.75 xl:w-68.75">
          <LeftSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-border overflow-x-hidden">
          {children}
        </main>

        {/* Right Sidebar - Hidden on tablet and mobile */}
        <aside className="sticky top-0 hidden h-screen w-87.5 shrink-0 lg:block xl:w-87.5">
          <RightSidebar />
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Tweet Composer Modal */}
      <TweetComposerModal />
    </div>
  );
};

export default MainLayout;

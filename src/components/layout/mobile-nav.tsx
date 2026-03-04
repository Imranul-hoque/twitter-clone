"use client";

import { motion } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { usePathname, useRouter } from "next/navigation";
import { mobileNavItems } from "@/constants";

export const MobileNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { unreadNotifications } = useAppStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-background/95 backdrop-blur lg:hidden">
      {mobileNavItems.map((item) => {
        const isActive = pathname === item.path;
        const Icon = item.icon;
        const showBadge =
          item.path === "/notifications" && unreadNotifications > 0;

        return (
          <motion.button
            key={item.path}
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push(item.path)}
            className="relative flex h-full flex-1 items-center justify-center"
          >
            <div className="relative">
              <Icon
                className={`h-6 w-6 ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {showBadge && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadNotifications}
                </span>
              )}
            </div>
          </motion.button>
        );
      })}
    </nav>
  );
};

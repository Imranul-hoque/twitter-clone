"use client";

import { MoreHorizontal, Settings, HelpCircle, LogOut, User } from "lucide-react";
import { motion } from "motion/react";
import { useAppStore } from "@/hooks/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TwitterLogo } from "@/components/icons/twitter-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "@/constants";
import MobileTweetButton from "../icons/mobile-tweet-button";

export const LeftSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentUser, setComposerOpen, unreadNotifications } = useAppStore();
  
  const isLoggedIn = false;

  return (
    <div className="flex h-full w-full flex-col justify-between px-2 py-2">
      <div className="flex flex-col">
        {/* Logo */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => router.push("/")}
          className="mb-2 ml-2.5 flex size-13 items-center justify-center rounded-full transition-colors hover:bg-secondary"
        >
          <TwitterLogo className="h-8 w-8 text-foreground" />
        </motion.button>

        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            const showBadge =
              item.label === "Notifications" && unreadNotifications > 0;

            if (item.label === "More") {
              return (
                <DropdownMenu key={item.label}>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="nav-item relative"
                    >
                      <Icon className="size-6.5" strokeWidth={2} />
                      <span className="hidden md:inline">{item.label}</span>
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    align="start"
                    className="w-56"
                  >
                    <DropdownMenuItem onClick={() => router.push("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings and privacy
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/help")}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help Center
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => toast("Logged out (simulated)")}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            return (
              <motion.button
                key={item.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => item.path !== "#" && router.push(item.path)}
                className={`nav-item relative ${isActive ? "active font-bold" : ""}`}
              >
                <div className="relative">
                  <Icon className="size-6.5" strokeWidth={isActive ? 2.5 : 2} />
                  {showBadge && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {unreadNotifications}
                    </span>
                  )}
                </div>
                <span className="hidden md:inline">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        {/* Tweet Button */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setComposerOpen(true)}
          className="tweet-button mt-4 hidden md:block"
        >
          Post
        </motion.button>

        {/* Mobile Tweet Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setComposerOpen(true)}
          className="tweet-button mt-4 flex size-13 items-center justify-center p-0! md:hidden"
        >
          <MobileTweetButton />
        </motion.button>
      </div>


      {/* User Profile Mini Card or Sign In Button */}
      {isLoggedIn ? (
        <motion.button
          whileHover={{ backgroundColor: "hsl(var(--secondary))" }}
          className="flex items-center gap-3 rounded-full p-3 transition-colors"
          onClick={() => router.push("/profile")}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="hidden flex-1 text-left md:block">
            <p className="text-sm font-bold leading-tight">
              {currentUser.name}
            </p>
            <p className="text-sm text-muted-foreground">
              @{currentUser.username}
            </p>
          </div>
          <MoreHorizontal className="hidden h-5 w-5 text-muted-foreground md:block" />
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => router.push("/auth")}
          className="tweet-auth-btn"
        >
          <span className="hidden md:inline">Sign in</span>
          <User className="h-6 w-6 md:hidden" />
        </motion.button>
      )}
    </div>
  );
};

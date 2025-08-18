import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface NavItemProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function NavItem({ to, children, className }: NavItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink to={to} className={cn("relative block px-3 py-2", className)}>
      {children}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="navbar-indicator"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </NavLink>
  );
}
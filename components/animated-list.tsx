"use client";

import { motion } from "motion/react";

interface AnimatedListItemProps {
  children: React.ReactNode;
  index?: number;
}

export function AnimatedListItem({
  children,
  index = 0,
}: AnimatedListItemProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}

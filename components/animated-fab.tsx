"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function AnimatedFab(): React.ReactElement {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
      className="fixed bottom-20 right-4 z-30 lg:hidden"
    >
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Link
          href="/log"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500 text-2xl font-bold text-zinc-950 shadow-lg shadow-cyan-500/20"
          aria-label="Log expense"
        >
          +
        </Link>
      </motion.div>
    </motion.div>
  );
}

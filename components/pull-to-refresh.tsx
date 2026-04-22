"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

interface PullToRefreshProps {
  children: React.ReactNode;
}

const THRESHOLD = 80;

export function PullToRefresh({
  children,
}: PullToRefreshProps): React.ReactElement {
  const router = useRouter();
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (refreshing) return;
      if (window.scrollY === 0) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    },
    [refreshing],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!pulling.current || refreshing) return;
      const distance = Math.max(
        0,
        (e.touches[0].clientY - startY.current) * 0.5,
      );
      setPullDistance(Math.min(distance, THRESHOLD * 1.5));
    },
    [refreshing],
  );

  const onTouchEnd = useCallback(() => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD * 0.5);
      router.refresh();
      // Give the server time to revalidate
      setTimeout(() => {
        setRefreshing(false);
        setPullDistance(0);
      }, 800);
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, router]);

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="lg:hidden"
    >
      {/* Pull indicator */}
      {(pullDistance > 0 || refreshing) && (
        <div className="flex justify-center pb-2">
          <motion.div
            animate={{ rotate: refreshing ? 360 : progress * 180 }}
            transition={
              refreshing
                ? { repeat: Infinity, duration: 0.6, ease: "linear" }
                : { duration: 0 }
            }
            className="text-sm text-cyan-400"
          >
            ↻
          </motion.div>
        </div>
      )}
      <motion.div
        animate={{ y: pullDistance > 0 ? pullDistance * 0.3 : 0 }}
        transition={{ type: "tween", duration: pullDistance > 0 ? 0 : 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

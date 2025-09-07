"use client";

import { motion } from "framer-motion";
import React from "react";

export function WobbleText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={className}
      initial={{ rotate: 0 }}
      animate={{ rotate: [-1, 1.3, 0] }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 5,
      }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

const variants = {
  fadeIn: {
    y: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  inactive: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
  fadeOut: {
    opacity: 0,
    y: -100,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

/*
 * Read the blog post here:
 * https://letsbuildui.dev/articles/animated-page-transitions-in-nextjs
 */
const TransitionEffect2 = ({ children }: PropsWithChildren) => {
  const { asPath } = useRouter();

  return (
    <div className="effect-1">
      <AnimatePresence initial={false} exitBeforeEnter>
        <motion.div
        // key={asPath}
        // variants={variants}
        // initial="fadeIn"
        // animate="inactive"
        // exit="fadeOut"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransitionEffect2;

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { easeOut } from '../motion/variants.js';

function FadeInPage({ children }) {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const firstPaint = useRef(true);

  useEffect(() => {
    firstPaint.current = false;
  }, []);

  return (
    <motion.div
      key={pathname}
      initial={reduceMotion || firstPaint.current ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

export default FadeInPage;

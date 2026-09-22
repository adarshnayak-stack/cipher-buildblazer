import React from 'react';
import { motion } from 'framer-motion';
import TopographicBackground from './TopographicBackground';
import ReticleCursor from './ReticleCursor';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

export default function PageShell({ children }) {
  return (
    <div className="app-shell">
      <TopographicBackground />
      <ReticleCursor />
      <PublicHeader />
      <main className="inner-page">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, ease: [0.16, 1, .3, 1] }}>
          {children}
        </motion.div>
      </main>
      <PublicFooter />
    </div>
  );
}

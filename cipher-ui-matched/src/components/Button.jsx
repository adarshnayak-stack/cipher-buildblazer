// src/components/Button.jsx
import React from 'react';
export default function Button({ children, onClick, variant = 'primary', className = '' }) {
  const base = "font-mono text-xs tracking-widest px-7 py-3 transition cursor-pointer font-black ";
  const styles = variant === 'primary' ? "bg-[#00ff41] text-black hover:bg-white shadow-[0_0_25px_#00ff41] " : "border border-[#00ff41] text-[#00ff41] hover:border-[#39ff14] hover:shadow-[0_0_20px_#00ff41] ";
  return <button onClick={onClick} className={base + styles + className}>{children}</button>;
}
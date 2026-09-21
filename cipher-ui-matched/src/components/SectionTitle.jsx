// src/components/SectionTitle.jsx
import React from 'react';
export default function SectionTitle({ category, title }) {
  return (
    <div className="mb-12">
      <div className="font-mono text-xs text-[#00ff41]/70 mb-2">// {category}</div>
      <h2 className="text-3xl md:text-4xl font-bold text-[#dcfce7] drop-shadow-[0_0_12px_rgba(0,255,65,0.7)]">{title}</h2>
    </div>
  );
}
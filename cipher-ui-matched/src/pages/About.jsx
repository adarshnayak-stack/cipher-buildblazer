import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Target, Users, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';

const reveal = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } };

export default function About() {
  const { content } = useContent();
  const siteContent = content.site;
  const objectives = siteContent.about.objectives || [];
  const profile = siteContent.about.profile || {};
  const icons = [Cpu, Users, Zap, Target];
  const build = siteContent.about.whatWeBuild || [];
  return (
    <div className="page-content">
      <section className="inner-hero compact section">
        <div className="eyebrow">// ABOUT CIPHER</div>
        <motion.h1 variants={reveal} initial="hidden" animate="show" transition={{ duration: .7 }}>{siteContent.about.heading || 'More than a student association.'}</motion.h1>
        <motion.p variants={reveal} initial="hidden" animate="show" transition={{ duration: .7, delay: .1 }}>
          {siteContent.about.intro || 'CIPHER is the Computer Science & Engineering student association at St. Joseph Engineering College, Mangaluru — built around learning, collaboration, technical exploration and student-led initiatives.'}
        </motion.p>
      </section>

      <section className="detail-section section two-column-detail">
        <motion.div whileInView={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: -35 }} viewport={{ once: true }} transition={{ duration: .65 }}>
          <div className="eyebrow">// WHO WE ARE</div>
          <h2>{siteContent.about.title || 'Who We Are'}</h2>
          <p>{siteContent.about.description}</p>
          <Link className="btn outline" to="/team">MEET LEADERSHIP <ArrowRight size={15} /></Link>
        </motion.div>
        <motion.div className="about-terminal-card" whileInView={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: .94 }} viewport={{ once: true }} transition={{ duration: .65 }}>
          <div className="terminal-bar"><span> CIPHER // PROFILE</span><span>ONLINE</span></div>
          <div className="terminal-lines">
            <p>&gt; identity: {profile.identity}</p>
            <p>&gt; focus: {profile.focus}</p>
            <p>&gt; environment: {profile.environment}</p>
            <p>&gt; status: {profile.status}</p>
          </div>
        </motion.div>
      </section>

      <section className="detail-section section">
        <div className="eyebrow">// MISSION / VISION</div>
        <div className="detail-card-grid two">
          <motion.article className="detail-card" whileHover={{ y: -7 }}><Target size={22} /><h3>Our Mission</h3><p>{siteContent.about.mission}</p></motion.article>
          <motion.article className="detail-card" whileHover={{ y: -7 }}><Zap size={22} /><h3>Our Vision</h3><p>{siteContent.about.vision}</p></motion.article>
        </div>
      </section>

      <section className="detail-section section">
        <div className="eyebrow">// WHAT WE BUILD</div>
        <div className="detail-card-grid four">
          {build.map((title, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.article key={`${title}-${i}`} className="detail-card compact" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} whileHover={{ y: -7 }}>
                <Icon size={20} /><h3>{title}</h3><span>{String(i + 1).padStart(2, '0')} // CIPHER</span>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="detail-section section">
        <div className="eyebrow">// OBJECTIVES</div>
        <div className="objective-list">
          {objectives.map((item, i) => (
            <motion.div key={i} className="objective-row" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * .05 }}>
              <span>// {String(i + 1).padStart(2, '0')}</span><p>{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

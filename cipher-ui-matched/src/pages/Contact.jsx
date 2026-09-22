import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, MapPin } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import JoinForm from '../components/JoinForm';

export default function Contact() {
  const { content } = useContent();
  const siteContent = content.site;
  return (
    <div className="page-content">
      <section className="inner-hero section"><div className="eyebrow">// ACCESS CLUB</div><h1>Join the Team</h1><p>Want to build, lead or learn with CIPHER? Send an access request and start the conversation.</p></section>
      <section className="detail-section section contact-grid">
        <motion.div initial={{ opacity: 0, x: -25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="eyebrow">// COMMUNICATION CHANNELS</div><h2>Open a channel.</h2>
          <div className="contact-lines"><p><Mail size={17} /> {siteContent.contact.email}</p><p><MapPin size={17} /> {siteContent.contact.college}</p><p><span className="contact-marker">//</span> {siteContent.contact.department}</p></div>
        </motion.div>
        <motion.div className="contact-form-card" initial={{ opacity: 0, x: 25 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <JoinForm />
        </motion.div>
      </section>
    </div>
  );
}

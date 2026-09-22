import React from 'react';
import defaultLogo from '../assets/cipher-logo.png';
import { useContent } from '../context/ContentContext';

// Shows the logo chosen in Admin → Site Content, or the bundled default.
export default function BrandLogo({ alt = 'CIPHER logo' }) {
  const { content } = useContent();
  return <img src={content.site?.logo || defaultLogo} alt={alt} />;
}

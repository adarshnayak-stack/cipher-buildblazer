import React, { useRef, useState } from 'react';
import { uploadMedia } from '../data/api';

// Resize + compress so images fit in browser storage.
export function fileToDataUrl(file, maxSize = 1400, quality = 0.84, keepAlpha = false) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Please choose an image file.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      if (file.type === 'image/svg+xml') return resolve(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error('Unsupported image.'));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(keepAlpha ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/* Single image (value = string) or multiple images (multiple, value = string[]). */
export default function ImageUploader({ value, onChange, multiple = false, round = false, label = 'Image', keepAlpha = false }) {
  const inputRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const images = multiple ? (value || []) : (value ? [value] : []);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) return;
    setError(''); setBusy(true);
    try {
      const chosen = multiple ? files : files.slice(0, 1);
      const uploaded = await Promise.all(chosen.map(f => uploadMedia(f, 'image')));
      const urls = uploaded.map(x => x.url);
      onChange(multiple ? [...images, ...urls] : urls[0]);
    } catch (e) { setError(e.message || 'Could not upload image.'); }
    setBusy(false);
  };

  const pick = () => inputRef.current?.click();
  const onDrop = (e) => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files); };
  const removeAt = (i) => onChange(multiple ? images.filter((_, idx) => idx !== i) : '');

  const zone = (
    <div
      className={`img-drop ${drag ? 'drag' : ''} ${round ? 'round' : ''}`}
      role="button" tabIndex={0}
      onClick={pick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pick()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
    >
      <b>{busy ? 'PROCESSING…' : drag ? 'DROP TO UPLOAD' : multiple ? '+ ADD IMAGES' : 'CLICK OR DRAG IMAGE HERE'}</b>
      <small>PNG / JPG / WEBP</small>
    </div>
  );

  return (
    <div className="img-uploader">
      <span className="img-label">{label}</span>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} hidden
        onChange={(e) => { handleFiles(e.target.files); e.target.value = ''; }} />
      {!multiple && images[0] ? (
        <div className={`img-preview ${round ? 'round' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
          <img src={images[0]} alt="Preview" />
          {drag && <div className="img-overlay">DROP TO REPLACE</div>}
          <div className="img-actions">
            <button type="button" onClick={pick}>CHANGE IMAGE</button>
            <button type="button" className="danger" onClick={() => removeAt(0)}>REMOVE</button>
          </div>
        </div>
      ) : multiple ? (
        <div className="img-multi">
          {images.map((src, i) => (
            <div className="img-thumb" key={i}>
              <img src={src} alt={`Gallery ${i + 1}`} />
              <button type="button" onClick={() => removeAt(i)} aria-label="Remove image">×</button>
            </div>
          ))}
          {zone}
        </div>
      ) : zone}
      {error && <div className="img-error">{error}</div>}
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import './PropertyGallery.css';

export default function PropertyGallery({ fotos, titulo }) {
  const [indice, setIndice] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = () => setIndice(i => (i - 1 + fotos.length) % fotos.length);
  const next = () => setIndice(i => (i + 1) % fotos.length);

  return (
    <>
      <div className="gallery">
        {/* Main Image */}
        <div className="gallery__main">
          <AnimatePresence mode="wait">
            <motion.img
              key={indice}
              src={`${fotos[indice]}&auto=format&q=85&w=1200`}
              alt={`${titulo} - foto ${indice + 1}`}
              className="gallery__main-img"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>

          {fotos.length > 1 && (
            <>
              <button className="gallery__nav gallery__nav--prev" onClick={prev} aria-label="Foto anterior">
                <ChevronLeft size={20} />
              </button>
              <button className="gallery__nav gallery__nav--next" onClick={next} aria-label="Foto seguinte">
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <button className="gallery__zoom" onClick={() => setLightbox(true)} aria-label="Ver em tamanho real">
            <ZoomIn size={16} />
            <span>Ver fotos</span>
          </button>

          <div className="gallery__counter">{indice + 1} / {fotos.length}</div>
        </div>

        {/* Thumbnails */}
        {fotos.length > 1 && (
          <div className="gallery__thumbs">
            {fotos.map((foto, i) => (
              <button
                key={i}
                className={`gallery__thumb ${i === indice ? 'gallery__thumb--active' : ''}`}
                onClick={() => setIndice(i)}
                aria-label={`Foto ${i + 1}`}
              >
                <img src={`${foto}&auto=format&q=60&w=200`} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="gallery__lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <button className="gallery__lightbox-close" onClick={() => setLightbox(false)}>
              <X size={24} />
            </button>
            <motion.img
              src={`${fotos[indice]}&auto=format&q=90&w=1600`}
              alt={titulo}
              className="gallery__lightbox-img"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={e => e.stopPropagation()}
            />
            {fotos.length > 1 && (
              <>
                <button className="gallery__nav gallery__nav--prev gallery__nav--lightbox" onClick={e => { e.stopPropagation(); prev(); }}>
                  <ChevronLeft size={24} />
                </button>
                <button className="gallery__nav gallery__nav--next gallery__nav--lightbox" onClick={e => { e.stopPropagation(); next(); }}>
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

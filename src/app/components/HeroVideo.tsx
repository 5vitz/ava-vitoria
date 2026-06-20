'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './HeroVideo.module.css';

interface HeroVideoProps {
  videoSrc: string;
  posterSrc?: string;
  freezeSrc?: string; // Imagem estática para congelamento perfeito no final
  sealSrc?: string;
  interruptDelta?: number; // Tempo em segundos antes do fim para congelar a animação (ajuste experimental)
}

export default function HeroVideo({
  videoSrc,
  posterSrc,
  freezeSrc,
  sealSrc,
  interruptDelta = 0.5,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Garante que o volume inicial do player bate com o estado
    video.volume = volume;
    video.muted = isMuted;

    const handleTimeUpdate = () => {
      const duration = video.duration;
      if (duration && !isNaN(duration)) {
        const stopTime = duration - interruptDelta;
        
        if (video.currentTime >= stopTime) {
          video.pause();
          setIsFrozen(true);
        }
      }
    };

    // Reinicia o estado se o vídeo for recarregado
    const handleLoadedMetadata = () => {
      setIsFrozen(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [interruptDelta]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const nextVolume = parseFloat(e.target.value);
    video.volume = nextVolume;
    setVolume(nextVolume);
    if (nextVolume > 0) {
      video.muted = false;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted={isMuted}
        autoPlay
        playsInline
        className={styles.heroVideo}
        style={{ 
          opacity: isFrozen ? 0 : 0.95,
          transition: 'opacity 0.15s ease-in-out' // Transição suave de fade-out do vídeo
        }}
      />

      {freezeSrc && (
        <Image
          src={freezeSrc}
          alt="AVA Vitória Skateboarder Frame Final"
          fill
          priority
          sizes="100vw"
          className={`${styles.freezeOverlay} ${isFrozen ? styles.freezeOverlayActive : ''}`}
        />
      )}
      
      {/* Controles de Áudio (Mute & Volume Slider) */}
      {!isFrozen && (
        <div className={styles.audioControls}>
          <button onClick={toggleMute} className={styles.muteButton} title={isMuted ? "Ativar som" : "Desativar som"}>
            {isMuted ? (
              <svg viewBox="0 0 24 24" className={styles.audioIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={styles.audioIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )}
          </button>
          <div className={styles.volumeSliderContainer}>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className={styles.volumeSlider}
            />
          </div>
        </div>
      )}

      {sealSrc && (
        <div className={styles.heroSeal}>
          <Image
            src={sealSrc}
            alt="Selo AVA Sem Limites"
            width={160}
            height={160}
            className={styles.sealImage}
            priority
          />
        </div>
      )}
    </section>
  );
}

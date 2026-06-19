'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import styles from './HeroVideo.module.css';

interface HeroVideoProps {
  videoSrc: string;
  posterSrc?: string;
  sealSrc?: string;
  interruptDelta?: number; // Tempo em segundos antes do fim para congelar a animação (ajuste experimental)
}

export default function HeroVideo({
  videoSrc,
  posterSrc,
  sealSrc,
  interruptDelta = 0.5,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hasInterrupted = false;

    const handleTimeUpdate = () => {
      if (hasInterrupted) return;

      const duration = video.duration;
      if (duration && !isNaN(duration)) {
        const stopTime = duration - interruptDelta;
        
        if (video.currentTime >= stopTime) {
          hasInterrupted = true;
          video.pause();
          video.currentTime = stopTime; // Força o frame de congelamento exato
        }
      }
    };

    // Reinicia a flag se a fonte do vídeo mudar ou se o usuário reiniciar
    const handleLoadedMetadata = () => {
      hasInterrupted = false;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [interruptDelta]);

  return (
    <section className={styles.hero}>
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        muted
        autoPlay
        playsInline
        className={styles.heroVideo}
      />
      
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

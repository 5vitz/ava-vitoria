'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './HeroVideo.module.css';

interface HeroVideoProps {
  videoSrc: string;
  posterSrc?: string;
  sealSrc?: string;
}

export default function HeroVideo({
  videoSrc,
  posterSrc,
  sealSrc,
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Inicializado como mutado para permitir autoplay garantido
  const [volume, setVolume] = useState(0.2); // Volume alvo final (20%)
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Referência para limpar o intervalo de fade-in caso o componente seja desmontado
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoPaused = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configura o estado inicial do som e do tempo no elemento de vídeo físico
    video.muted = true;
    video.volume = 0;
    video.currentTime = 0;

    // Autoplay garantido por estar mutado (Chrome, Firefox, Safari, etc.)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.log("Autoplay blocked by browser policy:", error);
          setIsPlaying(false);
        });
    }

    // Monitora quando o vídeo chegar ao fim
    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleEnterStore = () => {
    setIsFading(true);
    const video = videoRef.current;
    if (video) {
      // Reinicia o vídeo para o início ao entrar na loja
      video.currentTime = 0;
      // Garante que o vídeo está rodando e desmuta
      video.play().catch((err) => console.log("Play failed on enter:", err));
      video.muted = false;
      setIsMuted(false);

      // Fade-in gradual do áudio (de 0% até 20%)
      let currentVol = 0;
      const targetVol = 0.2; // 20%
      video.volume = currentVol;

      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        currentVol += 0.02; // Aumenta 2% a cada 50ms
        if (currentVol >= targetVol) {
          video.volume = targetVol;
          setVolume(targetVol);
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        } else {
          video.volume = currentVol;
          setVolume(currentVol);
        }
      }, 50); // Fade-in total de ~500ms
    }

    // Aguarda o término da animação de desvanecimento (fade-out) no CSS para remover o overlay
    setTimeout(() => {
      setShowSplash(false);
    }, 800);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      // Se o vídeo foi congelado próximo ao fim, reinicia do início ao dar play
      const pauseOffset = 1.0;
      if (hasAutoPaused.current || (video.duration && video.currentTime >= video.duration - pauseOffset)) {
        video.currentTime = 0;
        hasAutoPaused.current = false;
      }
      video.play().catch((err) => console.log("Play failed:", err));
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  };

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
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const pauseOffset = 1.0; // Pausa 1 segundo antes do fim do vídeo (ajustável experimentalmente)
    if (video.duration && video.currentTime >= video.duration - pauseOffset) {
      if (!hasAutoPaused.current) {
        video.pause();
        setIsPlaying(false);
        hasAutoPaused.current = true;
      }
    } else if (video.duration && video.currentTime < video.duration - pauseOffset - 0.5) {
      hasAutoPaused.current = false;
    }
  };

  return (
    <section className={styles.hero}>
      {showSplash && (
        <div className={`${styles.splashOverlay} ${isFading ? styles.fadeOut : ''}`}>
          <button onClick={handleEnterStore} className={styles.splashButton} aria-label="Entrar na loja">
            <Image
              src="/imagens/LOGO/SELO_AVA_ENTRE.jpg"
              alt="Selo AVA Vitória - Entre na Loja"
              width={280}
              height={280}
              className={styles.splashLogo}
              priority
            />
          </button>
        </div>
      )}

      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className={styles.heroVideo}
      />

      {/* Painel de Controles do Player com Estética da Subtração */}
      <div className={styles.controlsBar}>
        {/* Play / Pause */}
        <button 
          onClick={togglePlay} 
          className={styles.controlButton} 
          title={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" className={styles.controlIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.controlIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>

        {/* Stop */}
        <button 
          onClick={handleStop} 
          className={styles.controlButton} 
          title="Parar"
        >
          <svg viewBox="0 0 24 24" className={styles.controlIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16"></rect>
          </svg>
        </button>

        {/* Linha Divisória */}
        <div className={styles.separator}></div>

        {/* Mute / Unmute */}
        <button 
          onClick={toggleMute} 
          className={styles.controlButton} 
          title={isMuted ? "Ativar som" : "Desativar som"}
        >
          {isMuted ? (
            <svg viewBox="0 0 24 24" className={styles.controlIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.controlIcon} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>

        {/* Volume Slider */}
        <div className={styles.volumeContainer}>
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

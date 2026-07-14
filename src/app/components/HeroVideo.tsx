'use client';

import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HeroVideo.module.css';
import { useAudio } from '@/lib/audioContext';

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
  
  // Consome a API de áudio global
  const {
    isPlaying: isGlobalPlaying,
    isMuted: isGlobalMuted,
    volume: globalVolume,
    hasEnteredStore,
    setHasEnteredStore,
    playAudio,
    pauseAudio,
    stopAudio,
    setAudioVolume,
    setAudioMuted
  } = useAudio();

  const [isPlaying, setIsPlaying] = useState(false); // Reprodução local do vídeo
  const [isMuted, setIsMuted] = useState(true); // Mudo local do vídeo
  const [volume, setVolume] = useState(0.2); // Volume local do vídeo
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  const initialHasEntered = useRef(hasEnteredStore);
  const isUnmounted = useRef(false);

  // Referência para limpar o intervalo de fade-in caso o componente seja desmontado
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Referências para gerenciar o crossfade da trilha sonora global
  const musicFadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMusicFadingRef = useRef(false);

  // Mapeamento dinâmico do estado ativo dependendo do vídeo estar rolando ou já ter acabado
  const activePlaying = isTransitionActive ? isGlobalPlaying : isPlaying;
  const activeMuted = isTransitionActive ? isGlobalMuted : isMuted;
  const activeVolume = isTransitionActive ? globalVolume : volume;

  useEffect(() => {
    setMounted(true);
    if (initialHasEntered.current) {
      setShowSplash(false);
      setIsTransitionActive(true);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (initialHasEntered.current) {
      // Se já entrou na loja anteriormente, não queremos rodar o vídeo principal de novo, apenas mostramos a capa
      setIsPlaying(false);
      setIsTransitionActive(true);
      return;
    }

    // Configura o estado inicial do som e do tempo no elemento de vídeo físico, mantendo-o pausado até o clique em ENTRAR
    video.muted = true;
    video.volume = 0;
    video.currentTime = 0;

    // Monitora quando o vídeo chegar ao fim
    const handleEnded = () => {
      setIsPlaying(false);
      setIsTransitionActive(true);
      
      const currentVideo = videoRef.current;

      // Limpa qualquer intervalo pendente de fade
      if (musicFadeIntervalRef.current) {
        clearInterval(musicFadeIntervalRef.current);
        musicFadeIntervalRef.current = null;
      }
      isMusicFadingRef.current = false;
      
      // Sincroniza o volume do som global com o volume original configurado no slider (volume)
      setAudioVolume(volume);
      if (currentVideo) {
        setAudioMuted(currentVideo.muted);
      }
      playAudio();
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      isUnmounted.current = true;
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (musicFadeIntervalRef.current) clearInterval(musicFadeIntervalRef.current);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleEnterStore = () => {
    setIsFading(true);
    setHasEnteredStore(true); // Persiste o estado de entrada globalmente
    const video = videoRef.current;
    if (video) {
      // Reinicia o vídeo para o início ao entrar na loja
      video.currentTime = 0;
      setIsTransitionActive(false);
      
      // Para e reseta a trilha sonora global
      stopAudio();

      // Garante que o vídeo está rodando e desmuta
      video.play().catch((err) => console.log("Play failed on enter:", err));
      video.muted = false;
      setIsMuted(false);
      setAudioMuted(false); // Sincroniza áudio global

      // Fade-in gradual do áudio local (de 0% até 20%)
      let currentVol = 0;
      const targetVol = 0.2; // 20%
      video.volume = currentVol;

      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

      fadeIntervalRef.current = setInterval(() => {
        currentVol += 0.02; // Aumenta 2% a cada 50ms
        if (currentVol >= targetVol) {
          video.volume = targetVol;
          setVolume(targetVol);
          setAudioVolume(targetVol); // Sincroniza áudio global
          if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
            fadeIntervalRef.current = null;
          }
        } else {
          video.volume = currentVol;
          setVolume(currentVol);
          setAudioVolume(currentVol); // Sincroniza áudio global
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

    if (isTransitionActive) {
      // Controla a reprodução do áudio de fundo global
      if (isGlobalPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    } else {
      // Controla a reprodução do vídeo
      if (video.paused) {
        // Se o vídeo terminou ou está perto do fim, reinicia do início ao dar play
        if (video.duration && video.currentTime >= video.duration - 0.5) {
          video.currentTime = 0;
        }
        video.play().catch((err) => console.log("Play failed:", err));
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleStop = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
    stopAudio(); // Para e reseta a música global
    setIsPlaying(false);
    setIsTransitionActive(false);

    // Limpa o intervalo de fade-in da música se rodando
    if (musicFadeIntervalRef.current) {
      clearInterval(musicFadeIntervalRef.current);
      musicFadeIntervalRef.current = null;
    }
    isMusicFadingRef.current = false;
  };

  const toggleMute = () => {
    const video = videoRef.current;
    const nextMuted = !activeMuted;
    if (video) {
      video.muted = nextMuted;
    }
    setAudioMuted(nextMuted); // Sincroniza global
    setIsMuted(nextMuted); // Sincroniza local
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    const nextVolume = parseFloat(e.target.value);
    const nextMuted = nextVolume === 0;

    if (video) {
      video.volume = nextVolume;
      video.muted = nextMuted;
    }
    setAudioVolume(nextVolume); // Sincroniza global
    setAudioMuted(nextMuted); // Sincroniza global
    setVolume(nextVolume); // Sincroniza local
    setIsMuted(nextMuted); // Sincroniza local
  };

  const handleTimeUpdate = () => {
    if (isUnmounted.current) return;
    const video = videoRef.current;
    if (!video) return;

    const duration = video.duration;
    if (!duration) return;

    // Se o usuário voltar no tempo (seek/rewind) e a música global estiver tocando, paramos ela
    if (video.currentTime < duration - 1.5 && isGlobalPlaying) {
      stopAudio();
    }

    // Gatilho: Inicia a transição de fade visual 3 segundos antes do final do vídeo
    // para encobrir o frame da logo e do player nativo embutidos
    const fadeTriggerOffset = 3.0; 
    if (video.currentTime >= duration - fadeTriggerOffset) {
      if (!isTransitionActive) {
        setIsTransitionActive(true);
      }
    } else {
      if (isTransitionActive) {
        setIsTransitionActive(false);
      }
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

      {/* Menu Flutuante de Navegação (Estilo Streetwear) */}
      <nav className={`${styles.floatingMenu} ${isTransitionActive ? styles.menuVisible : ''}`}>
        <button
          onClick={() => document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' })}
          className={styles.menuLink}
        >
          Loja
        </button>
        <Link
          href="/sobre-nos"
          className={styles.menuLink}
        >
          Sobre Nós
        </Link>
        <Link
          href="/contato"
          className={styles.menuLink}
        >
          Contato
        </Link>
      </nav>

      {/* Imagem de Capa Estática (revelada quando o vídeo esmaece) */}
      <div className={`${styles.coverImageContainer} ${isTransitionActive ? styles.coverVisible : ''}`}>
        <Image
          src="/imagens/CAPA/CAPA_NANO6SemMenu.png"
          alt="AVA Sem Limites Capa"
          fill
          sizes="100vw"
          className={styles.coverImage}
          priority
        />
      </div>

      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className={`${styles.heroVideo} ${isTransitionActive ? styles.fadeActive : ''}`}
      />

      {/* Painel de Controles do Player com Estética da Subtração (Sempre Visível) */}
      <div className={`${styles.controlsBar} ${!isTransitionActive ? styles.controlsPlaying : ''}`}>

        {/* Play / Pause */}
        <button 
          onClick={togglePlay} 
          className={styles.controlButton} 
          title={activePlaying ? "Pausar" : "Reproduzir"}
        >
          {activePlaying ? (
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
          title={activeMuted ? "Ativar som" : "Desativar som"}
        >
          {activeMuted ? (
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
            value={activeMuted ? 0 : activeVolume}
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

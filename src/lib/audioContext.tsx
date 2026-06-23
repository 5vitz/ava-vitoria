'use client';

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

interface AudioContextType {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  hasEnteredStore: boolean;
  setHasEnteredStore: (entered: boolean) => void;
  playAudio: () => void;
  pauseAudio: () => void;
  stopAudio: () => void;
  setAudioVolume: (vol: number) => void;
  setAudioMuted: (muted: boolean) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.2);
  const [hasEnteredStore, setHasEnteredStore] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    console.log("AudioProvider: Mounting...");
    // Executa apenas no navegador (lado do cliente)
    const audio = new Audio('/trilhas/FuncaoMaster_1405.mp3');
    audio.preload = 'auto';
    audio.loop = true;
    audio.volume = volume;
    audio.muted = isMuted;
    
    const handlePlay = () => {
      console.log("AudioProvider: play event triggered");
      setIsPlaying(true);
    };
    const handlePause = () => {
      console.log("AudioProvider: pause event triggered");
      setIsPlaying(false);
    };
    
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    audioRef.current = audio;

    return () => {
      console.log("AudioProvider: Unmounting...");
      audio.pause();
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Global audio play failed:", err));
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const setAudioVolume = (vol: number) => {
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const setAudioMuted = (muted: boolean) => {
    setIsMuted(muted);
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      isMuted,
      volume,
      hasEnteredStore,
      setHasEnteredStore,
      playAudio,
      pauseAudio,
      stopAudio,
      setAudioVolume,
      setAudioMuted
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}

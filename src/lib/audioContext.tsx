'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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

// Objeto de áudio persistente global (singleton fora do React para persistir entre navegações)
let globalAudio: HTMLAudioElement | null = null;
let globalIsPlaying = false;
let globalIsMuted = true;
let globalVolume = 0.2;
let globalHasEnteredStore = false;

// Callbacks para sincronizar os múltiplos AudioProvider se remountarem
const listeners = new Set<() => void>();
const notifyListeners = () => {
  listeners.forEach((l) => l());
};

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(globalIsPlaying);
  const [isMuted, setIsMuted] = useState(globalIsMuted);
  const [volume, setVolume] = useState(globalVolume);
  const [hasEnteredStore, setHasEnteredStore] = useState(globalHasEnteredStore);

  useEffect(() => {
    // Inicializa o áudio global no client-side uma única vez
    if (typeof window !== 'undefined' && !globalAudio) {
      globalAudio = new Audio('/trilhas/FuncaoMaster_1405.mp3');
      globalAudio.preload = 'auto';
      globalAudio.loop = true;
      globalAudio.volume = globalVolume;
      globalAudio.muted = globalIsMuted;
    }

    const syncState = () => {
      setIsPlaying(globalIsPlaying);
      setIsMuted(globalIsMuted);
      setVolume(globalVolume);
      setHasEnteredStore(globalHasEnteredStore);
      if (globalAudio) {
        globalAudio.volume = globalVolume;
        globalAudio.muted = globalIsMuted;
      }
    };

    listeners.add(syncState);

    const handlePlay = () => {
      globalIsPlaying = true;
      notifyListeners();
    };
    const handlePause = () => {
      globalIsPlaying = false;
      notifyListeners();
    };

    if (globalAudio) {
      globalAudio.addEventListener('play', handlePlay);
      globalAudio.addEventListener('pause', handlePause);
    }

    // Sincroniza o estado atual ao montar
    syncState();

    return () => {
      listeners.delete(syncState);
      if (globalAudio) {
        globalAudio.removeEventListener('play', handlePlay);
        globalAudio.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  const playAudio = () => {
    if (globalAudio) {
      globalAudio.play()
        .then(() => {
          globalIsPlaying = true;
          notifyListeners();
        })
        .catch((err) => console.log("Global audio play failed:", err));
    }
  };

  const pauseAudio = () => {
    if (globalAudio) {
      globalAudio.pause();
      globalIsPlaying = false;
      notifyListeners();
    }
  };

  const stopAudio = () => {
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalIsPlaying = false;
      notifyListeners();
    }
  };

  const setAudioVolume = (vol: number) => {
    globalVolume = vol;
    if (globalAudio) {
      globalAudio.volume = vol;
    }
    notifyListeners();
  };

  const setAudioMuted = (muted: boolean) => {
    globalIsMuted = muted;
    if (globalAudio) {
      globalAudio.muted = muted;
    }
    notifyListeners();
  };

  const updateHasEnteredStore = (entered: boolean) => {
    globalHasEnteredStore = entered;
    notifyListeners();
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      isMuted,
      volume,
      hasEnteredStore,
      setHasEnteredStore: updateHasEnteredStore,
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

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
  BellSoundId,
  BgSoundId,
  ClickSoundId,
  soundEngine
} from '../lib/soundEngine';

interface AudioContextValue {
  clickSound: ClickSoundId;
  setClickSound: (id: ClickSoundId) => void;
  sfxVolume: number;
  setSfxVolume: (v: number) => void;
  bgSound: BgSoundId;
  setBgSound: (id: BgSoundId) => void;
  bgVolume: number;
  setBgVolume: (v: number) => void;
  isBgPlaying: boolean;
  toggleBgPlaying: () => void;
  bellSound: BellSoundId;
  setBellSound: (id: BellSoundId) => void;
  playClick: (overrideId?: ClickSoundId) => void;
  playBell: (overrideId?: BellSoundId) => void;
}

const STORAGE_KEY = 'synapse_audio_prefs_v1';

const AudioCtx = createContext<AudioContextValue | null>(null);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clickSound, setClickSoundState] = useState<ClickSoundId>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).clickSound || 'water_drop';
    } catch {}
    return 'water_drop';
  });

  const [sfxVolume, setSfxVolumeState] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && typeof JSON.parse(raw).sfxVolume === 'number') return JSON.parse(raw).sfxVolume;
    } catch {}
    return 0.55;
  });

  const [bgSound, setBgSoundState] = useState<BgSoundId>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).bgSound || 'off';
    } catch {}
    return 'off';
  });

  const [bgVolume, setBgVolumeState] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw && typeof JSON.parse(raw).bgVolume === 'number') return JSON.parse(raw).bgVolume;
    } catch {}
    return 0.35;
  });

  const [bellSound, setBellSoundState] = useState<BellSoundId>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw).bellSound || 'tibetan_bowl';
    } catch {}
    return 'tibetan_bowl';
  });

  // Never auto-blast music on cold load until user toggles or picks a track in session
  const [isBgPlaying, setIsBgPlaying] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ clickSound, sfxVolume, bgSound, bgVolume, bellSound })
      );
    } catch {}
  }, [clickSound, sfxVolume, bgSound, bgVolume, bellSound]);

  useEffect(() => {
    if (isBgPlaying && bgSound !== 'off') {
      soundEngine.startAmbient(bgSound, bgVolume);
    } else {
      soundEngine.stopAmbient();
    }
    return () => {
      soundEngine.stopAmbient();
    };
  }, [isBgPlaying, bgSound]);

  useEffect(() => {
    if (isBgPlaying) {
      soundEngine.setAmbientVolume(bgVolume);
    }
  }, [bgVolume, isBgPlaying]);

  const setClickSound = useCallback(
    (id: ClickSoundId) => {
      setClickSoundState(id);
      if (id !== 'off') {
        soundEngine.playClick(id, sfxVolume);
      }
    },
    [sfxVolume]
  );

  const setSfxVolume = useCallback((v: number) => {
    setSfxVolumeState(Math.min(1, Math.max(0, v)));
  }, []);

  const setBgSound = useCallback((id: BgSoundId) => {
    setBgSoundState(id);
    if (id === 'off') {
      setIsBgPlaying(false);
    } else {
      setIsBgPlaying(true);
    }
  }, []);

  const setBgVolume = useCallback((v: number) => {
    setBgVolumeState(Math.min(1, Math.max(0, v)));
  }, []);

  const toggleBgPlaying = useCallback(() => {
    if (bgSound === 'off') {
      setBgSoundState('minecraft_calm');
      setIsBgPlaying(true);
    } else {
      setIsBgPlaying((prev) => !prev);
    }
  }, [bgSound]);

  const setBellSound = useCallback(
    (id: BellSoundId) => {
      setBellSoundState(id);
      if (id !== 'off') {
        soundEngine.playAlarmBell(id, Math.max(0.5, sfxVolume));
      }
    },
    [sfxVolume]
  );

  const playClick = useCallback(
    (overrideId?: ClickSoundId) => {
      soundEngine.playClick(overrideId ?? clickSound, sfxVolume);
    },
    [clickSound, sfxVolume]
  );

  const playBell = useCallback(
    (overrideId?: BellSoundId) => {
      soundEngine.playAlarmBell(overrideId ?? bellSound, Math.max(0.55, sfxVolume));
    },
    [bellSound, sfxVolume]
  );

  return (
    <AudioCtx.Provider
      value={{
        clickSound,
        setClickSound,
        sfxVolume,
        setSfxVolume,
        bgSound,
        setBgSound,
        bgVolume,
        setBgVolume,
        isBgPlaying,
        toggleBgPlaying,
        bellSound,
        setBellSound,
        playClick,
        playBell
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
};

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx);
  if (!ctx) {
    throw new Error('useAudio must be used inside AudioProvider');
  }
  return ctx;
}

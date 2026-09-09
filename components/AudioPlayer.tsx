'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, AlertCircle } from 'lucide-react';

interface AudioPlayerProps {
  title: string;
  subtitle: string;
  text: string;
  isControlled: boolean;
  audioDataUri?: string;
  latencyMs?: number;
  error?: string;
  isAvailable: boolean;
}

export function AudioPlayer({
  title,
  subtitle,
  text,
  isControlled,
  audioDataUri,
  latencyMs,
  error,
  isAvailable,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioDataUri]);

  const togglePlay = () => {
    if (!audioRef.current || !audioDataUri) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('[Audio Playback Error]:', err));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatTime = (sec: number) => {
    if (isNaN(sec) || sec === 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={`rounded-2xl border p-6 transition-all ${
        isControlled
          ? 'border-indigo-200 bg-white shadow-md'
          : 'border-slate-200 bg-white shadow-sm'
      }`}
    >
      {/* Hidden audio element */}
      {audioDataUri && (
        <audio
          ref={audioRef}
          src={audioDataUri}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isControlled ? 'text-indigo-600' : 'text-slate-500'
            }`}
          >
            {title}
          </span>
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        </div>

        {/* Real measured latency badge */}
        {latencyMs !== undefined && latencyMs > 0 && (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-600">
            Rime · {latencyMs} ms
          </span>
        )}
      </div>

      {/* Spoken Text Preview */}
      <div className="my-5 min-h-[48px] rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-700">
        "{text}"
      </div>

      {/* Audio Controls */}
      {isAvailable && audioDataUri ? (
        <div className="space-y-3 pt-2">
          {/* Timeline track */}
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={duration || 1}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Large obvious Play button */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={togglePlay}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-all active:scale-95 ${
                isControlled
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5 fill-current" />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
          <AlertCircle className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{error || 'Audio synthesis unavailable.'}</span>
        </div>
      )}
    </div>
  );
}

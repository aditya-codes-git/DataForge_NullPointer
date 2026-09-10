'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, RotateCcw, AlertCircle } from 'lucide-react';

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

function AudioPlayerComponent({
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
      // Optimistic immediate visual state change
      setIsPlaying(true);
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('[Audio Playback Error]:', err);
          setIsPlaying(false);
        });
      }
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

  const handleDownload = () => {
    if (!audioDataUri) return;
    try {
      if (audioDataUri.startsWith('data:')) {
        const parts = audioDataUri.split(',');
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const prefix = isControlled ? 'saysure-controlled' : 'saysure-raw';
        a.download = `${prefix}-${Date.now()}.mp3`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }

      const a = document.createElement('a');
      a.href = audioDataUri;
      const prefix = isControlled ? 'saysure-controlled' : 'saysure-raw';
      a.download = `${prefix}-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error('[Download Error]:', err);
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
          preload="auto"
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
        &ldquo;{text}&rdquo;
      </div>

      {/* Audio Controls */}
      {isAvailable && audioDataUri ? (
        <div className="space-y-4 pt-2">
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

          {/* Action Buttons: Play and Download */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={togglePlay}
              className={`flex h-11 items-center gap-2 rounded-xl px-5 font-semibold text-xs transition-all active:scale-95 ${
                isControlled
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700'
                  : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
              }`}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 ml-0.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95"
              title={`Download ${isControlled ? 'Controlled' : 'RAW'} Audio`}
            >
              <Download className="h-4 w-4 text-slate-500" />
              <span>Download</span>
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

export const AudioPlayer = React.memo(AudioPlayerComponent);

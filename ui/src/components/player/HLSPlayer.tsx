import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Hls from "hls.js";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize,
  Minimize,
  SkipForward,
  Loader2,
  Gauge,
} from "lucide-react";

interface HLSPlayerProps {
  src: string;
  title?: string;
  skip?: string;
  onEnded?: () => void;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 3.5, 4];

export function HLSPlayer({ src, title, skip, onEnded }: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSkipBtn, setShowSkipBtn] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  // Shortcut feedback (YouTube uslubi)
  const [hint, setHint] = useState<string | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const skipRange = useMemo<[number, number] | null>(() => {
    if (!skip) return null;
    const [start, end] = skip.split("-").map(Number);
    return !isNaN(start) && !isNaN(end) ? [start, end] : null;
  }, [skip]);

  // Hint ko'rsatish
  const showHint = useCallback((text: string) => {
    setHint(text);
    clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHint(null), 800);
  }, []);

  // HLS init
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setLoading(false);
      });
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.addEventListener("loadedmetadata", () => setLoading(false));
    }
  }, [src]);

  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      if (skipRange) {
        const [s, e] = skipRange;
        setShowSkipBtn(video.currentTime >= s && video.currentTime < e);
      }
    };
    const onDuration = () => setDuration(video.duration);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => {
      setLoading(false);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onEnded_ = () => {
      setPlaying(false);
      onEnded?.();
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded_);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded_);
    };
  }, [skipRange, onEnded]);

  // Fullscreen change listener
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // ─── Keyboard shortcuts ───────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handler = (e: KeyboardEvent) => {
      // Input field da ishlayotganda ignore
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          if (video.paused) {
            void video.play();
            showHint("▶");
          } else {
            video.pause();
            showHint("⏸");
          }
          break;

        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
          showHint("▶▶ +5s");
          break;

        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 5, 0);
          showHint("◀◀ -5s");
          break;

        case "ArrowUp":
          e.preventDefault();
          {
            const v = Math.min(video.volume + 0.1, 1);
            video.volume = v;
            setVolume(v);
            setMuted(false);
            showHint(`🔊 ${Math.round(v * 100)}%`);
          }
          break;

        case "ArrowDown":
          e.preventDefault();
          {
            const v = Math.max(video.volume - 0.1, 0);
            video.volume = v;
            setVolume(v);
            if (v === 0) setMuted(true);
            showHint(`🔉 ${Math.round(v * 100)}%`);
          }
          break;

        case "m":
          e.preventDefault();
          video.muted = !video.muted;
          setMuted(video.muted);
          showHint(video.muted ? "🔇 Mute" : "🔊 Unmute");
          break;

        case "f":
          e.preventDefault();
          if (!document.fullscreenElement) {
            void containerRef.current?.requestFullscreen();
          } else {
            void document.exitFullscreen();
          }
          break;

        case ">":
          e.preventDefault();
          {
            const idx = SPEEDS.indexOf(video.playbackRate);
            const next = SPEEDS[Math.min(idx + 1, SPEEDS.length - 1)];
            video.playbackRate = next;
            setSpeed(next);
            showHint(`${next}x`);
          }
          break;

        case "<":
          e.preventDefault();
          {
            const idx = SPEEDS.indexOf(video.playbackRate);
            const prev = SPEEDS[Math.max(idx - 1, 0)];
            video.playbackRate = prev;
            setSpeed(prev);
            showHint(`${prev}x`);
          }
          break;

        // 0-9 → seek %
        default:
          if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            const pct = parseInt(e.key) * 10;
            video.currentTime = (video.duration * pct) / 100;
            showHint(`${pct}%`);
          }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showHint]);

  // Controls auto-hide
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused) setShowControls(false);
    }, 3000);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(hintTimer.current);
    },
    [],
  );

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    video.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      void containerRef.current?.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  };

  const handleSpeed = (s: number) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
    setShowSpeedMenu(false);
    showHint(`${s}x`);
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60)
      .toString()
      .padStart(2, "0")}`;
  };

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => !videoRef.current?.paused && setShowControls(false)}
      onTouchStart={resetHideTimer}
      onClick={togglePlay}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <Loader2 className="size-10 text-white animate-spin" />
        </div>
      )}

      {/* Center hint (YouTube uslubi) */}
      {hint && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="px-5 py-3 rounded-xl bg-black/60 text-white text-xl font-semibold backdrop-blur-sm animate-in fade-in zoom-in-95 duration-100">
            {hint}
          </div>
        </div>
      )}

      {/* Big play button */}
      {!playing && !loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Play className="size-7 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Skip intro */}
      {showSkipBtn && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (videoRef.current && skipRange)
              videoRef.current.currentTime = skipRange[1];
          }}
          className="absolute bottom-20 right-4 flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-white/10 border border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all"
        >
          <SkipForward className="size-4" />
          O'tkazib yuborish
        </button>
      )}

      {/* Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute inset-x-0 bottom-0 px-4 pb-4 pt-16 transition-opacity duration-300",
          "bg-linear-to-t from-black/90 via-black/40 to-transparent",
          showControls ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        {title && (
          <p className="text-white/80 text-sm mb-3 line-clamp-1">{title}</p>
        )}

        {/* Progress */}
        <div
          onClick={handleSeek}
          className="relative w-full h-1 bg-white/20 rounded-full cursor-pointer mb-4 group/bar hover:h-2 transition-all duration-150"
        >
          <div
            className="h-full bg-brand rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white hover:text-white/70 transition-colors"
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2 group/vol">
            <button
              onClick={toggleMute}
              className="text-white hover:text-white/70 transition-colors"
            >
              <VolumeIcon className="size-5" />
            </button>
            <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-200">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-20 accent-white cursor-pointer"
              />
            </div>
          </div>

          {/* Time */}
          <span className="text-white/60 text-xs tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Speed */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu((p) => !p)}
              className="flex items-center gap-1.5 text-white hover:text-white/70 transition-colors text-xs font-medium px-2 py-1 rounded-md hover:bg-white/10"
            >
              <Gauge className="size-4" />
              {speed === 1 ? "Tezlik" : `${speed}x`}
            </button>

            {showSpeedMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-black/90 border border-white/10 rounded-lg overflow-hidden backdrop-blur-sm">
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeed(s)}
                    className={cn(
                      "flex items-center justify-between gap-4 w-full px-4 py-2 text-sm hover:bg-white/10 transition-colors",
                      speed === s
                        ? "text-primary font-medium"
                        : "text-white/80",
                    )}
                  >
                    <span>{s === 1 ? "Oddiy" : `${s}x`}</span>
                    {speed === s && <span className="text-primary">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="text-white hover:text-white/70 transition-colors"
          >
            {fullscreen ? (
              <Minimize className="size-5" />
            ) : (
              <Maximize className="size-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

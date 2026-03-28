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
  Settings,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { API_URL } from "@/config/env";

interface HLSPlayerProps {
  src: string;
  title?: string;
  skip?: string;
  onEnded?: () => void;
}

const SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SEEK_SEC = 10;
const BUFFER_MIN = 1.5; // 90 sekund

export function HLSPlayer({ src, skip, onEnded }: HLSPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hintTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tapTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tapCount = useRef(0);
  const tapSide = useRef<"left" | "right" | "center">("center");

  const [playing, setPlaying] = useState(false);
  const loadingInit = Boolean(src);
  const errorInit = false;

  const [loading, setLoading] = useState(loadingInit);
  const [error, setError] = useState(errorInit);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSkipBtn, setShowSkipBtn] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [hint, setHint] = useState<{
    text: string;
    side: "left" | "right" | "center";
  } | null>(null);

  const skipRange = useMemo<[number, number] | null>(() => {
    if (!skip) return null;
    const [s, e] = skip.split("-").map(Number);
    return !isNaN(s) && !isNaN(e) ? [s, e] : null;
  }, [skip]);

  const showHint = useCallback(
    (text: string, side: "left" | "right" | "center" = "center") => {
      setHint({ text, side });
      clearTimeout(hintTimer.current);
      hintTimer.current = setTimeout(() => setHint(null), 600);
    },
    [],
  );

  const hideControls = useCallback(() => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!videoRef.current?.paused && !showSettings) {
        setShowControls(false);
      }
    }, 3000);
  }, [showSettings]);

  const revealControls = useCallback(() => {
    setShowControls(true);
    hideControls();
  }, [hideControls]);

  // HLS init
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        maxBufferLength: BUFFER_MIN * 60,
        maxMaxBufferLength: BUFFER_MIN * 60 * 2,
        maxBufferSize: 60 * 1000 * 1000,
        manifestLoadingTimeOut: 20000,
        manifestLoadingMaxRetry: 3,
        levelLoadingTimeOut: 20000,
        fragLoadingTimeOut: 30000,
        fragLoadingMaxRetry: 6,
      });

      hls.loadSource(API_URL + src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setLoading(false);
          setError(true);
        }
      });

      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;

      const onLoaded = () => setLoading(false);
      const onError = () => {
        setLoading(false);
        setError(true);
      };

      video.addEventListener("loadedmetadata", onLoaded);
      video.addEventListener("error", onError);

      return () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };
    }
  }, [src]);

  // Video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      const ct = video.currentTime;
      const dur = video.duration;
      setCurrentTime(ct);
      setProgress(dur ? (ct / dur) * 100 : 0);

      // Buffered
      if (video.buffered.length > 0) {
        const buf = video.buffered.end(video.buffered.length - 1);
        setBuffered(dur ? (buf / dur) * 100 : 0);
      }

      if (skipRange) {
        const [s, e] = skipRange;
        setShowSkipBtn(ct >= s && ct < e);
      }
    };
    const onDuration = () => setDuration(video.duration);
    const onWaiting = () => setLoading(true);
    const onCanPlay = () => setLoading(false);
    const onPlaying = () => {
      setLoading(false);
      setPlaying(true);
    };
    const onPause = () => setPlaying(false);
    const onEnded_ = () => {
      setPlaying(false);
      onEnded?.();
    };
    const onError = () => {
      setLoading(false);
      setError(true);
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("durationchange", onDuration);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded_);
    video.addEventListener("error", onError);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("durationchange", onDuration);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded_);
      video.removeEventListener("error", onError);
    };
  }, [skipRange, onEnded]);

  // Fullscreen
  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(hideTimer.current);
      clearTimeout(hintTimer.current);
      clearTimeout(tapTimer.current);
    },
    [],
  );

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      showHint("▶", "center");
    } else {
      video.pause();
      showHint("⏸", "center");
    }
    revealControls();
  }, [showHint, revealControls]);

  const handleFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) void el.requestFullscreen();
    else void document.exitFullscreen();
  }, []);

  // Keyboard — faqat player focus bo'lganda
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handler = (e: KeyboardEvent) => {
      if (
        !container.matches(":focus-within") &&
        document.activeElement !== container
      )
        return;
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowRight":
          e.preventDefault();
          video.currentTime = Math.min(video.currentTime + 5, video.duration);
          showHint(`+5s`, "right");
          revealControls();
          break;
        case "ArrowLeft":
          e.preventDefault();
          video.currentTime = Math.max(video.currentTime - 5, 0);
          showHint(`-5s`, "left");
          revealControls();
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
          showHint(video.muted ? "🔇" : "🔊");
          break;
        case "f":
          e.preventDefault();
          handleFullscreen();
          break;
        default:
          if (e.key >= "0" && e.key <= "9") {
            e.preventDefault();
            const pct = parseInt(e.key) * 10;
            video.currentTime = (video.duration * pct) / 100;
            showHint(`${pct}%`);
          }
      }
    };

    container.addEventListener("keydown", handler);
    return () => container.removeEventListener("keydown", handler);
  }, [togglePlay, handleFullscreen, showHint, revealControls]);

  // Tap handler — single tap controls, double tap seek
  const handleTap = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const clientX =
        "touches" in e ? (e.changedTouches[0]?.clientX ?? 0) : e.clientX;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const third = rect.width / 3;

      const side = x < third ? "left" : x > third * 2 ? "right" : "center";
      tapSide.current = side;
      tapCount.current += 1;

      if (tapCount.current === 1) {
        tapTimer.current = setTimeout(() => {
          if (tapCount.current === 1) {
            // 1 tap → play/pause
            togglePlay();

            // controls ham ko‘rsatamiz
            setShowControls((p) => {
              if (!p) {
                hideControls();
                return true;
              }
              return !p;
            });
          }
          tapCount.current = 0;
        }, 250);
      } else if (tapCount.current === 2) {
        clearTimeout(tapTimer.current);
        tapCount.current = 0;
        // Double tap
        const video = videoRef.current;
        if (!video) return;
        if (tapSide.current === "left") {
          video.currentTime = Math.max(video.currentTime - SEEK_SEC, 0);
          showHint(`-${SEEK_SEC}s`, "left");
        } else if (tapSide.current === "right") {
          video.currentTime = Math.min(
            video.currentTime + SEEK_SEC,
            video.duration,
          );
          showHint(`+${SEEK_SEC}s`, "right");
        } else {
          togglePlay();
        }
        revealControls();
      }
    },
    [showHint, togglePlay, hideControls, revealControls],
  );

  const handleSeek = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clientX = "touches" in e ? (e.touches[0]?.clientX ?? 0) : e.clientX;
    const ratio = Math.max(0, Math.min((clientX - rect.left) / rect.width, 1));
    video.currentTime = ratio * duration;
  };

  const handleSpeed = (s: number) => {
    if (videoRef.current) videoRef.current.playbackRate = s;
    setSpeed(s);
    setShowSettings(false);
    showHint(`${s}x`);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const VolumeIcon =
    muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  if (error) {
    return (
      <div className="w-full aspect-video bg-muted/40 rounded-xl border border-border/50 flex flex-col items-center justify-center gap-3">
        <div className="size-14 rounded-full bg-muted flex items-center justify-center">
          <Play className="size-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium">Video yuklanmadi</p>
        <p className="text-xs text-muted-foreground">Qayta urinib ko'ring</p>
        <button
          onClick={() => {
            setError(false);
            setLoading(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border text-sm hover:bg-muted/80 transition-colors"
        >
          <RotateCcw className="size-4" />
          Qayta yuklash
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseMove={revealControls}
      onMouseLeave={() => !videoRef.current?.paused && setShowControls(false)}
      onClick={handleTap}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden select-none outline-none focus:outline-none"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
      />

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none">
          <Loader2 className="size-12 text-white animate-spin" />
        </div>
      )}

      {/* Double tap hint — YouTube uslubi */}
      {hint && (
        <div
          className={cn(
            "absolute inset-y-0 flex items-center justify-center pointer-events-none w-1/3",
            hint.side === "left" && "left-0",
            hint.side === "right" && "right-0",
            hint.side === "center" && "left-1/3",
          )}
        >
          <div className="px-4 py-2 rounded-xl bg-black/50 text-white text-lg font-semibold backdrop-blur-sm">
            {hint.side === "left" && (
              <RotateCcw className="size-6 mb-1 mx-auto" />
            )}
            {hint.side === "right" && (
              <RotateCw className="size-6 mb-1 mx-auto" />
            )}
            {hint.text}
          </div>
        </div>
      )}

      {/* Big play */}
      {!playing && !loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="size-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
            <Play className="size-7 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute inset-x-0 bottom-0 px-4 pb-3 pt-20 transition-opacity duration-300",
          "bg-linear-to-t from-black/90 via-black/30 to-transparent",
          showControls || !playing
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
      >
        {/* Skip button — controls ichida, gradient ustida */}
        {showSkipBtn && (
          <div className="flex justify-end mb-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (videoRef.current && skipRange)
                  videoRef.current.currentTime = skipRange[1];
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/15 border border-white/20 text-white backdrop-blur-sm hover:bg-white/25 transition-all"
            >
              <SkipForward className="size-3.5" />
              O'tkazib yuborish
            </button>
          </div>
        )}

        {/* Progress bar */}
        <div
          onClick={handleSeek}
          onTouchMove={handleSeek}
          className="relative w-full h-1 bg-white/25 rounded-full cursor-pointer mb-3 group/bar"
        >
          {/* Buffered */}
          <div
            className="absolute h-full bg-white/30 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Progress */}
          <div
            className="absolute h-full bg-white rounded-full transition-none"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 size-3 bg-white rounded-full scale-0 group-hover/bar:scale-100 transition-transform shadow" />
          </div>
          {/* Hover zone — touch uchun kattaroq */}
          <div className="absolute inset-x-0 -top-3 -bottom-3" />
        </div>

        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="text-white p-1 hover:text-white/80 transition-colors"
          >
            {playing ? (
              <Pause className="size-5 fill-current" />
            ) : (
              <Play className="size-5 fill-current" />
            )}
          </button>

          {/* Seek -/+ mobile */}
          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) {
                v.currentTime = Math.max(v.currentTime - SEEK_SEC, 0);
                showHint(`-${SEEK_SEC}s`, "left");
              }
            }}
            className="text-white p-1 hover:text-white/80 transition-colors md:hidden"
          >
            <RotateCcw className="size-4" />
          </button>
          <button
            onClick={() => {
              const v = videoRef.current;
              if (v) {
                v.currentTime = Math.min(v.currentTime + SEEK_SEC, v.duration);
                showHint(`+${SEEK_SEC}s`, "right");
              }
            }}
            className="text-white p-1 hover:text-white/80 transition-colors md:hidden"
          >
            <RotateCw className="size-4" />
          </button>

          {/* Volume — desktop */}
          <div className="hidden md:flex items-center gap-1.5 group/vol">
            <button
              onClick={() => {
                const video = videoRef.current;
                if (!video) return;

                video.muted = !muted;
                setMuted(!muted);
              }}
              className="text-white p-1 hover:text-white/80 transition-colors"
            >
              <VolumeIcon className="size-5" />
            </button>
            <div className="w-0 overflow-hidden group-hover/vol:w-20 transition-all duration-200 origin-left">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={muted ? 0 : volume}
                onChange={handleVolume}
                className="w-20 accent-white cursor-pointer h-1"
              />
            </div>
          </div>

          {/* Mute mobile */}
          <button
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.muted = !muted;
                setMuted(!muted);
              }
            }}
            className="text-white p-1 hover:text-white/80 transition-colors md:hidden"
          >
            <VolumeIcon className="size-4" />
          </button>

          {/* Time */}
          <span className="text-white/70 text-xs tabular-nums ml-1 flex-1 truncate">
            {formatTime(currentTime)}
            <span className="text-white/40"> / {formatTime(duration)}</span>
          </span>

          {/* Settings (speed) */}
          <div className="relative">
            <button
              onClick={() => setShowSettings((p) => !p)}
              className="text-white p-1 hover:text-white/80 transition-colors"
              title="Sozlamalar"
            >
              <Settings
                className={cn(
                  "size-5 transition-transform duration-300",
                  showSettings && "rotate-45",
                )}
              />
            </button>

            {showSettings && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-full right-0 mb-2 bg-black/95 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md min-w-36 shadow-xl"
              >
                <p className="text-white/40 text-xs px-4 py-2 border-b border-white/10">
                  Tezlik
                </p>
                {SPEEDS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeed(s)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-2 text-sm transition-colors hover:bg-white/10",
                      speed === s ? "text-white font-medium" : "text-white/60",
                    )}
                  >
                    {s === 1 ? "Oddiy" : `${s}x`}
                    {speed === s && (
                      <span className="size-1.5 rounded-full bg-primary inline-block" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Fullscreen */}
          <button
            onClick={handleFullscreen}
            className="text-white p-1 hover:text-white/80 transition-colors"
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

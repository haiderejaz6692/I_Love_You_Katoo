import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FloatingPetals from "@/components/FloatingPetals";
import RoseCursor from "@/components/RoseCursor";
import { VALENTINE_VIDEO_URL } from "@/config/valentine";
import SparkleField from "@/components/SparkleField";

const ValentineYes = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const hasVideo = Boolean(VALENTINE_VIDEO_URL && VALENTINE_VIDEO_URL !== "PASTE_VIDEO_LINK_HERE");
  const isVideoFile = hasVideo && /\.mp4($|\?)/i.test(VALENTINE_VIDEO_URL);
  const videoRef = useRef<HTMLVideoElement>(null);

  const requestVideoFullscreen = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const anyVideo = video as HTMLVideoElement & {
      webkitEnterFullscreen?: () => void;
      webkitRequestFullscreen?: () => Promise<void> | void;
    };
    if (document.fullscreenElement) return;
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => undefined);
    } else if (anyVideo.webkitRequestFullscreen) {
      anyVideo.webkitRequestFullscreen();
    } else if (anyVideo.webkitEnterFullscreen) {
      anyVideo.webkitEnterFullscreen();
    }
  }, []);

  const exitVideoFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => undefined);
      return;
    }
    const anyDocument = document as Document & { webkitExitFullscreen?: () => void };
    if (anyDocument.webkitExitFullscreen) anyDocument.webkitExitFullscreen();
  }, []);

  return (
    <div className="relative min-h-screen bg-background overflow-hidden cursor-none safe-pad">
      <RoseCursor />
      {!prefersReducedMotion && <FloatingPetals count={12} />}
      {!prefersReducedMotion && <SparkleField />}

      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at top, hsl(351, 78%, 96%) 0%, hsl(36, 100%, 97%) 50%, hsl(351, 78%, 92%) 100%)",
        }}
      />

      {!prefersReducedMotion && (
        <>
          <motion.div
            className="absolute top-10 left-10 w-72 h-72 rounded-full bg-rose-soft/30 blur-3xl"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-rose-glow/30 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </>
      )}

      <main className="relative container mx-auto px-4 py-24 flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="glass rounded-[2rem] px-8 py-10 max-w-3xl w-full shadow-rose"
        >
          <div className="text-5xl mb-4">💞</div>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground">
            Yay!! 💞 Of course you said yes, my Katto 😄
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            I knew it. I always know it. You're predictable in the cutest way 😌🐾
          </p>
        </motion.div>

        <div className="w-full max-w-4xl rounded-[2rem] p-[1px] bg-gradient-to-br from-rose-soft/70 via-white/40 to-rose-glow/60 shadow-rose/70">
          <div className="glass rounded-[2rem] overflow-hidden aspect-video">
            <div className="relative h-full w-full bg-black/5">
              {hasVideo ? (
                isVideoFile ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-contain"
                    src={VALENTINE_VIDEO_URL}
                    controls
                    playsInline
                    onPlay={requestVideoFullscreen}
                    onEnded={exitVideoFullscreen}
                  />
                ) : (
                  <iframe
                    title="Valentine video"
                    src={VALENTINE_VIDEO_URL}
                    className="absolute inset-0 h-full w-full"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm md:text-base p-6 text-center">
                  Paste your video link in <span className="font-semibold">src/config/valentine.ts</span> to show the
                  surprise here.
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="min-h-[44px] px-7 py-3 rounded-full border border-rose-soft text-rose-deep bg-cream/80 hover:bg-rose-soft/40 transition-colors"
          data-interactive
        >
          Replay
        </button>
      </main>
    </div>
  );
};

export default ValentineYes;

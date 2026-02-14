import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useNavigate } from "react-router-dom";

type Vec2 = { x: number; y: number };

type Layout = {
  width: number;
  height: number;
  yesBox: { x: number; y: number; w: number; h: number };
  noSize: { w: number; h: number };
};

type KissDrop = {
  id: number;
  x: number;
  size: number;
  duration: number;
  rotate: number;
  startY: number;
  endY: number;
  bounce: number;
};

const CHEEKY_MESSAGES = [
  "Nice try 😼",
  "Not today 🙃",
  "Your cursor can't catch me 🐾",
  "Too slow, hooman 😽",
  "Katto says no to No 😌",
];

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const ValentineQuestion = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const fieldRef = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const noRef = useRef<HTMLButtonElement>(null);

  const layoutRef = useRef<Layout | null>(null);
  const lastMoveRef = useRef(0);
  const navigateTimeoutRef = useRef<number | null>(null);
  const tauntTimeoutRef = useRef<number | null>(null);

  const [noPos, setNoPos] = useState<Vec2>({ x: 0, y: 0 });
  const noPosRef = useRef(noPos);
  const [ready, setReady] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const attemptsRef = useRef(0);
  const [taunt, setTaunt] = useState<string | null>(null);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [kissDrops, setKissDrops] = useState<KissDrop[]>([]);
  const kissIdRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const tauntRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    noPosRef.current = noPos;
  }, [noPos]);

  useEffect(() => {
    attemptsRef.current = attempts;
  }, [attempts]);

  const showTaunt = useCallback((attemptLevel: number) => {
    const nextMessage = CHEEKY_MESSAGES[attemptLevel % CHEEKY_MESSAGES.length];
    setTaunt(nextMessage);
    if (tauntTimeoutRef.current) window.clearTimeout(tauntTimeoutRef.current);
    tauntTimeoutRef.current = window.setTimeout(() => setTaunt(null), 1400);
    const id = kissIdRef.current++;
    const cardRect = cardRef.current?.getBoundingClientRect();
    const tauntRect = tauntRef.current?.getBoundingClientRect();
    const fallbackEndY = cardRect ? cardRect.height * 0.72 : 260;
    const endY = cardRect && tauntRect
      ? tauntRect.top - cardRect.top + tauntRect.height / 2
      : fallbackEndY;
    const drop: KissDrop = {
      id,
      x: 10 + Math.random() * 80,
      size: prefersReducedMotion ? 28 : 40 + Math.random() * 14,
      duration: prefersReducedMotion ? 2.2 : 2.4 + Math.random() * 0.6,
      rotate: (Math.random() - 0.5) * 20,
      startY: -30,
      endY,
      bounce: prefersReducedMotion ? 10 : 14 + Math.random() * 8,
    };
    setKissDrops((prev) => [...prev.slice(-6), drop]);
    window.setTimeout(() => {
      setKissDrops((prev) => prev.filter((item) => item.id !== id));
    }, (drop.duration + 0.6) * 1000);
  }, [prefersReducedMotion]);

  const findSafePosition = useCallback(
    (attemptLevel: number, preferred?: Vec2, candidates?: Vec2[]) => {
      const layout = layoutRef.current;
      if (!layout) return { x: 0, y: 0 };

      const maxX = Math.max(0, layout.width - layout.noSize.w);
      const maxY = Math.max(0, layout.height - layout.noSize.h);
      const yesCenter = {
        x: layout.yesBox.x + layout.yesBox.w / 2,
        y: layout.yesBox.y + layout.yesBox.h / 2,
      };
      const centerBounds = [
        { x: layout.noSize.w / 2, y: layout.noSize.h / 2 },
        { x: layout.width - layout.noSize.w / 2, y: layout.noSize.h / 2 },
        { x: layout.noSize.w / 2, y: layout.height - layout.noSize.h / 2 },
        { x: layout.width - layout.noSize.w / 2, y: layout.height - layout.noSize.h / 2 },
      ];
      const maxPossibleDistance = Math.max(
        ...centerBounds.map((corner) => Math.hypot(corner.x - yesCenter.x, corner.y - yesCenter.y))
      );
      const desiredMinDistance =
        Math.max(layout.yesBox.w, layout.yesBox.h) * 1.2 + 36 + attemptLevel * (prefersReducedMotion ? 6 : 12);
      const minDistance = Math.max(0, Math.min(desiredMinDistance, maxPossibleDistance - 8));

      const isSafe = (x: number, y: number) => {
        const noCenter = { x: x + layout.noSize.w / 2, y: y + layout.noSize.h / 2 };
        const distance = Math.hypot(noCenter.x - yesCenter.x, noCenter.y - yesCenter.y);
        const overlaps = !(
          x + layout.noSize.w < layout.yesBox.x ||
          x > layout.yesBox.x + layout.yesBox.w ||
          y + layout.noSize.h < layout.yesBox.y ||
          y > layout.yesBox.y + layout.yesBox.h
        );
        return distance >= minDistance && !overlaps;
      };

      if (preferred) {
        const clamped = {
          x: clamp(preferred.x, 0, maxX),
          y: clamp(preferred.y, 0, maxY),
        };
        if (isSafe(clamped.x, clamped.y)) return clamped;
      }

      if (candidates && candidates.length > 0) {
        for (const candidate of candidates) {
          const clamped = {
            x: clamp(candidate.x, 0, maxX),
            y: clamp(candidate.y, 0, maxY),
          };
          if (isSafe(clamped.x, clamped.y)) return clamped;
        }
      }

      for (let i = 0; i < 90; i += 1) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;
        if (isSafe(x, y)) return { x, y };
      }

      return {
        x: clamp(noPosRef.current.x, 0, maxX),
        y: clamp(noPosRef.current.y, 0, maxY),
      };
    },
    [prefersReducedMotion]
  );

  const updateLayout = useCallback(() => {
    const field = fieldRef.current;
    const yes = yesRef.current;
    const no = noRef.current;
    if (!field || !yes || !no) return;

    const fieldRect = field.getBoundingClientRect();
    const yesRect = yes.getBoundingClientRect();
    const noRect = no.getBoundingClientRect();

    layoutRef.current = {
      width: fieldRect.width,
      height: fieldRect.height,
      yesBox: {
        x: yesRect.left - fieldRect.left,
        y: yesRect.top - fieldRect.top,
        w: yesRect.width,
        h: yesRect.height,
      },
      noSize: { w: noRect.width, h: noRect.height },
    };

    if (!ready) {
      const initial = findSafePosition(0, {
        x: layoutRef.current.yesBox.x + layoutRef.current.yesBox.w + 16,
        y: layoutRef.current.yesBox.y,
      });
      setNoPos(initial);
      setReady(true);
    } else {
      const layout = layoutRef.current;
      if (!layout) return;
      const maxX = Math.max(0, layout.width - layout.noSize.w);
      const maxY = Math.max(0, layout.height - layout.noSize.h);
      setNoPos((prev) => ({
        x: clamp(prev.x, 0, maxX),
        y: clamp(prev.y, 0, maxY),
      }));
    }
  }, [findSafePosition, ready]);

  useLayoutEffect(() => {
    updateLayout();
    const field = fieldRef.current;
    if (!field) return undefined;
    const resizeObserver = new ResizeObserver(() => updateLayout());
    resizeObserver.observe(field);
    window.addEventListener("resize", updateLayout);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [updateLayout]);

  const moveNoButton = useCallback(
    (pointer?: Vec2) => {
      const layout = layoutRef.current;
      if (!layout) return;

      const now = Date.now();
      const cooldown = prefersReducedMotion ? 120 : 40;
      if (now - lastMoveRef.current < cooldown) return;
      lastMoveRef.current = now;

      const nextAttempt = attemptsRef.current + 1;
      const escapeDistance = (prefersReducedMotion ? 200 : 280) + nextAttempt * (prefersReducedMotion ? 8 : 16);

      if (pointer) {
        const maxX = Math.max(0, layout.width - layout.noSize.w);
        const maxY = Math.max(0, layout.height - layout.noSize.h);
        const corners = [
          { x: 0, y: 0 },
          { x: maxX, y: 0 },
          { x: 0, y: maxY },
          { x: maxX, y: maxY },
        ];
        const orderedCorners = corners
          .map((corner) => ({
            ...corner,
            distance: Math.hypot(corner.x - pointer.x, corner.y - pointer.y),
          }))
          .sort((a, b) => b.distance - a.distance)
          .map(({ x, y }) => ({ x, y }));

        const nextPos = findSafePosition(nextAttempt, undefined, orderedCorners);
        setNoPos(nextPos);
        attemptsRef.current = nextAttempt;
        setAttempts(nextAttempt);
        showTaunt(nextAttempt);
        return;
      }

      let preferred: Vec2 | undefined;
      if (pointer) {
        const currentCenter = {
          x: noPosRef.current.x + layout.noSize.w / 2,
          y: noPosRef.current.y + layout.noSize.h / 2,
        };
        const angle = Math.atan2(currentCenter.y - pointer.y, currentCenter.x - pointer.x);
        preferred = {
          x: currentCenter.x + Math.cos(angle) * escapeDistance - layout.noSize.w / 2,
          y: currentCenter.y + Math.sin(angle) * escapeDistance - layout.noSize.h / 2,
        };
      }

      const nextPos = findSafePosition(nextAttempt, preferred);
      setNoPos(nextPos);
      attemptsRef.current = nextAttempt;
      setAttempts(nextAttempt);
      showTaunt(nextAttempt);
    },
    [findSafePosition, prefersReducedMotion, showTaunt]
  );

  const tryEvade = useCallback(
    (clientX: number, clientY: number, pointerType: string) => {
      const layout = layoutRef.current;
      if (!layout) return;

      const rect = fieldRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pointer = { x: clientX - rect.left, y: clientY - rect.top };
      const noCenter = {
        x: noPosRef.current.x + layout.noSize.w / 2,
        y: noPosRef.current.y + layout.noSize.h / 2,
      };
      const radius = (prefersReducedMotion ? 160 : 240) + attemptsRef.current * 10;
      const distance = Math.hypot(pointer.x - noCenter.x, pointer.y - noCenter.y);

      const effectiveRadius = pointerType === "touch" ? radius + 30 : radius;
      if (distance < effectiveRadius) {
        moveNoButton(pointer);
      }
    },
    [moveNoButton, prefersReducedMotion]
  );

  const handleYesClick = useCallback(() => {
    if (isCelebrating) return;
    setIsCelebrating(true);
    setBurstKey((prev) => prev + 1);
    window.dispatchEvent(new CustomEvent("katoo:splash", { detail: { duration: 5000 } }));
    navigateTimeoutRef.current = window.setTimeout(() => navigate("/yes"), 5000);
  }, [isCelebrating, navigate, prefersReducedMotion]);

  useEffect(
    () => () => {
      if (navigateTimeoutRef.current) window.clearTimeout(navigateTimeoutRef.current);
      if (tauntTimeoutRef.current) window.clearTimeout(tauntTimeoutRef.current);
    },
    []
  );

  const burstCount = prefersReducedMotion ? 6 : 16;
  const burstItems = useMemo(
    () =>
      Array.from({ length: burstCount }, (_, i) => ({
        id: `${burstKey}-${i}`,
        x: (Math.random() - 0.5) * 260,
        y: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 180,
        scale: 0.8 + Math.random() * 0.6,
      })),
    [burstCount, burstKey]
  );

  return (
    <section id="valentine-question" className="relative py-24 px-4 overflow-hidden safe-pad">
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at top, hsl(351, 78%, 96%) 0%, hsl(36, 100%, 97%) 55%, hsl(351, 78%, 92%) 100%)",
        }}
      />

      <div className="relative container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-[2rem] p-[1px] bg-gradient-to-br from-rose-soft/70 via-white/40 to-rose-glow/60 shadow-rose/70"
        >
          <div ref={cardRef} className="relative glass rounded-[2rem] p-8 md:p-12 border border-white/40">
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              {kissDrops.map((drop) => (
                <motion.span
                  key={drop.id}
                  className="absolute"
                  style={{ left: `${drop.x}%` }}
                  initial={{ y: drop.startY, opacity: 0, rotate: drop.rotate, scale: 0.95 }}
                  animate={{
                    y: [drop.startY, drop.endY, drop.endY - drop.bounce, drop.endY],
                    opacity: [0, 1, 1, 0],
                    rotate: [drop.rotate, drop.rotate + 10, drop.rotate - 6, drop.rotate + 18],
                    scale: [1, 1, 0.92, 1],
                  }}
                  transition={{
                    duration: drop.duration,
                    times: [0, 0.72, 0.84, 1],
                    ease: ["easeIn", "easeOut", "easeInOut", "easeIn"],
                  }}
                >
                  <span style={{ fontSize: drop.size }}>😘</span>
                </motion.span>
              ))}
            </div>

            <div className="relative z-10">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                <svg width="80" height="36" viewBox="0 0 80 36" fill="none" aria-hidden>
                  <path d="M6 30 L20 6 L34 30" stroke="hsl(355, 85%, 41%)" strokeWidth="2" opacity="0.6" />
                  <path d="M46 30 L60 6 L74 30" stroke="hsl(355, 85%, 41%)" strokeWidth="2" opacity="0.6" />
                </svg>
              </div>

              <span className="absolute top-8 left-10 text-3xl opacity-20" aria-hidden>🐾</span>
              <span className="absolute bottom-10 right-12 text-3xl opacity-20" aria-hidden>🐾</span>

              <div className="text-center">
                <motion.span
                  className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-muted-foreground"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  Valentine Special
                </motion.span>

                <h2 className="mt-4 font-serif text-4xl md:text-5xl text-foreground">
                  Will you be my Valentine, Katto? 💘🐾
                </h2>

                <p className="mt-4 text-lg text-muted-foreground">Schönes Katze deserves a magical day ✨</p>
                <p className="mt-2 text-sm text-rose-deep/80">I already know your answer... but I'll let you click it 😼</p>
              </div>

              <div
                ref={fieldRef}
                className="relative mt-10 min-h-[160px] w-full flex items-center justify-center"
                onPointerMove={(event) => {
                  tryEvade(event.clientX, event.clientY, event.pointerType);
                }}
                onPointerDown={(event) => {
                  tryEvade(event.clientX, event.clientY, event.pointerType);
                }}
              >
                <button
                  ref={yesRef}
                  type="button"
                  onClick={handleYesClick}
                  disabled={isCelebrating}
                  className="relative z-10 min-h-[44px] px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold shadow-rose hover:shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-glow/70"
                  data-interactive
                >
                  Yes 💖
                </button>

                <button
                  ref={noRef}
                  type="button"
                  tabIndex={-1}
                  onPointerDown={(event) => {
                    event.preventDefault();
                    const rect = fieldRef.current?.getBoundingClientRect();
                    if (!rect) return;
                    moveNoButton({ x: event.clientX - rect.left, y: event.clientY - rect.top });
                  }}
                  onPointerEnter={() => moveNoButton()}
                  onClick={(event) => {
                    event.preventDefault();
                    moveNoButton();
                  }}
                  onFocus={() => {
                    yesRef.current?.focus();
                    moveNoButton();
                  }}
                  className={`absolute left-0 top-0 min-h-[44px] px-7 py-3 rounded-full border border-rose-soft text-rose-deep bg-cream/70 backdrop-blur-sm shadow-petal transition-transform duration-200 focus:outline-none ${
                    ready ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transform: `translate3d(${noPos.x}px, ${noPos.y}px, 0)`,
                    transitionDuration: prefersReducedMotion ? "220ms" : "120ms",
                    transitionTimingFunction: "cubic-bezier(0.22, 0.8, 0.2, 1)",
                  }}
                  data-interactive
                  aria-label="No"
                >
                  No 🙈
                </button>
              </div>

              <div
                ref={tauntRef}
                className="mt-6 flex items-center justify-center min-h-[28px]"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  {taunt && (
                    <motion.div
                      key={taunt}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                      className="text-sm text-rose-deep/80"
                    >
                      {taunt}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isCelebrating && (
                  <motion.div
                    key={burstKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute inset-0 flex items-center justify-center"
                  >
                    {burstItems.map((heart, index) => (
                      <motion.span
                        key={heart.id}
                        className="absolute text-2xl"
                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, heart.scale, 0.8],
                          x: heart.x,
                          y: heart.y,
                          rotate: heart.rotate,
                        }}
                        transition={{ duration: prefersReducedMotion ? 0.6 : 1.2, delay: index * 0.02 }}
                      >
                        💖
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ValentineQuestion;

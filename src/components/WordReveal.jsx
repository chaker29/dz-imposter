import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container } from '@mui/material'
import { Lock, Unlock, ChevronRight, MessageCircle } from 'lucide-react'

const HOLD_DURATION = 1500

const AVATAR_COLORS = [
  'from-teal-500 to-cyan-400',
  'from-indigo-500 to-violet-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-green-400',
  'from-sky-500 to-blue-400',
]

export default function WordReveal({ roles, revealIndex, setRevealIndex, onDone }) {
  const [revealed, setRevealed] = useState(false)
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [passing, setPassing] = useState(false)
  const holdTimer = useRef(null)
  const progressInterval = useRef(null)
  const startTime = useRef(null)

  const current = roles[revealIndex]
  const isLast = revealIndex === roles.length - 1
  const avatarColor = AVATAR_COLORS[revealIndex % AVATAR_COLORS.length]

  useEffect(() => {
    setRevealed(false)
    setHolding(false)
    setProgress(0)
    setPassing(false)
  }, [revealIndex])

  const startHold = useCallback((e) => {
    if (revealed) return
    setHolding(true)
    startTime.current = Date.now()
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime.current
      setProgress(Math.min((elapsed / HOLD_DURATION) * 100, 100))
    }, 16)
    holdTimer.current = setTimeout(() => {
      clearInterval(progressInterval.current)
      setProgress(100)
      setRevealed(true)
      setHolding(false)
    }, HOLD_DURATION)
  }, [revealed])

  const cancelHold = useCallback(() => {
    if (revealed) return
    clearTimeout(holdTimer.current)
    clearInterval(progressInterval.current)
    setHolding(false)
    setProgress(0)
  }, [revealed])

  const next = () => {
    if (!revealed) return
    if (isLast) { onDone(); return }
    setPassing(true)
    setTimeout(() => { setRevealIndex(i => i + 1) }, 800)
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <Container maxWidth="xs" sx={{ px: '24px', py: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* ─── TOP BAR ─── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              مرحلة الكشف
            </span>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {roles.map((_, i) => (
                <div key={i} style={{
                  borderRadius: 999, transition: 'all 0.3s',
                  width: i < revealIndex ? 20 : i === revealIndex ? 28 : 12,
                  height: 6,
                  background: i <= revealIndex ? (i === revealIndex ? '#2dd4bf' : 'rgba(45,212,191,0.6)') : '#334155',
                }} />
              ))}
            </Box>
            <span style={{ color: '#64748b', fontSize: 16, fontFamily: 'monospace' }}>{revealIndex + 1}/{roles.length}</span>
          </Box>
        </motion.div>

        {/* ─── PLAYER NAME (centered in flex-1) ─── */}
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', py: '32px' }}>
          <AnimatePresence mode="wait">
            {!passing ? (
              <motion.div
                key={`player-${revealIndex}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <div className={`bg-gradient-to-br ${avatarColor} flex items-center justify-center font-black text-white shadow-2xl`}
                  style={{ width: 80, height: 80, borderRadius: 24, fontSize: '1.875rem', marginBottom: 24 }}>
                  {current?.name[0]?.toUpperCase()}
                </div>
                <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', margin: 0, marginBottom: 8 }}>{current?.name}</h2>
                <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>
                  {revealed ? 'لا تُظهر الشاشة لأحد!' : 'اضغط مع الاستمرار لرؤية دورك'}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="pass-screen"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}
              >
                <div style={{ fontSize: '3.75rem' }}>📱</div>
                <p style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2dd4bf', margin: 0 }}>مرر الهاتف!</p>
                <p style={{ color: '#64748b', fontSize: 16, margin: 0 }}>لـ {roles[revealIndex + 1]?.name}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>

        {/* ─── CARD + BUTTON (bottom) ─── */}
        {!passing && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', pb: '16px' }}>
            <AnimatePresence mode="wait">

              {/* LOCKED */}
              {!revealed && (
                <motion.div key="locked" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden', pointerEvents: 'none' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: `conic-gradient(#2dd4bf ${progress * 3.6}deg, transparent ${progress * 3.6}deg)`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor', maskComposite: 'exclude',
                      padding: 2.5, borderRadius: 24,
                      opacity: holding ? 1 : 0.4, transition: 'opacity 0.2s',
                    }} />
                  </div>
                  <motion.button
                    onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold}
                    onTouchStart={startHold} onTouchEnd={cancelHold} onTouchCancel={cancelHold}
                    animate={{ scale: holding ? 0.975 : 1 }}
                    transition={{ duration: 0.1 }}
                    style={{
                      width: '100%', padding: '40px 0', background: 'rgba(30,41,59,0.8)',
                      border: '1px solid rgba(51,65,85,0.6)', borderRadius: 24,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
                      cursor: 'pointer', userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
                    }}
                  >
                    <motion.div
                      animate={{ scale: holding ? [1, 1.1, 1] : 1, rotate: holding ? [0, -5, 5, 0] : 0 }}
                      transition={{ duration: 0.6, repeat: holding ? Infinity : 0 }}
                      style={{ width: 64, height: 64, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: holding ? 'rgba(45,212,191,0.2)' : 'rgba(51,65,85,0.6)', transition: 'background 0.2s' }}
                    >
                      <Lock size={28} style={{ color: holding ? '#2dd4bf' : '#64748b' }} strokeWidth={1.8} />
                    </motion.div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 600, fontSize: 16, color: holding ? '#5eead4' : '#64748b', margin: 0 }}>
                        {holding ? 'استمر في الضغط...' : 'اضغط مع الاستمرار'}
                      </p>
                      {holding && (
                        <div style={{ marginTop: 12, marginInline: 'auto', height: 4, background: '#334155', borderRadius: 999, overflow: 'hidden', width: 128 }}>
                          <div style={{ height: '100%', background: 'linear-gradient(to right, #14b8a6, #5eead4)', borderRadius: 999, width: `${progress}%`, transition: 'width 0.05s' }} />
                        </div>
                      )}
                    </div>
                  </motion.button>
                </motion.div>
              )}

              {/* CITIZEN */}
              {revealed && !current?.isImposter && (
                <motion.div key="citizen"
                  initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.45, ease: 'backOut' }}
                  className="bg-gradient-to-br from-teal-900/50 to-slate-900"
                  style={{ borderRadius: 24, padding: 32, border: '1px solid rgba(20,184,166,0.25)', textAlign: 'center' }}
                >
                  <div className="bg-teal-500/15 border border-teal-500/25" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 16px', color: '#2dd4bf', fontSize: 16, fontWeight: 700, marginBottom: 20 }}>
                    <Unlock size={14} strokeWidth={2.5} />
                    أنت مواطن
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: 14, margin: '0 0 12px' }}>كلمتك السرية</p>
                  <div dir="rtl" style={{ fontSize: '2.25rem', fontWeight: 900, color: '#fff', marginBottom: 20 }}>
                    {current?.word}
                  </div>
                  {current?.hint && (
                    <div className="bg-slate-800/60 border border-slate-700/50" style={{ borderRadius: 16, padding: '12px 16px', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                      <span style={{ color: '#fbbf24', fontSize: 14 }}>💡 تلميح:</span>
                      <span style={{ color: '#cbd5e1', fontSize: 16 }}>{current.hint}</span>
                    </div>
                  )}
                  <p style={{ color: '#475569', fontSize: 14, margin: '16px 0 0' }}>اكشف الإمبوستر دون أن تقول كلمتك مباشرة 🕵️</p>
                </motion.div>
              )}

              {/* IMPOSTER */}
              {revealed && current?.isImposter && (
                <motion.div key="imposter"
                  initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'backOut' }}
                  className="bg-gradient-to-br from-rose-950/70 to-slate-900"
                  style={{ borderRadius: 24, padding: 32, border: '1px solid rgba(244,63,94,0.3)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}
                >
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 24, pointerEvents: 'none', boxShadow: 'inset 0 0 60px rgba(244,63,94,0.12)' }} />
                  <motion.div animate={{ scale: [1, 1.08, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ fontSize: '3rem', marginBottom: 20 }}>
                    🎭
                  </motion.div>
                  <div className="bg-rose-500/20 border border-rose-500/30" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 999, padding: '8px 20px', color: '#fb7185', fontSize: 18, fontWeight: 900, marginBottom: 16 }}>
                    أنت الإمبوستر!
                  </div>
                  <p style={{ color: '#cbd5e1', fontWeight: 600, fontSize: 16, margin: '0 0 8px' }}>لا تعرف الكلمة الصحيحة</p>
                  <p style={{ color: '#64748b', fontSize: 16, margin: '0 0 16px' }}>حاول تندمج مع المواطنين دون أن تنكشف 🤫</p>
                  
                  <div className="bg-rose-500/8 border border-rose-500/15" style={{ borderRadius: 16, padding: '12px 16px' }}>
                    <p style={{ color: 'rgba(251,113,133,0.7)', fontSize: 14, margin: 0 }}>نصيحة: استمع للآخرين واستنتج الكلمة 🧠</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* NEXT BUTTON */}
            <AnimatePresence>
              {revealed && (
                <motion.button
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={next}
                  className="bg-gradient-to-r from-teal-500 to-teal-400"
                  style={{
                    width: '100%', borderRadius: 16, padding: '20px 0', fontWeight: 900, fontSize: 18,
                    color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(20,184,166,0.25)',
                  }}
                >
                  {isLast ? (
                    <><MessageCircle size={18} strokeWidth={2.5} /> ابدأ النقاش</>
                  ) : (
                    <><ChevronRight size={18} strokeWidth={2.5} /> التالي: {roles[revealIndex + 1]?.name}</>
                  )}
                </motion.button>
              )}
            </AnimatePresence>
          </Box>
        )}

        <Box sx={{ height: '32px' }} />
      </Container>
    </Box>
  )
}

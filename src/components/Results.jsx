import { motion } from 'framer-motion'
import { Box, Container } from '@mui/material'
import { RotateCcw, Home, Trophy, Swords } from 'lucide-react'

const AVATAR_COLORS = [
  'from-teal-500 to-cyan-400',
  'from-indigo-500 to-violet-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-green-400',
  'from-sky-500 to-blue-400',
]

function Divider() {
  return <Box sx={{ my: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #334155, transparent)' }} />
}

function SectionLabel({ children, color = '#94a3b8' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', mb: '20px' }}>
      <span style={{ color, fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
        {children}
      </span>
    </Box>
  )
}

function ConfettiDot({ citizensWin }) {
  const colors = citizensWin
    ? ['#2dd4bf', '#818cf8', '#34d399', '#60a5fa']
    : ['#f43f5e', '#fb923c', '#f59e0b', '#c084fc']
  const color = colors[Math.floor(Math.random() * colors.length)]
  const x = (Math.random() - 0.5) * 300
  const y = -(80 + Math.random() * 200)
  const rotate = Math.random() * 720
  return (
    <motion.div
      style={{ position: 'absolute', top: '25%', left: '50%', width: 8, height: 8, borderRadius: Math.random() > 0.5 ? '50%' : 2, background: color, pointerEvents: 'none' }}
      initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
      animate={{ x, y, opacity: 0, rotate, scale: 0.3 }}
      transition={{ duration: 1.2 + Math.random() * 0.8, ease: 'easeOut', delay: Math.random() * 0.4 }}
    />
  )
}

export default function Results({ winner, roles, onQuickReset, onFullReset }) {
  const citizensWin = winner === 'citizens'
  const imposters = roles.filter(p => p.isImposter)
  const citizens = roles.filter(p => !p.isImposter)

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <Container maxWidth="sm" sx={{ px: '24px', py: '40px' }}>

        {/* Confetti */}
        <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 30 }, (_, i) => (
            <ConfettiDot key={i} citizensWin={citizensWin} />
          ))}
        </div>

        {/* ─── HERO ─── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center' }}>
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
              style={{
                display: 'inline-flex', width: 96, height: 96, borderRadius: 24,
                alignItems: 'center', justifyContent: 'center', fontSize: '3rem', marginBottom: 32,
                background: citizensWin
                  ? 'linear-gradient(135deg, rgba(20,184,166,0.25), rgba(99,102,241,0.25))'
                  : 'linear-gradient(135deg, rgba(244,63,94,0.25), rgba(249,115,22,0.25))',
                border: `1px solid ${citizensWin ? 'rgba(45,212,191,0.25)' : 'rgba(244,63,94,0.25)'}`,
                boxShadow: citizensWin ? '0 8px 30px rgba(20,184,166,0.15)' : '0 8px 30px rgba(244,63,94,0.15)',
              }}
            >
              {citizensWin ? '🏆' : '🎭'}
            </motion.div>

            <h1 className={citizensWin ? 'gradient-text' : ''} style={{ fontSize: '2.25rem', fontWeight: 900, margin: '0 0 12px', color: citizensWin ? undefined : '#fb7185' }}>
              {citizensWin ? 'المواطنون يفوزون!' : 'الإمبوسترز يفوزون!'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: 16, margin: 0 }}>
              {citizensWin ? 'برافو — اكتشفتم الإمبوسترز 🎉' : 'الإمبوسترز كانوا أذكياء هذه المرة 😈'}
            </p>
          </Box>
        </motion.div>

        <Divider />

        {/* ─── IMPOSTERS ─── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionLabel color="#fb7185">
            <Swords size={13} /> الإمبوسترز
          </SectionLabel>

          <Box sx={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '24px', p: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px', mb: '20px' }}>
              {imposters.map((p) => (
                <div key={p.id} className="bg-rose-500/10 border border-rose-500/20"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, borderRadius: 999, paddingLeft: 6, paddingRight: 16, paddingTop: 6, paddingBottom: 6 }}>
                  <div className={`bg-gradient-to-br ${AVATAR_COLORS[roles.indexOf(p) % AVATAR_COLORS.length]}`}
                    style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff' }}>
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <span style={{ color: '#fda4af', fontSize: 16, fontWeight: 600 }}>{p.name}</span>
                  {p.eliminated && <span style={{ color: '#881337', fontSize: 14 }}>(مُقصى)</span>}
                </div>
              ))}
            </Box>

            <Box sx={{ height: '1px', background: 'rgba(244,63,94,0.15)', mb: '16px' }} />

            <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 8px' }}>الكلمة التي لم يعرفها الإمبوسترز</p>
            <p dir="rtl" style={{ color: '#fff', fontWeight: 900, fontSize: 28, margin: 0 }}>
              {citizens[0]?.word || '—'}
            </p>
          </Box>
        </motion.div>

        <Divider />

        {/* ─── CITIZENS ─── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <SectionLabel color="#2dd4bf">
            <Trophy size={13} /> المواطنون
          </SectionLabel>

          <Box sx={{ background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '24px', p: '20px' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {citizens.map((p) => (
                <div key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, borderRadius: 999,
                    paddingLeft: 6, paddingRight: 16, paddingTop: 6, paddingBottom: 6,
                    background: p.eliminated ? 'rgba(30,41,59,0.6)' : 'rgba(20,184,166,0.1)',
                    border: `1px solid ${p.eliminated ? '#334155' : 'rgba(20,184,166,0.2)'}`,
                  }}>
                  <div className={`bg-gradient-to-br ${AVATAR_COLORS[roles.indexOf(p) % AVATAR_COLORS.length]}`}
                    style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: '#fff', opacity: p.eliminated ? 0.4 : 1, filter: p.eliminated ? 'grayscale(1)' : 'none' }}>
                    {p.name[0]?.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 600, color: p.eliminated ? '#475569' : '#5eead4', textDecoration: p.eliminated ? 'line-through' : 'none' }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </Box>
          </Box>
        </motion.div>

        <Divider />

        {/* ─── ACTIONS ─── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              onClick={onQuickReset}
              className={citizensWin ? 'bg-gradient-to-r from-teal-500 to-teal-400' : 'bg-gradient-to-r from-rose-500 to-orange-400'}
              style={{
                width: '100%', borderRadius: 16, padding: '20px 0', fontWeight: 900, fontSize: 18,
                color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                border: 'none', cursor: 'pointer',
                boxShadow: citizensWin ? '0 10px 25px rgba(20,184,166,0.25)' : '0 10px 25px rgba(244,63,94,0.25)',
              }}
            >
              <RotateCcw size={18} strokeWidth={2.5} />
              لعبة جديدة — نفس اللاعبين
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={onFullReset}
              style={{
                width: '100%', borderRadius: 16, padding: '16px 0', fontWeight: 700, fontSize: 16,
                color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.6)', cursor: 'pointer',
              }}
            >
              <Home size={16} strokeWidth={2} />
              العودة للقائمة الرئيسية
            </motion.button>
          </Box>
        </motion.div>

        <Box sx={{ height: '32px' }} />
      </Container>
    </Box>
  )
}

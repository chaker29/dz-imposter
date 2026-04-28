import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container } from '@mui/material'
import { Users, Skull, Shield, Eye, EyeOff, Zap, Home, Target } from 'lucide-react'

const AVATAR_COLORS = [
  'from-teal-500 to-cyan-400',
  'from-indigo-500 to-violet-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-green-400',
  'from-sky-500 to-blue-400',
]

function SectionLabel({ children, right }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {children}
      </Box>
      {right && (
        <Box sx={{ color: '#2dd4bf', fontSize: 14, fontWeight: 700, background: 'rgba(45,212,191,0.1)', px: '12px', py: '4px', borderRadius: '999px' }}>
          {right}
        </Box>
      )}
    </Box>
  )
}

function Divider() {
  return <Box sx={{ my: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #334155, transparent)' }} />
}

export default function GamePlay({ roles, onEliminate, onQuickReset, onFullReset }) {
  const [elimTarget, setElimTarget] = useState(null)
  const [showImposters, setShowImposters] = useState(false)

  const alive = roles.filter(p => !p.eliminated)
  const eliminated = roles.filter(p => p.eliminated)
  const aliveImposters = alive.filter(p => p.isImposter)
  const aliveCitizens = alive.filter(p => !p.isImposter)

  const confirmEliminate = () => {
    if (elimTarget !== null) { onEliminate(elimTarget); setElimTarget(null) }
  }

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <Container maxWidth="sm" sx={{ px: '24px', py: '40px' }}>

        {/* ─── TITLE ─── */}
        <Box sx={{ textAlign: 'center', mb: '8px' }}>
          <h1 className="font-black text-lg gradient-text" style={{ margin: 0 }}>Chkoune l'Imposter?</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 6 }}>مرحلة النقاش والتصويت</p>
        </Box>

        {/* ─── STATS ─── */}
        <Box sx={{ display: 'flex', gap: '10px', mb: '12px' }}>
          <Box sx={{ flex: 1, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.15)', borderRadius: '16px', px: '12px', py: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '12px', background: 'rgba(20,184,166,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={14} className="text-teal-400" strokeWidth={1.8} />
            </Box>
            <div>
              <p style={{ color: '#2dd4bf', fontSize: 20, fontWeight: 900, lineHeight: 1, margin: 0 }}>{aliveCitizens.length}</p>
              <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>مواطنون</p>
            </div>
          </Box>
          <Box sx={{ flex: 1, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.15)', borderRadius: '16px', px: '12px', py: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '12px', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Target size={14} className="text-rose-400" strokeWidth={1.8} />
            </Box>
            <div>
              <p style={{ color: '#fb7185', fontSize: 20, fontWeight: 900, lineHeight: 1, margin: 0 }}>{aliveImposters.length}</p>
              <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>إمبوسترز</p>
            </div>
          </Box>
          <Box sx={{ flex: 1, background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '16px', px: '12px', py: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Box sx={{ width: 32, height: 32, borderRadius: '12px', background: 'rgba(51,65,85,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Skull size={14} className="text-slate-500" strokeWidth={1.8} />
            </Box>
            <div>
              <p style={{ color: '#94a3b8', fontSize: 20, fontWeight: 900, lineHeight: 1, margin: 0 }}>{eliminated.length}</p>
              <p style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>مُقصَون</p>
            </div>
          </Box>
        </Box>

        {/* ─── ADMIN CONTROLS ─── */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setShowImposters(v => !v)}
            className="bg-slate-800/60 border border-slate-700/50 hover:border-slate-600"
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderRadius: 16, color: '#94a3b8', fontSize: 15, cursor: 'pointer' }}
          >
            {showImposters ? <EyeOff size={14} /> : <Eye size={14} />}
            <span>{showImposters ? 'إخفاء الإمبوسترز' : 'كشف الإمبوسترز (أدمن)'}</span>
          </button>
          <AnimatePresence>
            {showImposters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ overflow: 'hidden' }}>
                <div className="bg-rose-500/8 border border-rose-500/20" style={{ borderRadius: 16, padding: 12 }}>
                  {roles.filter(p => p.isImposter).map(p => (
                    <p key={p.id} style={{ color: '#fb7185', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0' }}>
                      🎭 {p.name}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Box sx={{ display: 'flex', gap: '8px' }}>
            <button onClick={onQuickReset}
              className="bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/15"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 16, color: '#2dd4bf', fontSize: 14, cursor: 'pointer' }}>
              <Zap size={12} /> إعادة سريعة
            </button>
            <button onClick={onFullReset}
              className="bg-slate-800/60 border border-slate-700/50 hover:text-slate-300"
              style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px 12px', borderRadius: 16, color: '#64748b', fontSize: 14, cursor: 'pointer' }}>
              <Home size={12} /> القائمة الرئيسية
            </button>
          </Box>
        </Box>

        <Divider />

        {/* ─── PLAYERS ─── */}
        <SectionLabel right={`${alive.length} متبقي`}>
          <Users size={13} className="text-teal-400" />
          اللاعبون
        </SectionLabel>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <AnimatePresence>
            {roles.map((player, i) => (
              <motion.button
                key={player.id}
                layout
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: player.eliminated ? 0.45 : 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                whileTap={{ scale: player.eliminated ? 1 : 0.94 }}
                whileHover={{ scale: player.eliminated ? 1 : 1.02 }}
                onClick={() => !player.eliminated && setElimTarget(player.id)}
                disabled={player.eliminated}
                style={{
                  position: 'relative', padding: '20px 16px', borderRadius: 24, textAlign: 'center',
                  background: player.eliminated ? 'rgba(30,41,59,0.4)' : elimTarget === player.id ? 'rgba(244,63,94,0.12)' : 'rgba(30,41,59,0.7)',
                  border: player.eliminated ? '1px solid #1e293b' : elimTarget === player.id ? '2px solid rgba(244,63,94,0.6)' : '1px solid rgba(51,65,85,0.6)',
                  cursor: player.eliminated ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                }}
              >
                {player.eliminated && (
                  <div style={{ position: 'absolute', inset: 0, borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.5)' }}>
                    <Skull size={22} style={{ color: '#475569' }} strokeWidth={1.5} />
                  </div>
                )}
                <div className={`bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                  style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', opacity: player.eliminated ? 0.3 : 1, filter: player.eliminated ? 'grayscale(1)' : 'none' }}>
                  {player.name[0]?.toUpperCase()}
                </div>
                <p style={{ fontWeight: 700, fontSize: 16, margin: 0, color: player.eliminated ? '#475569' : '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {player.name}
                </p>
                {!player.eliminated && (
                  <p style={{ fontSize: 14, marginTop: 6, margin: '6px 0 0', color: elimTarget === player.id ? '#fb7185' : '#475569' }}>
                    {elimTarget === player.id ? 'محدد للإقصاء' : 'اضغط'}
                  </p>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </Box>

        {/* ─── ELIMINATION PANEL ─── */}
        <AnimatePresence>
          {elimTarget !== null && (
            <>
              <Divider />
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                style={{ background: '#0f172a', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 24, padding: 24 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', mb: '20px' }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: '16px', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Target size={20} className="text-rose-400" strokeWidth={1.8} />
                  </Box>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700, margin: 0 }}>إقصاء <span style={{ color: '#fb7185' }}>{roles.find(p => p.id === elimTarget)?.name}</span>؟</p>
                    <p style={{ color: '#64748b', fontSize: 14, margin: '2px 0 0' }}>هل أنت متأكد من قرار التصويت؟</p>
                  </div>
                </Box>
                <Box sx={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setElimTarget(null)}
                    style={{ flex: 1, padding: '12px 0', borderRadius: 16, background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                    إلغاء
                  </button>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={confirmEliminate}
                    style={{ flex: 1, padding: '12px 0', borderRadius: 16, background: '#f43f5e', border: 'none', color: '#fff', fontSize: 16, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Skull size={15} strokeWidth={2.5} /> تأكيد الإقصاء
                  </motion.button>
                </Box>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <Box sx={{ height: '32px' }} />
      </Container>
    </Box>
  )
}

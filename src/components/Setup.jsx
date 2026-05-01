import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Container, Typography } from '@mui/material'
import {
  Trophy, Pizza, PawPrint, Car, Building2, Laptop, Smile,
  Clapperboard, Music, GraduationCap, MapPin, Shirt,
  Plus, X, Users, Lightbulb, UserCheck, Rocket, ChevronUp, ChevronDown,
  Settings, Shapes , Landmark, Tag
} from 'lucide-react'

const CAT_ICONS = {
  sports: <Trophy size={26} strokeWidth={1.8} />,
  food: <Pizza size={26} strokeWidth={1.8} />,
  animals: <PawPrint size={26} strokeWidth={1.8} />,
  cars: <Car size={26} strokeWidth={1.8} />,
  cities: <Building2 size={26} strokeWidth={1.8} />,
  tech: <Laptop size={26} strokeWidth={1.8} />,
  status: <Smile size={26} strokeWidth={1.8} />,
  movies: <Clapperboard size={26} strokeWidth={1.8} />,
  music: <Music size={26} strokeWidth={1.8} />,
  school: <GraduationCap size={26} strokeWidth={1.8} />,
  places: <MapPin size={26} strokeWidth={1.8} />,
  clothes: <Shirt size={26} strokeWidth={1.8} />,
  players: <Users size={26} strokeWidth={1.8} />,
  landmarks: <Landmark size={26} strokeWidth={1.8} />,
  brands: <Tag size={26} strokeWidth={1.8} />,
}

const AVATAR_COLORS = [
  'from-teal-500 to-cyan-400',
  'from-indigo-500 to-violet-400',
  'from-rose-500 to-pink-400',
  'from-amber-500 to-orange-400',
  'from-emerald-500 to-green-400',
  'from-sky-500 to-blue-400',
]

function calcAutoImposters(count) {
  if (count <= 4) return 1
  if (count <= 7) return 2
  return 3
}

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
  return (
    <Box sx={{ my: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #334155, transparent)' }} />
  )
}

export default function Setup({ onStart, categories }) {
  const [playerInput, setPlayerInput] = useState('')
  const [players, setPlayers] = useState([])
  const [selectedCats, setSelectedCats] = useState(['sports', 'food', 'animals'])
  const [hintsMode, setHintsMode] = useState(false)
  const [autoImposters, setAutoImposters] = useState(true)
  const [manualCount, setManualCount] = useState(1)
  const [error, setError] = useState('')

  const addPlayer = () => {
    const name = playerInput.trim()
    if (!name) return
    if (players.includes(name)) { setError('هذا الاسم موجود بالفعل'); return }
    if (players.length >= 15) { setError('15 لاعب كحد أقصى'); return }
    setPlayers(prev => [...prev, name])
    setPlayerInput('')
    setError('')
  }

  const removePlayer = (name) => {
    setPlayers(prev => prev.filter(p => p !== name))
    setError('')
  }

  const toggleCat = (id) => {
    setSelectedCats(prev =>
      prev.includes(id)
        ? prev.length > 1 ? prev.filter(c => c !== id) : prev
        : [...prev, id]
    )
  }

  const handleStart = () => {
    if (players.length < 3) { setError('تحتاج 3 لاعبين على الأقل'); return }
    const imposterCount = autoImposters
      ? calcAutoImposters(players.length)
      : Math.min(manualCount, Math.floor(players.length / 2))
    onStart({ playerNames: players, selectedCategories: selectedCats, hintsMode, imposterCount })
  }

  const autoCount = calcAutoImposters(players.length)

  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', zIndex: 10 }}>
      <Container maxWidth="sm" sx={{ px: '24px', py: '40px' }}>

        {/* ─── HERO ─── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Box sx={{ textAlign: 'center' }}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500/25 to-indigo-500/25 border border-teal-400/20 text-4xl glow-teal" style={{ marginBottom: 24 }}>
              🕵️
            </div>
            <Typography variant="h3" sx={{ fontWeight: 900, fontSize: '2.25rem', letterSpacing: '-0.02em', mb: '8px' }}>
              <span className="gradient-text">Chkoune</span>{' '}
              <span style={{ color: '#fff' }}>l'Imposter</span>
            </Typography>

          </Box>
        </motion.div>

        <Divider />

        {/* ─── PLAYERS ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <SectionLabel right={`${players.length} / 15`}>
            <Users size={13} className="text-teal-400" />
            اللاعبون
          </SectionLabel>

          <Box sx={{ display: 'flex', gap: '12px', mb: '16px' }}>
            <input
              type="text"
              value={playerInput}
              onChange={e => { setPlayerInput(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && addPlayer()}
              placeholder="اسم اللاعب..."
              className="flex-1 bg-slate-800/80 border border-slate-700 text-white placeholder-slate-600 rounded-2xl text-sm outline-none focus:border-teal-500/60 focus:ring-2 focus:ring-teal-500/15 transition-all text-right"
              dir="rtl"
              style={{ padding: '14px 16px' }}
            />
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={addPlayer}
              className="rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-900 flex items-center justify-center transition-colors flex-shrink-0"
              style={{ width: 48, height: 48 }}
            >
              <Plus size={20} strokeWidth={2.5} />
            </motion.button>
          </Box>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                style={{ color: '#f43f5e', fontSize: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                ⚠️ {error}
              </motion.p>
            )}
          </AnimatePresence>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', mt: '8px', minHeight: '40px' }}>
            <AnimatePresence>
              {players.map((name, i) => (
                <motion.div
                  key={name}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700/60 rounded-full"
                  style={{ paddingLeft: 6, paddingRight: 14, paddingTop: 6, paddingBottom: 6 }}
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-xs font-black text-white flex-shrink-0`}>
                    {name[0]?.toUpperCase()}
                  </div>
                  <span style={{ color: '#e2e8f0', fontSize: 14, fontWeight: 500 }}>{name}</span>
                  <button onClick={() => removePlayer(name)} className="text-slate-600 hover:text-rose-400 transition-colors" style={{ marginLeft: 2 }}>
                    <X size={12} strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        </motion.div>

        <Divider />

        {/* ─── SETTINGS ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SectionLabel>
            <Settings size={13} className="text-teal-400" />
            الإعدادات
          </SectionLabel>

          <Box sx={{ background: 'rgba(30,41,59,0.6)', border: '1px solid rgba(51,65,85,0.5)', borderRadius: '24px', overflow: 'hidden' }}>
            {/* Hints toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '16px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Lightbulb size={17} className="text-amber-400" strokeWidth={1.8} />
                </Box>
                <div>
                  <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>وضع التلميحات</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: 12, mt: '2px' }}>يظهر تلميح مع الكلمة</Typography>
                </div>
              </Box>
              <button onClick={() => setHintsMode(v => !v)}
                style={{ width: 48, height: 24, borderRadius: 999, position: 'relative', flexShrink: 0, border: 'none', cursor: 'pointer', background: hintsMode ? '#14b8a6' : '#334155', transition: 'background 0.3s' }}>
                <span style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'transform 0.3s', transform: hintsMode ? 'translateX(24px)' : 'translateX(0)' }} />
              </button>
            </Box>

            <Box sx={{ mx: '20px', height: '1px', background: 'rgba(51,65,85,0.5)' }} />

            {/* Imposters toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '20px', py: '20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: '16px', background: 'rgba(244,63,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <UserCheck size={17} className="text-rose-400" strokeWidth={1.8} />
                </Box>
                <div>
                  <Typography sx={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>عدد الإمبوسترز</Typography>
                  <Typography sx={{ color: '#64748b', fontSize: 12, mt: '2px' }}>
                    {autoImposters ? `تلقائي — ${autoCount} إمبوستر` : 'يدوي'}
                  </Typography>
                </div>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                {!autoImposters && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button onClick={() => setManualCount(v => Math.max(1, v - 1))}
                      className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors">
                      <ChevronDown size={14} />
                    </button>
                    <span style={{ color: '#fff', fontWeight: 900, width: 20, textAlign: 'center', fontSize: 14 }}>{manualCount}</span>
                    <button onClick={() => setManualCount(v => Math.min(Math.max(1, Math.floor(players.length / 2)), v + 1))}
                      className="w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors">
                      <ChevronUp size={14} />
                    </button>
                  </Box>
                )}
                <button onClick={() => setAutoImposters(v => !v)}
                  style={{ width: 48, height: 24, borderRadius: 999, position: 'relative', border: 'none', cursor: 'pointer', background: autoImposters ? '#14b8a6' : '#334155', transition: 'background 0.3s' }}>
                  <span style={{ position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.3)', transition: 'transform 0.3s', transform: autoImposters ? 'translateX(24px)' : 'translateX(0)' }} />
                </button>
              </Box>
            </Box>
          </Box>
        </motion.div>

        <Divider />

        {/* ─── CATEGORIES ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SectionLabel right={`${selectedCats.length} مختارة`}>
            <Shapes size={13} className="text-teal-400" />  الفئات</SectionLabel>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {categories.map((cat, i) => {
              const active = selectedCats.includes(cat.id)
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.04 * i }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleCat(cat.id)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                    padding: '16px 6px', borderRadius: 16, border: '1px solid',
                    borderColor: active ? 'rgba(45,212,191,0.5)' : 'rgba(51,65,85,0.5)',
                    background: active ? 'rgba(45,212,191,0.12)' : 'rgba(30,41,59,0.6)',
                    color: active ? '#5eead4' : '#64748b',
                    cursor: 'pointer', position: 'relative', transition: 'all 0.2s',
                  }}
                >
                  {active && (
                    <div style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, borderRadius: '50%', background: '#2dd4bf', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#0f172a', fontSize: 8, fontWeight: 900 }}>✓</span>
                    </div>
                  )}
                  <div style={{ color: active ? '#2dd4bf' : '#475569' }}>
                    {CAT_ICONS[cat.id]}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{cat.nameAr}</span>
                </motion.button>
              )
            })}
          </Box>
        </motion.div>

        <Divider />

        {/* ─── START BUTTON ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleStart}
            className="bg-gradient-to-r from-teal-500 to-teal-400"
            style={{
              width: '100%', borderRadius: 16, padding: '20px 0', fontWeight: 900, fontSize: 18,
              color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              border: 'none', cursor: 'pointer', boxShadow: '0 10px 25px rgba(20,184,166,0.25)',
            }}
          >
            <Rocket size={20} strokeWidth={2.5} />
            ابدأ اللعبة
          </motion.button>
        </motion.div>

        <Box sx={{ height: '32px' }} />
      </Container>
    </Box>
  )
}
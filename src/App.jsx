import { useState, useCallback, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Setup from './components/Setup'
import WordReveal from './components/WordReveal'
import GamePlay from './components/GamePlay'
import Results from './components/Results'
import gameData from './GameData.json'

// Shuffle helper
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function weightedRandomPick(weights) {
  // Pick one index based on weights array, returns the index
  const total = weights.reduce((s, w) => s + w, 0)
  let r = Math.random() * total
  for (let i = 0; i < weights.length; i++) {
    r -= weights[i]
    if (r <= 0) return i
  }
  return weights.length - 1
}

function buildRoles(players, imposterCount, pair, hintsMode, imposterHistory) {
  // Randomly pick one word from the words array
  const words = pair.words || [pair.word || pair.wordA];
  const secretWord = words[Math.floor(Math.random() * words.length)];
  const hint = pair.hint;

  // Weighted-random imposter selection:
  // Everyone has a chance, but recent imposters have lower probability
  const lastRound = imposterHistory.length > 0 ? imposterHistory[imposterHistory.length - 1] : []
  const lastRoundSet = new Set(lastRound)
  const recentHistory = imposterHistory.slice(-3)

  // Count recent imposter appearances
  const recentCounts = {}
  players.forEach((_, i) => { recentCounts[i] = 0 })
  recentHistory.forEach(indices => {
    indices.forEach(idx => {
      if (idx < players.length) recentCounts[idx] = (recentCounts[idx] || 0) + 1
    })
  })

  // Build weights: base 1.0, penalize recent imposters
  const baseWeights = players.map((_, i) => {
    let w = 1.0
    // Strong penalty if you were imposter LAST round
    if (lastRoundSet.has(i)) w -= 0.55
    // Lighter penalty for each appearance in the last 3 rounds
    w -= recentCounts[i] * 0.15
    // Floor at 0.1 so it's never impossible — just very unlikely
    return Math.max(0.1, w)
  })

  // Pick imposters via weighted random draw (without replacement)
  const imposterIndices = new Set()
  const remainingWeights = [...baseWeights]
  for (let pick = 0; pick < imposterCount; pick++) {
    const idx = weightedRandomPick(remainingWeights)
    imposterIndices.add(idx)
    remainingWeights[idx] = 0 // remove from pool
  }

  return players.map((name, i) => ({
    name,
    isImposter: imposterIndices.has(i),
    word: imposterIndices.has(i) ? null : secretWord,
    hint: hintsMode ? hint : null,
    eliminated: false,
    id: i,
  }))
}

const SCREENS = { SETUP: 'setup', REVEAL: 'reveal', GAME: 'game', RESULTS: 'results' }

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -30, scale: 0.97, transition: { duration: 0.3 } },
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.SETUP)
  const [players, setPlayers] = useState([])
  const [config, setConfig] = useState(null)
  const [roles, setRoles] = useState([])
  const [revealIndex, setRevealIndex] = useState(0)
  const [winner, setWinner] = useState(null) // 'citizens' | 'imposters'
  const [lastCategory, setLastCategory] = useState(null)
  const [starterPlayer, setStarterPlayer] = useState(null)

  // Track used word pairs (by stringified key) to avoid repeats in same session
  const usedPairsRef = useRef(new Set())
  // Track imposter history: array of arrays of imposter indices
  const imposterHistoryRef = useRef([])

  const getWordPair = (selectedCategories) => {
    const pool = gameData.categories.filter(c => selectedCategories.includes(c.id))

    // Logic to pick a different category if possible
    let availablePool = pool.filter(c => c.id !== lastCategory)
    if (availablePool.length === 0) availablePool = pool // Reset if all used or only one

    const category = availablePool[Math.floor(Math.random() * availablePool.length)]
    setLastCategory(category.id)

    // Filter out pairs already used in this session
    let availablePairs = category.pairs.filter(p => {
      const key = `${category.id}::${p.words.join(',')}`
      return !usedPairsRef.current.has(key)
    })

    // If all pairs in this category are used, reset the tracking for this category
    if (availablePairs.length === 0) {
      // Clear used pairs for this category
      const keysToRemove = []
      usedPairsRef.current.forEach(k => {
        if (k.startsWith(`${category.id}::`)) keysToRemove.push(k)
      })
      keysToRemove.forEach(k => usedPairsRef.current.delete(k))
      availablePairs = category.pairs
    }

    const localPair = availablePairs[Math.floor(Math.random() * availablePairs.length)]

    // Mark this pair as used
    const pairKey = `${category.id}::${localPair.words.join(',')}`
    usedPairsRef.current.add(pairKey)

    return localPair;
  }

  const startGame = (setupConfig) => {
    const { playerNames, selectedCategories, hintsMode, imposterCount } = setupConfig
    setConfig(setupConfig)
    setPlayers(playerNames)

    const pair = getWordPair(selectedCategories)
    const assigned = buildRoles(playerNames, imposterCount, pair, hintsMode, imposterHistoryRef.current)

    // Record imposter history
    const imposterIndices = assigned.filter(p => p.isImposter).map(p => p.id)
    imposterHistoryRef.current.push(imposterIndices)

    // Pick a non-imposter player to start the game
    const nonImposters = assigned.filter(p => !p.isImposter)
    const starter = nonImposters[Math.floor(Math.random() * nonImposters.length)]
    setStarterPlayer(starter)

    setRoles(assigned)
    setRevealIndex(0)
    setWinner(null)
    setScreen(SCREENS.REVEAL)
  }

  const onRevealDone = useCallback(() => {
    setScreen(SCREENS.GAME)
  }, [])

  const onEliminate = useCallback((playerId) => {
    setRoles(prev => {
      const next = prev.map(p => p.id === playerId ? { ...p, eliminated: true } : p)
      // Check win conditions
      const alive = next.filter(p => !p.eliminated)
      const aliveImposters = alive.filter(p => p.isImposter)
      const aliveCitizens = alive.filter(p => !p.isImposter)

      if (aliveImposters.length === 0) {
        setWinner('citizens')
        setScreen(SCREENS.RESULTS)
      } else if (aliveImposters.length >= aliveCitizens.length) {
        setWinner('imposters')
        setScreen(SCREENS.RESULTS)
      }
      return next
    })
  }, [])

  const quickReset = useCallback(() => {
    if (!config) return
    const pair = getWordPair(config.selectedCategories)
    const assigned = buildRoles(config.playerNames, config.imposterCount, pair, config.hintsMode, imposterHistoryRef.current)

    // Record imposter history
    const imposterIndices = assigned.filter(p => p.isImposter).map(p => p.id)
    imposterHistoryRef.current.push(imposterIndices)

    // Pick a non-imposter player to start the game
    const nonImposters = assigned.filter(p => !p.isImposter)
    const starter = nonImposters[Math.floor(Math.random() * nonImposters.length)]
    setStarterPlayer(starter)

    setRoles(assigned)
    setRevealIndex(0)
    setWinner(null)
    setScreen(SCREENS.REVEAL)
  }, [config])

  const fullReset = useCallback(() => {
    setScreen(SCREENS.SETUP)
    setPlayers([])
    setConfig(null)
    setRoles([])
    setRevealIndex(0)
    setWinner(null)
    setStarterPlayer(null)
    usedPairsRef.current.clear()
    imposterHistoryRef.current = []
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-rose-500/8 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {screen === SCREENS.SETUP && (
          <motion.div key="setup" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Setup onStart={startGame} categories={gameData.categories} />
          </motion.div>
        )}

        {screen === SCREENS.REVEAL && (
          <motion.div key="reveal" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <WordReveal
              roles={roles}
              revealIndex={revealIndex}
              setRevealIndex={setRevealIndex}
              onDone={onRevealDone}
            />
          </motion.div>
        )}

        {screen === SCREENS.GAME && (
          <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <GamePlay
              roles={roles}
              onEliminate={onEliminate}
              onQuickReset={quickReset}
              onFullReset={fullReset}
              starterPlayer={starterPlayer}
            />
          </motion.div>
        )}

        {screen === SCREENS.RESULTS && (
          <motion.div key="results" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Results
              winner={winner}
              roles={roles}
              onQuickReset={quickReset}
              onFullReset={fullReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* ─── FOOTER ─── */}
      <footer style={{
        position: 'relative', zIndex: 20,
        padding: '24px 16px 32px',
        textAlign: 'center',
      }}>
        <div style={{
          maxWidth: 400, margin: '0 auto',
          padding: '20px 24px',
          background: 'rgba(15,23,42,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(51,65,85,0.4)',
          borderRadius: 20,
        }}>
          <div style={{
            height: 1, marginBottom: 16,
            background: 'linear-gradient(to right, transparent, #2dd4bf, #818cf8, transparent)',
            opacity: 0.4,
          }} />
          <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.8 }}>
            Made with <span style={{ color: '#f43f5e' }}>❤️</span> by
          </p>
          <p style={{
            color: '#e2e8f0', fontSize: 18, fontWeight: 800, margin: '4px 0 0',
            background: 'linear-gradient(135deg, #2dd4bf, #818cf8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.02em',
          }}>
            Chaker Lousra
          </p>
          <p style={{ color: '#475569', fontSize: 11, margin: '8px 0 0', letterSpacing: '0.05em' }}>
            © {new Date().getFullYear()} — ? Chkoune l'Imposter
          </p>
        </div>
      </footer>
    </div>
  )
}

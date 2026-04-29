import { useState, useCallback } from 'react'
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

function buildRoles(players, imposterCount, pair, hintsMode) {
  const citizenWord = pair.word || pair.wordA;
  const hint = pair.hint;

  // Assign imposter indices
  const indices = shuffle([...Array(players.length).keys()])
  const imposterIndices = new Set(indices.slice(0, imposterCount))

  return players.map((name, i) => ({
    name,
    isImposter: imposterIndices.has(i),
    word: imposterIndices.has(i) ? null : citizenWord,
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

  const getWordPair = (selectedCategories) => {
    const pool = gameData.categories.filter(c => selectedCategories.includes(c.id))

    // Logic to pick a different category if possible
    let availablePool = pool.filter(c => c.id !== lastCategory)
    if (availablePool.length === 0) availablePool = pool // Reset if all used or only one

    const category = availablePool[Math.floor(Math.random() * availablePool.length)]
    setLastCategory(category.id)

    const localPair = category.pairs[Math.floor(Math.random() * category.pairs.length)]
    return { word: localPair.wordA, hint: localPair.hint };
  }

  const startGame = (setupConfig) => {
    const { playerNames, selectedCategories, hintsMode, imposterCount } = setupConfig
    setConfig(setupConfig)
    setPlayers(playerNames)

    const pair = getWordPair(selectedCategories)
    const assigned = buildRoles(playerNames, imposterCount, pair, hintsMode)

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
    const assigned = buildRoles(config.playerNames, config.imposterCount, pair, config.hintsMode)
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

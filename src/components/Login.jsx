import { useState } from 'react'
import { PERFIS } from '../constants'

export default function Login({ onLogin }) {
  const [selected, setSelected] = useState(null)
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function selectPerfil(perfil) {
    setSelected(perfil)
    setPin('')
    setError(false)
  }

  function pressKey(key) {
    if (pin.length >= 4) return
    const next = pin + key
    setPin(next)
    setError(false)
    if (next.length === 4) {
      if (next === selected.pin) {
        onLogin(selected)
      } else {
        setError(true)
        setShake(true)
        setTimeout(() => { setShake(false); setPin('') }, 600)
      }
    }
  }

  function backspace() {
    setPin(p => p.slice(0, -1))
    setError(false)
  }

  const roleLabel = {
    oraculo:  '🔮 ORÁCULO',
    guardiao: '⚔ GUARDIÃO',
    jogador:  '★ JOGADOR',
  }

  const roleColor = {
    oraculo:  '#fbbf24',
    guardiao: '#60a5fa',
    jogador:  '#c084fc',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      background: '#080810',
    }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{ fontSize: '0.4rem', color: '#6b21a8', letterSpacing: 3, marginBottom: 8 }}>
          ★ SISTEMA DE EVOLUÇÃO ★
        </div>
        <div style={{ fontSize: '1.1rem', color: '#c084fc', textShadow: '0 0 20px #c084fc', lineHeight: 1.5 }}>
          GRIMÓRIO<br />
          <span style={{ color: '#fbbf24', textShadow: '0 0 20px #fbbf24' }}>DA EVOLUÇÃO</span>
        </div>
      </div>

      {!selected ? (
        <>
          <div style={{ fontSize: '0.4rem', color: '#4b5563', letterSpacing: 3, marginBottom: 16 }}>
            ESCOLHA SEU PERFIL
          </div>
          <div style={{ display: 'grid', gap: 12, width: '100%', maxWidth: 320 }}>
            {PERFIS.map(p => (
              <button key={p.id} onClick={() => selectPerfil(p)} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '16px 20px',
                background: '#0d0d1a',
                border: `2px solid ${roleColor[p.role]}44`,
                color: '#e2d9c5',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}>
                <div style={{ fontSize: '1.8rem' }}>{p.emoji}</div>
                <div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.6rem',
                    color: '#e2d9c5',
                    marginBottom: 4,
                  }}>{p.nome.toUpperCase()}</div>
                  <div style={{
                    fontFamily: "'Press Start 2P', monospace",
                    fontSize: '0.38rem',
                    color: roleColor[p.role],
                  }}>{roleLabel[p.role]}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div style={{
          background: '#0d0d1a',
          border: `3px solid ${error ? '#f87171' : roleColor[selected.role]}`,
          padding: 28,
          width: '100%', maxWidth: 320,
          textAlign: 'center',
          animation: shake ? 'shake 0.4s ease' : 'none',
          boxShadow: `0 0 30px ${error ? '#f8717144' : roleColor[selected.role] + '33'}`,
        }}>
          <div style={{ fontSize: '0.38rem', color: '#4b5563', marginBottom: 4, letterSpacing: 2 }}>
            ACESSANDO COMO
          </div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.65rem',
            color: roleColor[selected.role],
            textShadow: `0 0 10px ${roleColor[selected.role]}`,
            marginBottom: 4,
          }}>{selected.nome.toUpperCase()}</div>
          <div style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.38rem',
            color: '#4b5563',
            marginBottom: 24,
          }}>{roleLabel[selected.role]}</div>

          {/* PIN dots */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 24 }}>
            {[0,1,2,3].map(i => (
              <div key={i} style={{
                width: 20, height: 20,
                background: pin.length > i ? (error ? '#f87171' : roleColor[selected.role]) : '#1a1a2e',
                border: `2px solid ${pin.length > i ? (error ? '#f87171' : roleColor[selected.role]) : '#2a2a4a'}`,
                boxShadow: pin.length > i ? `0 0 8px ${error ? '#f87171' : roleColor[selected.role]}` : 'none',
                transition: 'all 0.1s',
              }} />
            ))}
          </div>

          {error && (
            <div style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.38rem', color: '#f87171',
              marginBottom: 16, letterSpacing: 1,
              animation: 'blink 0.4s 3',
            }}>✕ CÓDIGO INCORRETO</div>
          )}

          {/* Numpad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => pressKey(String(n))} style={{
                padding: '14px 0',
                background: '#0a0a14',
                border: '2px solid #1a1a2e',
                color: '#e2d9c5',
                fontFamily: "'Press Start 2P', monospace",
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}>{n}</button>
            ))}
            <div />
            <button onClick={() => pressKey('0')} style={{
              padding: '14px 0',
              background: '#0a0a14',
              border: '2px solid #1a1a2e',
              color: '#e2d9c5',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.7rem',
              cursor: 'pointer',
            }}>0</button>
            <button onClick={backspace} style={{
              padding: '14px 0',
              background: '#1a0303',
              border: '2px solid #7f1d1d',
              color: '#f87171',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.6rem',
              cursor: 'pointer',
            }}>←</button>
          </div>

          <button onClick={() => setSelected(null)} style={{
            padding: '8px 0', width: '100%',
            background: 'transparent',
            border: '1px solid #1a1a2e',
            color: '#4b5563',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.35rem',
            letterSpacing: 1,
            cursor: 'pointer',
          }}>← VOLTAR</button>
        </div>
      )}
    </div>
  )
}

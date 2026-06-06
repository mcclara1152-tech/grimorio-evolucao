import { useState, useEffect, useRef } from 'react'
import { RARITIES } from '../constants'

// ── PIXEL SPRITE ──────────────────────────────────────────────────────────────
export function PixelSprite({ level, size = 9 }) {
  const s = size
  const sprites = {
    0: { pixels: [
      [3,0,'#c084fc'],[4,0,'#c084fc'],
      [2,1,'#c084fc'],[3,1,'#c084fc'],[4,1,'#c084fc'],[5,1,'#c084fc'],
      [2,2,'#c084fc'],[3,2,'#f8d5b0'],[4,2,'#f8d5b0'],[5,2,'#c084fc'],
      [2,3,'#c084fc'],[3,3,'#f8d5b0'],[4,3,'#f8d5b0'],[5,3,'#c084fc'],
      [3,4,'#374151'],[4,4,'#374151'],
      [2,5,'#374151'],[3,5,'#374151'],[4,5,'#374151'],[5,5,'#374151'],
      [2,6,'#374151'],[5,6,'#374151'],
      [2,7,'#374151'],[5,7,'#374151'],
    ]},
    1: { pixels: [
      [3,0,'#60a5fa'],[4,0,'#60a5fa'],[5,0,'#fbbf24'],
      [2,1,'#60a5fa'],[3,1,'#60a5fa'],[4,1,'#60a5fa'],[5,1,'#60a5fa'],[6,1,'#fbbf24'],
      [2,2,'#60a5fa'],[3,2,'#f8d5b0'],[4,2,'#f8d5b0'],[5,2,'#60a5fa'],[6,2,'#4b5563'],
      [2,3,'#60a5fa'],[3,3,'#f8d5b0'],[4,3,'#f8d5b0'],[5,3,'#60a5fa'],[6,3,'#4b5563'],
      [3,4,'#1e40af'],[4,4,'#1e40af'],[6,4,'#4b5563'],
      [1,5,'#4b5563'],[2,5,'#1e40af'],[3,5,'#1e40af'],[4,5,'#1e40af'],[5,5,'#1e40af'],[6,5,'#4b5563'],
      [2,6,'#1e40af'],[5,6,'#1e40af'],[6,6,'#4b5563'],
      [2,7,'#1e40af'],[5,7,'#1e40af'],
    ]},
    2: { pixels: [
      [1,0,'#c084fc'],[3,0,'#c084fc'],[4,0,'#c084fc'],[6,0,'#c084fc'],
      [2,1,'#c084fc'],[3,1,'#c084fc'],[4,1,'#c084fc'],[5,1,'#c084fc'],
      [2,2,'#c084fc'],[3,2,'#f8d5b0'],[4,2,'#f8d5b0'],[5,2,'#c084fc'],
      [2,3,'#c084fc'],[3,3,'#f8d5b0'],[4,3,'#f8d5b0'],[5,3,'#c084fc'],
      [0,3,'#a78bfa'],[7,3,'#a78bfa'],
      [3,4,'#6b21a8'],[4,4,'#6b21a8'],
      [1,5,'#a78bfa'],[2,5,'#6b21a8'],[3,5,'#6b21a8'],[4,5,'#6b21a8'],[5,5,'#6b21a8'],[6,5,'#a78bfa'],
      [2,6,'#6b21a8'],[5,6,'#6b21a8'],
      [2,7,'#6b21a8'],[5,7,'#6b21a8'],
    ]},
    3: { pixels: [
      [3,0,'#fbbf24'],[4,0,'#fbbf24'],
      [2,1,'#fbbf24'],[3,1,'#fbbf24'],[4,1,'#fbbf24'],[5,1,'#fbbf24'],
      [2,2,'#fbbf24'],[3,2,'#f8d5b0'],[4,2,'#f8d5b0'],[5,2,'#fbbf24'],
      [2,3,'#fbbf24'],[3,3,'#f8d5b0'],[4,3,'#f8d5b0'],[5,3,'#fbbf24'],
      [3,4,'#92400e'],[4,4,'#92400e'],
      [0,4,'#fbbf24'],[7,4,'#fbbf24'],[0,5,'#fbbf24'],[7,5,'#fbbf24'],
      [1,5,'#92400e'],[2,5,'#92400e'],[3,5,'#92400e'],[4,5,'#92400e'],[5,5,'#92400e'],[6,5,'#92400e'],
      [2,6,'#92400e'],[5,6,'#92400e'],
      [2,7,'#92400e'],[5,7,'#92400e'],
    ]},
    4: { pixels: [
      [0,1,'#f87171'],[7,1,'#f87171'],
      [1,2,'#f87171'],[6,2,'#f87171'],
      [0,3,'#f87171'],[7,3,'#f87171'],
      [3,0,'#fbbf24'],[4,0,'#fbbf24'],
      [2,1,'#fbbf24'],[3,1,'#fbbf24'],[4,1,'#fbbf24'],[5,1,'#fbbf24'],
      [2,2,'#fbbf24'],[3,2,'#fff'],[4,2,'#fff'],[5,2,'#fbbf24'],
      [2,3,'#fbbf24'],[3,3,'#fff'],[4,3,'#fff'],[5,3,'#fbbf24'],
      [3,4,'#ef4444'],[4,4,'#ef4444'],
      [0,5,'#f87171'],[1,5,'#ef4444'],[2,5,'#ef4444'],[3,5,'#ef4444'],[4,5,'#ef4444'],[5,5,'#ef4444'],[6,5,'#ef4444'],[7,5,'#f87171'],
      [2,6,'#ef4444'],[5,6,'#ef4444'],
      [2,7,'#ef4444'],[5,7,'#ef4444'],
    ]},
  }
  const data = sprites[Math.min(level, 4)]
  const shadow = data.pixels.map(([x,y,c]) => `${x*s}px ${y*s}px 0 ${c}`).join(',')
  return (
    <div style={{ position: 'relative', width: 8*s, height: 8*s }}>
      <div style={{ position: 'absolute', width: s, height: s, boxShadow: shadow }} />
    </div>
  )
}

// ── CARD ART ──────────────────────────────────────────────────────────────────
export function CardArt({ type, size = 5 }) {
  const s = size
  const arts = {
    FLAME: [
      [2,0,'#fbbf24'],[2,1,'#f59e0b'],[3,1,'#fbbf24'],[1,2,'#f59e0b'],[2,2,'#fbbf24'],[3,2,'#f59e0b'],
      [1,3,'#ef4444'],[2,3,'#f59e0b'],[3,3,'#ef4444'],[0,4,'#ef4444'],[1,4,'#dc2626'],[2,4,'#ef4444'],[3,4,'#dc2626'],[4,4,'#ef4444'],
      [0,5,'#dc2626'],[1,5,'#ef4444'],[2,5,'#dc2626'],[3,5,'#ef4444'],[4,5,'#dc2626'],
    ],
    POTION: [
      [2,0,'#4b5563'],[3,0,'#4b5563'],[2,1,'#4b5563'],[3,1,'#4b5563'],
      [1,2,'#4b5563'],[2,2,'#4ade80'],[3,2,'#4ade80'],[4,2,'#4b5563'],
      [0,3,'#4b5563'],[1,3,'#86efac'],[2,3,'#4ade80'],[3,3,'#4ade80'],[4,3,'#86efac'],[5,3,'#4b5563'],
      [0,4,'#4b5563'],[1,4,'#4ade80'],[2,4,'#4ade80'],[3,4,'#4ade80'],[4,4,'#4ade80'],[5,4,'#4b5563'],
      [1,5,'#4b5563'],[2,5,'#4ade80'],[3,5,'#4ade80'],[4,5,'#4b5563'],
    ],
    CRYSTAL: [
      [2,0,'#bfdbfe'],[3,0,'#bfdbfe'],
      [1,1,'#60a5fa'],[2,1,'#bfdbfe'],[3,1,'#60a5fa'],[4,1,'#60a5fa'],
      [0,2,'#3b82f6'],[1,2,'#60a5fa'],[2,2,'#bfdbfe'],[3,2,'#60a5fa'],[4,2,'#3b82f6'],[5,2,'#60a5fa'],
      [0,3,'#2563eb'],[1,3,'#3b82f6'],[2,3,'#60a5fa'],[3,3,'#3b82f6'],[4,3,'#2563eb'],[5,3,'#3b82f6'],
      [1,4,'#2563eb'],[2,4,'#3b82f6'],[3,4,'#2563eb'],[4,4,'#3b82f6'],
      [2,5,'#1d4ed8'],[3,5,'#1d4ed8'],
    ],
    DRAGON: [
      [0,0,'#166534'],[4,0,'#166534'],
      [0,1,'#4ade80'],[1,1,'#166534'],[3,1,'#166534'],[4,1,'#4ade80'],
      [0,2,'#4ade80'],[1,2,'#4ade80'],[2,2,'#fbbf24'],[3,2,'#4ade80'],[4,2,'#4ade80'],
      [0,3,'#166534'],[1,3,'#4ade80'],[2,3,'#4ade80'],[3,3,'#4ade80'],[4,3,'#166534'],
      [1,4,'#166534'],[2,4,'#ef4444'],[3,4,'#166534'],
      [0,5,'#166534'],[2,5,'#166534'],[4,5,'#166534'],
      [0,6,'#4ade80'],[1,6,'#166534'],[3,6,'#166534'],[4,6,'#4ade80'],
    ],
    PHOENIX: [
      [2,0,'#fbbf24'],[3,0,'#fbbf24'],
      [1,1,'#f59e0b'],[2,1,'#fff'],[3,1,'#fff'],[4,1,'#f59e0b'],
      [0,2,'#ef4444'],[1,2,'#fbbf24'],[2,2,'#fff'],[3,2,'#fff'],[4,2,'#fbbf24'],[5,2,'#ef4444'],
      [0,3,'#dc2626'],[1,3,'#ef4444'],[2,3,'#fbbf24'],[3,3,'#fbbf24'],[4,3,'#ef4444'],[5,3,'#dc2626'],
      [0,4,'#f59e0b'],[1,4,'#fbbf24'],[2,4,'#ef4444'],[3,4,'#ef4444'],[4,4,'#fbbf24'],[5,4,'#f59e0b'],
      [1,5,'#f59e0b'],[2,5,'#fbbf24'],[3,5,'#fbbf24'],[4,5,'#f59e0b'],
      [2,6,'#ef4444'],[3,6,'#ef4444'],
    ],
    SKULL: [
      [2,0,'#6b7280'],[3,0,'#6b7280'],[4,0,'#6b7280'],
      [1,1,'#6b7280'],[2,1,'#9ca3af'],[3,1,'#9ca3af'],[4,1,'#9ca3af'],[5,1,'#6b7280'],
      [1,2,'#6b7280'],[2,2,'#fff'],[3,2,'#9ca3af'],[4,2,'#fff'],[5,2,'#6b7280'],
      [1,3,'#6b7280'],[2,3,'#374151'],[3,3,'#9ca3af'],[4,3,'#374151'],[5,3,'#6b7280'],
      [1,4,'#6b7280'],[2,4,'#9ca3af'],[3,4,'#9ca3af'],[4,4,'#9ca3af'],[5,4,'#6b7280'],
      [2,5,'#4b5563'],[3,5,'#6b7280'],[4,5,'#4b5563'],
      [2,6,'#374151'],[3,6,'#4b5563'],[4,6,'#374151'],
    ],
  }
  const art = arts[type] || arts.SKULL
  const shadow = art.map(([x,y,c]) => `${x*s}px ${y*s}px 0 ${c}`).join(',')
  return (
    <div style={{ position: 'relative', width: 6*s, height: 7*s, margin: '0 auto' }}>
      <div style={{ position: 'absolute', width: s, height: s, boxShadow: shadow }} />
    </div>
  )
}

// ── XP BLOCKS ─────────────────────────────────────────────────────────────────
export function XPBlocks({ pct, color }) {
  const total = 16
  const filled = Math.round((pct / 100) * total)
  return (
    <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 14, height: 14,
          background: i < filled ? color : '#1a1a2e',
          border: `2px solid ${i < filled ? color : '#2a2a4a'}`,
          boxShadow: i < filled ? `0 0 6px ${color}88` : 'none',
          transition: 'all 0.2s',
        }} />
      ))}
    </div>
  )
}

// ── PARTICLES ─────────────────────────────────────────────────────────────────
export function Particles({ trigger, color }) {
  const [particles, setParticles] = useState([])
  const prev = useRef(trigger)
  useEffect(() => {
    if (trigger !== prev.current) {
      prev.current = trigger
      const p = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 200 - 100,
        y: -(Math.random() * 80 + 20),
        size: Math.random() > 0.5 ? 6 : 4,
        color,
        delay: Math.random() * 0.3,
      }))
      setParticles(p)
      setTimeout(() => setParticles([]), 1200)
    }
  }, [trigger, color])
  return (
    <div style={{ position: 'absolute', top: '50%', left: '50%', pointerEvents: 'none', zIndex: 20 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute',
          width: p.size, height: p.size,
          background: p.color,
          left: p.x, top: p.y,
          animation: `pixel-burst 0.8s ${p.delay}s ease-out forwards`,
        }} />
      ))}
    </div>
  )
}

// ── LEVEL UP BANNER ───────────────────────────────────────────────────────────
export function LevelUpBanner({ show, levelName, color }) {
  if (!show) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#000000cc', pointerEvents: 'none',
    }}>
      <div style={{ textAlign: 'center', animation: 'levelup-pop 0.5s ease-out' }}>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '1.2rem', color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
          animation: 'blink 0.3s infinite',
          letterSpacing: 2, marginBottom: 12,
        }}>★ LEVEL UP! ★</div>
        <div style={{
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '0.6rem', color: '#e2d9c5', letterSpacing: 1,
        }}>{levelName}</div>
      </div>
    </div>
  )
}

// ── PIXEL BUTTON ──────────────────────────────────────────────────────────────
export function PixelBtn({ color, bg, border, onClick, children, fullWidth, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '8px 12px',
      background: disabled ? '#1a1a2e' : bg,
      border: `2px solid ${disabled ? '#2a2a4a' : border}`,
      color: disabled ? '#4b5563' : color,
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.38rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      letterSpacing: 1,
      width: fullWidth ? '100%' : 'auto',
      transition: 'all 0.1s',
    }}>{children}</button>
  )
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: `translateX(-50%) translateY(${toast.show ? 0 : 80}px)`,
      background: '#0a0a18',
      border: `2px solid ${toast.type === 'pos' ? '#fbbf24' : toast.type === 'neg' ? '#7f1d1d' : '#2a1a4a'}`,
      padding: '10px 18px',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '0.5rem',
      color: toast.type === 'pos' ? '#fbbf24' : toast.type === 'neg' ? '#f87171' : '#c084fc',
      letterSpacing: 1,
      transition: 'transform 0.3s cubic-bezier(.4,0,.2,1)',
      zIndex: 99,
      whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px #00000088',
    }}>{toast.msg}</div>
  )
}

// ── WISH CARD ─────────────────────────────────────────────────────────────────
export function WishCard({ wish, role, onApprove, onReject, onRedeem, currentXP }) {
  const rarity = wish.raridade ? RARITIES.find(r => r.key === wish.raridade) : null
  const canRedeem = wish.status === 'aprovado' && currentXP >= (wish.xp_custo || 0)

  return (
    <div style={{
      background: rarity ? rarity.bg : '#0d0d1a',
      border: `3px solid ${rarity ? rarity.border : '#2a2a4a'}`,
      position: 'relative',
      boxShadow: rarity ? `0 0 16px ${rarity.color}44` : 'none',
      outline: rarity ? `1px solid ${rarity.color}22` : 'none',
      outlineOffset: 3,
    }}>
      {/* Top bar */}
      <div style={{
        background: rarity ? rarity.border : '#1a1a2e',
        padding: '6px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.42rem', color: rarity ? rarity.color : '#6b7280' }}>
          {rarity ? rarity.label.toUpperCase() : '??? PENDENTE'}
        </div>
        {wish.xp_custo && (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.42rem', color: '#c084fc' }}>
            ⚡{wish.xp_custo}XP
          </div>
        )}
      </div>

      {/* Art */}
      <div style={{
        background: '#080810', padding: '16px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderTop: `2px solid ${rarity ? rarity.border : '#1a1a2e'}`,
        borderBottom: `2px solid ${rarity ? rarity.border : '#1a1a2e'}`,
        minHeight: 80,
      }}>
        {rarity ? <CardArt type={rarity.art} size={5} /> : (
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1.5rem', opacity: 0.2 }}>?</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.48rem', color: '#e2d9c5', marginBottom: 6, lineHeight: 1.6 }}>
          {wish.titulo}
        </div>
        {wish.descricao && (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', fontStyle: 'italic', marginBottom: 8, fontFamily: 'monospace' }}>
            "{wish.descricao}"
          </div>
        )}

        <div style={{
          display: 'inline-block', padding: '3px 6px', marginBottom: 8,
          background: wish.status === 'aprovado' ? '#05261888' : wish.status === 'rejeitado' ? '#2d050588' : wish.status === 'resgatado' ? '#1a0a2e88' : '#1a1a2e',
          border: `2px solid ${wish.status === 'aprovado' ? '#4ade80' : wish.status === 'rejeitado' ? '#f87171' : wish.status === 'resgatado' ? '#c084fc' : '#374151'}`,
          fontFamily: "'Press Start 2P', monospace", fontSize: '0.36rem',
          color: wish.status === 'aprovado' ? '#4ade80' : wish.status === 'rejeitado' ? '#f87171' : wish.status === 'resgatado' ? '#c084fc' : '#9ca3af',
        }}>
          {wish.status === 'pendente' ? '⏳ PENDENTE' : wish.status === 'aprovado' ? '★ APROVADO' : wish.status === 'resgatado' ? '✓ RESGATADO' : '✕ REJEITADO'}
        </div>

        {wish.motivo_rejeicao && (
          <div style={{ fontSize: '0.65rem', color: '#f87171', fontStyle: 'italic', padding: '6px 8px', background: '#2d050533', borderLeft: '3px solid #f87171', marginBottom: 8, fontFamily: 'monospace' }}>
            "{wish.motivo_rejeicao}"
          </div>
        )}

        {(role === 'oraculo' || role === 'guardiao') && wish.status === 'pendente' && (
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <PixelBtn color="#4ade80" bg="#031a08" border="#166534" onClick={() => onApprove(wish)} fullWidth>★ APROVAR</PixelBtn>
            <PixelBtn color="#f87171" bg="#2d0505" border="#7f1d1d" onClick={() => onReject(wish)} fullWidth>✕ REJEITAR</PixelBtn>
          </div>
        )}

        {role === 'jogador' && wish.status === 'aprovado' && (
          <PixelBtn
            color={canRedeem ? '#c084fc' : '#4b5563'}
            bg={canRedeem ? '#1a0533' : '#0d0d1a'}
            border={canRedeem ? '#6b21a8' : '#1f2937'}
            onClick={() => canRedeem && onRedeem(wish)}
            disabled={!canRedeem}
            fullWidth
          >
            {canRedeem ? '⚡ RESGATAR' : `⚡ FALTAM ${wish.xp_custo - currentXP}XP`}
          </PixelBtn>
        )}
      </div>

      {rarity && (
        <>
          <div style={{ position: 'absolute', top: 2, left: 2, width: 6, height: 6, background: rarity.color, opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, background: rarity.color, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 2, left: 2, width: 6, height: 6, background: rarity.color, opacity: 0.6 }} />
          <div style={{ position: 'absolute', bottom: 2, right: 2, width: 6, height: 6, background: rarity.color, opacity: 0.6 }} />
        </>
      )}
    </div>
  )
}

// ── PENALTY CARD ──────────────────────────────────────────────────────────────
export function PenaltyCard({ penalty, role, onConcluir }) {
  const colors = {
    leve:   { color: '#f59e0b', border: '#78350f', bg: '#1c0f00' },
    media:  { color: '#f87171', border: '#7f1d1d', bg: '#1a0303' },
    severa: { color: '#dc2626', border: '#991b1b', bg: '#1a0000' },
  }
  const c = colors[penalty.nivel] || colors.leve

  return (
    <div style={{
      background: c.bg,
      border: `3px solid ${c.border}`,
      padding: 0, position: 'relative',
      boxShadow: `0 0 12px ${c.color}33`,
    }}>
      <div style={{
        background: c.border, padding: '6px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.4rem', color: c.color }}>
          ⚠ {penalty.nivel.toUpperCase()}
        </div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.38rem', color: '#6b7280' }}>
          {penalty.tipo === 'automatica' ? 'AUTO' : 'MANUAL'}
        </div>
      </div>

      <div style={{ background: '#080810', padding: '16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 70, borderTop: `2px solid ${c.border}`, borderBottom: `2px solid ${c.border}` }}>
        <CardArt type="SKULL" size={5} />
      </div>

      <div style={{ padding: '10px 10px 12px' }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.48rem', color: '#e2d9c5', marginBottom: 8, lineHeight: 1.6 }}>
          {penalty.icone} {penalty.titulo}
        </div>
        <div style={{
          display: 'inline-block', padding: '3px 6px', marginBottom: 8,
          background: penalty.concluida ? '#05261888' : '#2d050588',
          border: `2px solid ${penalty.concluida ? '#4ade80' : c.border}`,
          fontFamily: "'Press Start 2P', monospace", fontSize: '0.36rem',
          color: penalty.concluida ? '#4ade80' : c.color,
        }}>
          {penalty.concluida ? '✓ CONCLUÍDA' : '⚠ PENDENTE'}
        </div>

        {(role === 'oraculo' || role === 'guardiao') && !penalty.concluida && (
          <PixelBtn color="#4ade80" bg="#031a08" border="#166534" onClick={() => onConcluir(penalty)} fullWidth>
            ✓ MARCAR CONCLUÍDA
          </PixelBtn>
        )}
      </div>

      <div style={{ position: 'absolute', top: 2, left: 2, width: 6, height: 6, background: c.color, opacity: 0.5 }} />
      <div style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6, background: c.color, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 2, left: 2, width: 6, height: 6, background: c.color, opacity: 0.5 }} />
      <div style={{ position: 'absolute', bottom: 2, right: 2, width: 6, height: 6, background: c.color, opacity: 0.5 }} />
    </div>
  )
}

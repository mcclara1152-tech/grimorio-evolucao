import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
import { LEVELS, PENALTY_THRESHOLDS, DEFAULT_PENALTIES } from './constants'
import Login from './components/Login'
import {
  PixelSprite, XPBlocks, Particles, LevelUpBanner,
  Toast, WishCard, PenaltyCard, PixelBtn, CardArt
} from './components/PixelComponents'

const FONT_LINK = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'

const CSS = `
  @import url('${FONT_LINK}');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    background: #080810; color: #e2d9c5;
    font-family: 'Press Start 2P', monospace;
    min-height: 100vh; image-rendering: pixelated;
  }
  body::after {
    content: ''; position: fixed; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px);
    pointer-events: none; z-index: 9999;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes pixel-burst {
    0% { transform: translate(0,0) scale(1); opacity: 1; }
    100% { transform: translate(var(--tx,0), -60px) scale(0); opacity: 0; }
  }
  @keyframes levelup-pop {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }
  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes glow-pulse { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; } }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-8px); } 40% { transform: translateX(8px); }
    60% { transform: translateX(-6px); } 80% { transform: translateX(6px); }
  }
  .sprite-float { animation: float 2s ease-in-out infinite; }
  .glow-anim { animation: glow-pulse 1.5s ease-in-out infinite; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #080810; }
  ::-webkit-scrollbar-thumb { background: #2a2a4a; }
  input, textarea, select { font-family: 'Press Start 2P', monospace !important; font-size: 0.5rem !important; }
`

function getLevelIndex(xp) {
  return LEVELS.findLastIndex(l => xp >= l.min)
}

function checkAutopenalty(xp, existingPenalties) {
  const active = existingPenalties.filter(p => !p.concluida && p.tipo === 'automatica')
  for (const threshold of PENALTY_THRESHOLDS) {
    if (xp <= threshold.limit) {
      const alreadyHas = active.some(p => p.nivel === threshold.level)
      if (!alreadyHas) return threshold
    }
  }
  return null
}

export default function App() {
  const [user, setUser] = useState(null)
  const [xp, setXp] = useState(0)
  const [acoes, setAcoes] = useState([])
  const [historico, setHistorico] = useState([])
  const [desejos, setDesejos] = useState([])
  const [penalidades, setPenalidades] = useState([])
  const [tab, setTab] = useState('acoes')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, msg: '', type: 'info' })
  const [levelUpShow, setLevelUpShow] = useState(false)
  const [levelUpName, setLevelUpName] = useState('')
  const [levelUpColor, setLevelUpColor] = useState('#c084fc')
  const [particleTrigger, setParticleTrigger] = useState(0)
  const [particleColor, setParticleColor] = useState('#c084fc')
  const [actionSubtab, setActionSubtab] = useState('positive')
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishForm, setWishForm] = useState({ titulo: '', descricao: '' })
  const [approveModal, setApproveModal] = useState(null)
  const [approveData, setApproveData] = useState({ xp_custo: 30, raridade: 'raro' })
  const [rejectModal, setRejectModal] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [showPenaltyModal, setShowPenaltyModal] = useState(false)
  const toastTimer = useRef(null)
  const prevLevelIdx = useRef(0)

  const isOraculo = user?.role === 'oraculo' || user?.role === 'guardiao'
  const levelIdx = getLevelIndex(xp)
  const level = LEVELS[levelIdx] || LEVELS[0]
  const nextLevel = LEVELS[levelIdx + 1]
  const progress = nextLevel ? ((xp - level.min) / (nextLevel.min - level.min)) * 100 : 100
  const pendingWishes = desejos.filter(d => d.status === 'pendente').length
  const activePenalties = penalidades.filter(p => !p.concluida).length

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = CSS
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  useEffect(() => {
    if (user) {
      loadData()
      if (user.role === 'jogador') setTab('desejos')
      else setTab('acoes')
    }
  }, [user])

  async function loadData() {
    setLoading(true)
    const [{ data: xpData }, { data: acoesData }, { data: histData }, { data: desejosData }, { data: penData }] = await Promise.all([
      supabase.from('xp').select('*').eq('jogador_id', '00000000-0000-0000-0000-000000000003').single(),
      supabase.from('acoes').select('*').eq('ativo', true).order('xp', { ascending: false }),
      supabase.from('historico').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('desejos').select('*').order('created_at', { ascending: false }),
      supabase.from('penalidades').select('*').order('created_at', { ascending: false }),
    ])
    if (xpData) setXp(xpData.total)
    if (acoesData) setAcoes(acoesData)
    if (histData) setHistorico(histData)
    if (desejosData) setDesejos(desejosData)
    if (penData) setPenalidades(penData)
    setLoading(false)
  }

  function showToast(msg, type = 'info') {
    clearTimeout(toastTimer.current)
    setToast({ show: true, msg, type })
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500)
  }

  async function applyAction(acao) {
    const newXp = Math.max(-99, xp + acao.xp)
    const newLevelIdx = getLevelIndex(newXp)

    if (newLevelIdx > prevLevelIdx.current && acao.xp > 0) {
      prevLevelIdx.current = newLevelIdx
      setLevelUpName(LEVELS[newLevelIdx].name)
      setLevelUpColor(LEVELS[newLevelIdx].color)
      setLevelUpShow(true)
      setTimeout(() => setLevelUpShow(false), 2500)
    }

    setParticleColor(acao.xp > 0 ? '#fbbf24' : '#f87171')
    setParticleTrigger(t => t + 1)
    setXp(newXp)

    await supabase.from('xp').update({ total: newXp, updated_at: new Date().toISOString() })
      .eq('jogador_id', '00000000-0000-0000-0000-000000000003')

    const histEntry = {
      acao_titulo: acao.titulo,
      xp: acao.xp,
      tipo: acao.tipo,
      aplicado_por: user.id,
      aplicado_por_nome: user.nome,
    }
    const { data: newHist } = await supabase.from('historico').insert(histEntry).select().single()
    if (newHist) setHistorico(h => [newHist, ...h])

    // Verificar penalidade automática
    const threshold = checkAutopenalty(newXp, penalidades)
    if (threshold) {
      const penalty = DEFAULT_PENALTIES.find(p => p.nivel === threshold.level)
      if (penalty) {
        const { data: newPen } = await supabase.from('penalidades').insert({
          titulo: penalty.titulo,
          icone: penalty.icone,
          nivel: penalty.nivel,
          tipo: 'automatica',
          concluida: false,
        }).select().single()
        if (newPen) {
          setPenalidades(p => [newPen, ...p])
          showToast(`⚠ ${threshold.label} ATIVADA!`, 'neg')
          return
        }
      }
    }

    showToast(acao.xp > 0 ? `+${acao.xp} XP!` : `${acao.xp} XP`, acao.xp > 0 ? 'pos' : 'neg')
  }

  async function submitWish() {
    if (!wishForm.titulo.trim()) return
    const { data } = await supabase.from('desejos').insert({
      titulo: wishForm.titulo,
      descricao: wishForm.descricao || null,
      status: 'pendente',
    }).select().single()
    if (data) setDesejos(d => [data, ...d])
    setWishForm({ titulo: '', descricao: '' })
    setShowWishForm(false)
    showToast('DESEJO ENVIADO! ✦', 'info')
  }

  async function approveWish() {
    const { data } = await supabase.from('desejos').update({
      status: 'aprovado',
      xp_custo: Number(approveData.xp_custo),
      raridade: approveData.raridade,
      updated_at: new Date().toISOString(),
    }).eq('id', approveModal.id).select().single()
    if (data) setDesejos(d => d.map(x => x.id === data.id ? data : x))
    setApproveModal(null)
    showToast('DESEJO APROVADO! ★', 'pos')
  }

  async function rejectWish() {
    const { data } = await supabase.from('desejos').update({
      status: 'rejeitado',
      motivo_rejeicao: rejectReason || null,
      updated_at: new Date().toISOString(),
    }).eq('id', rejectModal.id).select().single()
    if (data) setDesejos(d => d.map(x => x.id === data.id ? data : x))
    setRejectModal(null)
    setRejectReason('')
    showToast('DESEJO REJEITADO', 'neg')
  }

  async function redeemWish(wish) {
    if (xp < wish.xp_custo) return
    const newXp = xp - wish.xp_custo
    setXp(newXp)
    await supabase.from('xp').update({ total: newXp }).eq('jogador_id', '00000000-0000-0000-0000-000000000003')
    const { data } = await supabase.from('desejos').update({ status: 'resgatado', updated_at: new Date().toISOString() }).eq('id', wish.id).select().single()
    if (data) setDesejos(d => d.map(x => x.id === data.id ? data : x))
    await supabase.from('historico').insert({ acao_titulo: `Resgatou: ${wish.titulo}`, xp: -wish.xp_custo, tipo: 'negative', aplicado_por: user.id, aplicado_por_nome: user.nome })
    setParticleColor('#fbbf24')
    setParticleTrigger(t => t + 1)
    showToast('DESEJO RESGATADO! ★', 'pos')
  }

  async function applyManualPenalty(penalty) {
    const { data } = await supabase.from('penalidades').insert({
      titulo: penalty.titulo,
      icone: penalty.icone,
      nivel: penalty.nivel,
      tipo: 'manual',
      concluida: false,
    }).select().single()
    if (data) setPenalidades(p => [data, ...p])
    setShowPenaltyModal(false)
    showToast(`⚠ PENALIDADE APLICADA!`, 'neg')
  }

  async function concluirPenalty(penalty) {
    const { data } = await supabase.from('penalidades').update({ concluida: true }).eq('id', penalty.id).select().single()
    if (data) setPenalidades(p => p.map(x => x.id === data.id ? data : x))
    showToast('✓ PENALIDADE CONCLUÍDA', 'pos')
  }

  const roleColor = { oraculo: '#fbbf24', guardiao: '#60a5fa', jogador: '#c084fc' }
  const roleLabel = { oraculo: '🔮 ORÁCULO', guardiao: '⚔ GUARDIÃO', jogador: '★ JOGADOR' }

  if (!user) return <Login onLogin={setUser} />

  return (
    <div style={{ maxWidth: 430, margin: '0 auto', padding: '0 0 80px', position: 'relative', minHeight: '100vh' }}>
      <LevelUpBanner show={levelUpShow} levelName={levelUpName} color={levelUpColor} />

      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #0d0620 0%, #080810 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', padding: '20px 16px 12px', borderBottom: '3px solid #1a1a2e' }}>
          <div style={{ fontSize: '0.4rem', color: '#6b21a8', letterSpacing: 3, marginBottom: 6 }}>★ SISTEMA DE EVOLUÇÃO ★</div>
          <div style={{ fontSize: '0.9rem', color: '#c084fc', textShadow: '0 0 20px #c084fc', lineHeight: 1.5 }}>
            GRIMÓRIO<br /><span style={{ color: '#fbbf24', textShadow: '0 0 20px #fbbf24' }}>DA EVOLUÇÃO</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.38rem', color: roleColor[user.role] }}>
              {roleLabel[user.role]} {user.nome.toUpperCase()}
            </div>
            <button onClick={() => setUser(null)} style={{
              padding: '4px 8px', background: 'transparent',
              border: '1px solid #1a1a2e', color: '#4b5563',
              fontFamily: "'Press Start 2P', monospace", fontSize: '0.3rem', cursor: 'pointer',
            }}>SAIR</button>
          </div>
        </div>

        {/* XP CARD */}
        <div style={{ background: '#0a0a18', borderBottom: '3px solid #1a1a2e', padding: '20px 16px', display: 'flex', gap: 16, alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ flexShrink: 0, position: 'relative' }}>
            <div className="sprite-float"><PixelSprite level={levelIdx} size={9} /></div>
            <Particles trigger={particleTrigger} color={particleColor} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="glow-anim" style={{ fontSize: '0.38rem', color: level.color, letterSpacing: 2, marginBottom: 4, textShadow: `0 0 8px ${level.color}` }}>
              ★ {level.name.toUpperCase()}
            </div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '2.2rem', color: '#e2d9c5', lineHeight: 1, textShadow: `0 0 20px ${level.color}66`, marginBottom: 4 }}>
              {xp}
            </div>
            <div style={{ fontSize: '0.32rem', color: '#4b5563', letterSpacing: 1, marginBottom: 10 }}>PONTOS DE XP</div>
            <XPBlocks pct={progress} color={level.color} />
            {nextLevel && <div style={{ fontSize: '0.3rem', color: '#4b5563', marginTop: 6 }}>PRÓXIMO: {nextLevel.name.toUpperCase()} ({nextLevel.min - xp}XP)</div>}
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', borderBottom: '3px solid #1a1a2e', background: '#0a0a14', overflowX: 'auto' }}>
          {(isOraculo ? [
            { key: 'acoes',      label: '⚔ AÇÕES' },
            { key: 'desejos',    label: `★ DESEJOS${pendingWishes > 0 ? ` (${pendingWishes})` : ''}` },
            { key: 'penalidades',label: `⚠ PENAS${activePenalties > 0 ? ` (${activePenalties})` : ''}` },
            { key: 'historico',  label: '📜 LOG' },
          ] : [
            { key: 'desejos',    label: '★ DESEJOS' },
            { key: 'penalidades',label: `⚠ PENAS${activePenalties > 0 ? ` (${activePenalties})` : ''}` },
            { key: 'historico',  label: '📜 LOG' },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, padding: '11px 4px',
              background: tab === t.key ? '#140a2e' : 'transparent',
              border: 'none',
              borderBottom: `3px solid ${tab === t.key ? '#c084fc' : 'transparent'}`,
              color: tab === t.key ? '#c084fc' : '#4b5563',
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '0.34rem', letterSpacing: 0.5,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── AÇÕES ── */}
        {tab === 'acoes' && isOraculo && (
          <div style={{ padding: '16px 12px' }}>
            <div style={{ display: 'flex', gap: 0, marginBottom: 14, border: '2px solid #1a1a2e' }}>
              {[{ key: 'positive', label: '+ BÔNUS', color: '#fbbf24' }, { key: 'negative', label: '− PENALIDADE', color: '#f87171' }].map(st => (
                <button key={st.key} onClick={() => setActionSubtab(st.key)} style={{
                  flex: 1, padding: '9px 4px', background: actionSubtab === st.key ? '#0d1a0d' : 'transparent',
                  border: 'none', color: actionSubtab === st.key ? st.color : '#4b5563',
                  fontFamily: "'Press Start 2P', monospace", fontSize: '0.38rem', letterSpacing: 0.5,
                  cursor: 'pointer', borderBottom: `2px solid ${actionSubtab === st.key ? st.color : 'transparent'}`,
                }}>{st.label}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {acoes.filter(a => a.tipo === actionSubtab).map(acao => (
                <button key={acao.id} onClick={() => applyAction(acao)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 12px',
                  background: acao.tipo === 'positive' ? '#1a1400' : '#1a0303',
                  border: `2px solid ${acao.tipo === 'positive' ? '#fbbf24' : '#7f1d1d'}`,
                  color: '#e2d9c5', cursor: 'pointer', textAlign: 'left', width: '100%',
                }}>
                  <div style={{ fontSize: '1.3rem', flexShrink: 0 }}>{acao.icone}</div>
                  <div style={{ flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: '0.4rem', lineHeight: 1.8, color: '#c4b5a0' }}>{acao.titulo}</div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', color: acao.tipo === 'positive' ? '#fbbf24' : '#f87171', textShadow: `0 0 8px ${acao.tipo === 'positive' ? '#fbbf24' : '#f87171'}`, flexShrink: 0 }}>
                    {acao.xp > 0 ? `+${acao.xp}` : acao.xp}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── DESEJOS ── */}
        {tab === 'desejos' && (
          <div style={{ padding: '16px 12px' }}>
            {!isOraculo && (
              showWishForm ? (
                <div style={{ background: '#0a0a18', border: '2px solid #2a1a4a', padding: 16, marginBottom: 14 }}>
                  <div style={{ fontSize: '0.4rem', color: '#c084fc', letterSpacing: 2, marginBottom: 12 }}>★ NOVO DESEJO</div>
                  <input placeholder="O QUE VOCÊ DESEJA?" value={wishForm.titulo} onChange={e => setWishForm(f => ({ ...f, titulo: e.target.value }))}
                    style={{ display: 'block', width: '100%', background: '#080810', border: '2px solid #1a1a2e', color: '#e2d9c5', padding: '10px 8px', marginBottom: 8 }} />
                  <textarea placeholder="DESCREVA... (OPCIONAL)" value={wishForm.descricao} onChange={e => setWishForm(f => ({ ...f, descricao: e.target.value }))} rows={3}
                    style={{ display: 'block', width: '100%', background: '#080810', border: '2px solid #1a1a2e', color: '#e2d9c5', padding: '10px 8px', marginBottom: 10, resize: 'none' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <PixelBtn color="#c084fc" bg="#1a0533" border="#6b21a8" onClick={submitWish} fullWidth>★ ENVIAR</PixelBtn>
                    <PixelBtn color="#6b7280" bg="#0d0d1a" border="#374151" onClick={() => setShowWishForm(false)} fullWidth>CANCELAR</PixelBtn>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowWishForm(true)} style={{
                  display: 'block', width: '100%', marginBottom: 14, padding: 12,
                  background: '#0a0a18', border: '2px solid #2a1a4a', color: '#c084fc',
                  fontFamily: "'Press Start 2P', monospace", fontSize: '0.42rem', cursor: 'pointer',
                }}>★ ADICIONAR DESEJO</button>
              )
            )}
            <div style={{ fontSize: '0.36rem', color: '#4b5563', letterSpacing: 3, marginBottom: 12 }}>── CARTAS DE DESEJO ──</div>
            <div style={{ display: 'grid', gap: 14 }}>
              {desejos.map(d => (
                <WishCard key={d.id} wish={d} role={user.role}
                  onApprove={w => { setApproveModal(w); setApproveData({ xp_custo: 30, raridade: 'raro' }) }}
                  onReject={w => { setRejectModal(w); setRejectReason('') }}
                  onRedeem={redeemWish} currentXP={xp} />
              ))}
            </div>
          </div>
        )}

        {/* ── PENALIDADES ── */}
        {tab === 'penalidades' && (
          <div style={{ padding: '16px 12px' }}>
            {isOraculo && (
              <button onClick={() => setShowPenaltyModal(true)} style={{
                display: 'block', width: '100%', marginBottom: 14, padding: 12,
                background: '#1a0303', border: '2px solid #7f1d1d', color: '#f87171',
                fontFamily: "'Press Start 2P', monospace", fontSize: '0.4rem', cursor: 'pointer',
              }}>⚠ APLICAR PENALIDADE</button>
            )}
            <div style={{ fontSize: '0.36rem', color: '#4b5563', letterSpacing: 3, marginBottom: 12 }}>── PENALIDADES ATIVAS ──</div>
            {penalidades.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', fontSize: '0.38rem', color: '#2a2a4a' }}>NENHUMA PENALIDADE</div>
            )}
            <div style={{ display: 'grid', gap: 14 }}>
              {penalidades.map(p => (
                <PenaltyCard key={p.id} penalty={p} role={user.role} onConcluir={concluirPenalty} />
              ))}
            </div>
          </div>
        )}

        {/* ── HISTÓRICO ── */}
        {tab === 'historico' && (
          <div style={{ padding: '16px 12px' }}>
            <div style={{ fontSize: '0.36rem', color: '#4b5563', letterSpacing: 3, marginBottom: 12 }}>── REGISTRO DE BATALHAS ──</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {historico.map(item => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 12px', background: '#0a0a14',
                  border: `2px solid ${item.xp > 0 ? '#fbbf2444' : '#7f1d1d44'}`,
                }}>
                  <div style={{ width: 8, height: 8, flexShrink: 0, background: item.xp > 0 ? '#fbbf24' : '#f87171', boxShadow: `0 0 6px ${item.xp > 0 ? '#fbbf24' : '#f87171'}` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.36rem', color: '#c4b5a0', lineHeight: 1.8 }}>{item.acao_titulo}</div>
                    <div style={{ fontSize: '0.3rem', color: '#4b5563', marginTop: 2 }}>{item.aplicado_por_nome} · {new Date(item.created_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', color: item.xp > 0 ? '#fbbf24' : '#f87171', textShadow: `0 0 6px ${item.xp > 0 ? '#fbbf24' : '#f87171'}` }}>
                    {item.xp > 0 ? `+${item.xp}` : item.xp}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* APPROVE MODAL */}
      {approveModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 50, display: 'flex', alignItems: 'flex-end', padding: 16 }} onClick={() => setApproveModal(null)}>
          <div style={{ background: '#0a0a18', border: '3px solid #2a1a4a', padding: 20, width: '100%', maxWidth: 430, margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '0.5rem', color: '#c084fc', marginBottom: 16, lineHeight: 2 }}>APROVAR:<br /><span style={{ color: '#e2d9c5' }}>{approveModal.titulo}</span></div>
            <div style={{ fontSize: '0.36rem', color: '#6b7280', marginBottom: 8 }}>RARIDADE:</div>
            <select value={approveData.raridade} onChange={e => setApproveData(d => ({ ...d, raridade: e.target.value }))}
              style={{ display: 'block', width: '100%', background: '#080810', border: '2px solid #1a1a2e', color: '#e2d9c5', padding: '10px 8px', marginBottom: 12 }}>
              {[{key:'comum',label:'Comum (15 XP)'},{key:'incomum',label:'Incomum (25 XP)'},{key:'raro',label:'Raro (40 XP)'},{key:'epico',label:'Épico (60 XP)'},{key:'lendario',label:'Lendário (90 XP)'}].map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
            <div style={{ fontSize: '0.36rem', color: '#6b7280', marginBottom: 8 }}>XP PARA RESGATAR:</div>
            <input type="number" value={approveData.xp_custo} onChange={e => setApproveData(d => ({ ...d, xp_custo: e.target.value }))}
              style={{ display: 'block', width: '100%', background: '#080810', border: '2px solid #1a1a2e', color: '#e2d9c5', padding: '10px 8px', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <PixelBtn color="#4ade80" bg="#031a08" border="#14532d" onClick={approveWish} fullWidth>★ CONFIRMAR</PixelBtn>
              <PixelBtn color="#6b7280" bg="#0d0d1a" border="#374151" onClick={() => setApproveModal(null)} fullWidth>CANCELAR</PixelBtn>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 50, display: 'flex', alignItems: 'flex-end', padding: 16 }} onClick={() => setRejectModal(null)}>
          <div style={{ background: '#0a0a18', border: '3px solid #7f1d1d', padding: 20, width: '100%', maxWidth: 430, margin: '0 auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '0.5rem', color: '#f87171', marginBottom: 16, lineHeight: 2 }}>REJEITAR:<br /><span style={{ color: '#e2d9c5' }}>{rejectModal.titulo}</span></div>
            <input placeholder="MOTIVO (OPCIONAL)" value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              style={{ display: 'block', width: '100%', background: '#080810', border: '2px solid #1a1a2e', color: '#e2d9c5', padding: '10px 8px', marginBottom: 14 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <PixelBtn color="#f87171" bg="#1a0303" border="#7f1d1d" onClick={rejectWish} fullWidth>✕ CONFIRMAR</PixelBtn>
              <PixelBtn color="#6b7280" bg="#0d0d1a" border="#374151" onClick={() => setRejectModal(null)} fullWidth>CANCELAR</PixelBtn>
            </div>
          </div>
        </div>
      )}

      {/* PENALTY MODAL */}
      {showPenaltyModal && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000dd', zIndex: 50, display: 'flex', alignItems: 'flex-end', padding: 16 }} onClick={() => setShowPenaltyModal(false)}>
          <div style={{ background: '#0a0a18', border: '3px solid #7f1d1d', padding: 20, width: '100%', maxWidth: 430, margin: '0 auto', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '0.5rem', color: '#f87171', marginBottom: 16 }}>⚠ APLICAR PENALIDADE</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {DEFAULT_PENALTIES.map(p => {
                const colors = { leve: '#f59e0b', media: '#f87171', severa: '#dc2626' }
                return (
                  <button key={p.id} onClick={() => applyManualPenalty(p)} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    background: '#1a0303', border: `2px solid ${colors[p.nivel]}44`,
                    color: '#e2d9c5', cursor: 'pointer', textAlign: 'left', width: '100%',
                  }}>
                    <div style={{ fontSize: '1.2rem' }}>{p.icone}</div>
                    <div style={{ flex: 1, fontFamily: "'Press Start 2P', monospace", fontSize: '0.38rem', lineHeight: 1.8, color: '#c4b5a0' }}>{p.titulo}</div>
                    <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.38rem', color: colors[p.nivel] }}>{p.nivel.toUpperCase()}</div>
                  </button>
                )
              })}
            </div>
            <div style={{ marginTop: 12 }}>
              <PixelBtn color="#6b7280" bg="#0d0d1a" border="#374151" onClick={() => setShowPenaltyModal(false)} fullWidth>CANCELAR</PixelBtn>
            </div>
          </div>
        </div>
      )}

      <Toast toast={toast} />
    </div>
  )
}

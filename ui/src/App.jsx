// Sovereign Notify — county-wide notification HUD (origin: Storyworks K4)
// Renders the owner-approved baseline: objective slips (parchment telegram,
// "New Objective" + seal — no County Wire, owner amendment 2026-07-12),
// progress ticks (quiet dark chips), mission cards (top-center document
// header, never full-screen). Presentation comes from config_notifications.lua
// via the client bridge; players get what the server sets.

import { useEffect, useReducer, useRef } from 'react'

const DEFAULTS = {
  anchor: 'top-right',
  scale: 1.0,
  durations: { objective: 7000, tick: 2600, cardStarted: 3800, cardEnd: 5000 },
  maxSlips: 3,
}

let nextId = 1

function reducer(state, action) {
  switch (action.type) {
    case 'config':
      return { ...state, config: { ...state.config, ...action.config } }
    case 'objective': {
      const slips = [{ id: nextId++, text: action.text }, ...state.slips]
      return { ...state, slips: slips.slice(0, state.config.maxSlips) }
    }
    case 'tick':
      return { ...state, tick: { id: nextId++, text: action.text } }
    case 'card':
      return { ...state, card: { id: nextId++, variant: action.variant, title: action.title, body: action.body } }
    case 'subtitle':
      return { ...state, subtitle: { id: nextId++, speaker: action.speaker, text: action.text, ms: action.ms } }
    case 'expire-subtitle':
      return state.subtitle && state.subtitle.id === action.id ? { ...state, subtitle: null } : state
    case 'expire-slip':
      return { ...state, slips: state.slips.filter(s => s.id !== action.id) }
    case 'expire-tick':
      return state.tick && state.tick.id === action.id ? { ...state, tick: null } : state
    case 'expire-card':
      return state.card && state.card.id === action.id ? { ...state, card: null } : state
    default:
      return state
  }
}

function useExpiry(item, ms, dispatch, expireType) {
  const timer = useRef(null)
  useEffect(() => {
    if (!item) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => dispatch({ type: expireType, id: item.id }), ms)
    return () => clearTimeout(timer.current)
  }, [item, ms, dispatch, expireType])
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, {
    config: DEFAULTS,
    slips: [],
    tick: null,
    card: null,
    subtitle: null,
  })

  useEffect(() => {
    const onMessage = (event) => {
      const data = event.data
      if (!data || typeof data.type !== 'string') return
      if (data.type === 'sn:config') dispatch({ type: 'config', config: data.config || {} })
      if (data.type === 'sn:objective') dispatch({ type: 'objective', text: data.text })
      if (data.type === 'sn:tick') dispatch({ type: 'tick', text: data.text })
      if (data.type === 'sn:card') dispatch({ type: 'card', variant: data.variant, title: data.title, body: data.body })
      if (data.type === 'sn:subtitle') dispatch({ type: 'subtitle', speaker: data.speaker, text: data.text, ms: data.ms })
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  const { config, slips, tick, card, subtitle } = state
  const d = { ...DEFAULTS.durations, ...config.durations }

  useExpiry(tick, d.tick, dispatch, 'expire-tick')
  useExpiry(card, card && card.variant === 'started' ? d.cardStarted : d.cardEnd, dispatch, 'expire-card')
  useExpiry(subtitle, (subtitle && subtitle.ms) || d.subtitle || 3500, dispatch, 'expire-subtitle')

  return (
    <div className="k4-root" style={{ '--k4-scale': config.scale }}>
      <div className={`k4-stack ${config.anchor}`}>
        {slips.map(slip => (
          <Slip key={slip.id} slip={slip} duration={d.objective} dispatch={dispatch} />
        ))}
        {tick && <div className="k4-tick" key={tick.id}>{tick.text}</div>}
      </div>
      {card && (
        <div className={`k4-card ${card.variant}`} key={card.id}>
          <div className="title">{card.title}</div>
          <div className="rule" />
          {card.body ? <div className="body">{card.body}</div> : null}
        </div>
      )}
      {subtitle && (
        <div className="k4-subtitle" key={subtitle.id}>
          {subtitle.speaker ? <span className="who">{subtitle.speaker}</span> : null}
          <span className="line">{subtitle.text}</span>
        </div>
      )}
    </div>
  )
}

function Slip({ slip, duration, dispatch }) {
  useExpiry(slip, duration, dispatch, 'expire-slip')
  return (
    <div className="k4-slip">
      <div className="head">
        <span>New Objective</span>
        <span className="seal" />
      </div>
      <div className="body">{slip.text}</div>
    </div>
  )
}

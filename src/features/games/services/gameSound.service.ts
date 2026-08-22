/**
 * Web Audio API synthesizer for retro coding arcade sound effects
 * 100% offline, zero external sound asset dependencies.
 */

class GameSoundService {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  constructor() {
    // Load mute preference from localStorage
    const saved = localStorage.getItem('codetutor_game_sound')
    if (saved !== null) {
      this.enabled = saved === 'true'
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled
    localStorage.setItem('codetutor_game_sound', String(this.enabled))
    if (this.enabled) {
      this.playBeep(523.25, 0.08, 'sine') // high C beep confirm
    }
    return this.enabled
  }

  public playKeyStroke() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(440 + Math.random() * 80, ctx.currentTime)
      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } catch {
      // safe fallback
    }
  }

  public playSuccess() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      // Arpeggio chord (C5 -> E5 -> G5)
      ;[523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.07)
        gain.gain.setValueAtTime(0.1, now + i * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.15)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.07)
        osc.stop(now + i * 0.07 + 0.15)
      })
    } catch {
      // safe fallback
    }
  }

  public playCombo() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      ;[587.33, 739.99, 880.0, 1174.66].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'square'
        osc.frequency.setValueAtTime(freq, now + i * 0.05)
        gain.gain.setValueAtTime(0.08, now + i * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.12)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.05)
        osc.stop(now + i * 0.05 + 0.12)
      })
    } catch {
      // safe fallback
    }
  }

  public playError() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(160, now)
      osc.frequency.linearRampToValueAtTime(90, now + 0.18)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.18)
    } catch {
      // safe fallback
    }
  }

  public playTick() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.03)
    } catch {
      // safe fallback
    }
  }

  public playGameOver() {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const now = ctx.currentTime
      ;[392.0, 369.99, 349.23, 311.13].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.1)
        gain.gain.setValueAtTime(0.12, now + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.1)
        osc.stop(now + i * 0.1 + 0.2)
      })
    } catch {
      // safe fallback
    }
  }

  private playBeep(freq: number, duration: number, type: OscillatorType) {
    const ctx = this.getContext()
    if (!ctx) return
    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + duration)
    } catch {
      // safe fallback
    }
  }
}

export const gameSound = new GameSoundService()

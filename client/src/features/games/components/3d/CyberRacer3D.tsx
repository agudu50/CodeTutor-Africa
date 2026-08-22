import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface CyberRacer3DProps {
  progressPercent: number // 0 to 100%
  wpm: number
  hasError: boolean
  isCompleted: boolean
  className?: string
}

export const CyberRacer3D: React.FC<CyberRacer3DProps> = ({
  progressPercent,
  wpm,
  hasError,
  isCompleted,
  className = '',
}) => {
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const progressRef = useRef(progressPercent)
  const wpmRef = useRef(wpm)
  const errorRef = useRef(hasError)
  const completedRef = useRef(isCompleted)
  const isDarkRef = useRef(isDark)

  progressRef.current = progressPercent
  wpmRef.current = wpm
  errorRef.current = hasError
  completedRef.current = isCompleted
  isDarkRef.current = isDark

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 140

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(isDark ? 0x020617 : 0xf1f5f9, 0.08)

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 1.8, 4.5)
    camera.lookAt(0, 0.5, -2)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 1.3)
    scene.add(ambient)

    const headLight = new THREE.PointLight(0x10b981, isDark ? 3 : 2, 20)
    scene.add(headLight)

    // 3D Neon Road Track Grid
    const trackWidth = 4
    const trackLength = 40
    const gridColor1 = isDark ? 0x10b981 : 0x059669
    const gridColor2 = isDark ? 0x1e293b : 0xcbd5e1
    const gridHelper = new THREE.GridHelper(trackLength, 20, gridColor1, gridColor2)
    gridHelper.position.set(0, 0, -trackLength / 2 + 5)
    gridHelper.scale.set(trackWidth / 20, 1, 1)
    scene.add(gridHelper)

    // Track Guardrails
    const railMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x059669 : 0x0d9488,
      wireframe: true,
    })
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, trackLength), railMat)
    leftRail.position.set(-trackWidth / 2 - 0.1, 0.2, -trackLength / 2 + 5)
    scene.add(leftRail)

    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, trackLength), railMat)
    rightRail.position.set(trackWidth / 2 + 0.1, 0.2, -trackLength / 2 + 5)
    scene.add(rightRail)

    // 3D Cyber Racer Pod (Player's typing vehicle)
    const racerGroup = new THREE.Group()

    // Pod Body
    const bodyGeo = new THREE.ConeGeometry(0.5, 1.2, 4)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      metalness: 0.8,
      roughness: 0.2,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.rotation.x = Math.PI / 2
    body.rotation.z = Math.PI
    racerGroup.add(body)

    // Thruster Glow
    const thrusterGeo = new THREE.CylinderGeometry(0.15, 0.25, 0.4, 8)
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    const thruster = new THREE.Mesh(thrusterGeo, thrusterMat)
    thruster.rotation.x = Math.PI / 2
    thruster.position.set(0, 0, 0.6)
    racerGroup.add(thruster)

    // Thruster Particle Tail
    const exhaustCount = 30
    const exhaustPos = new Float32Array(exhaustCount * 3)
    for (let i = 0; i < exhaustCount * 3; i++) {
      exhaustPos[i] = (Math.random() - 0.5) * 0.3
    }
    const exhaustGeo = new THREE.BufferGeometry()
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPos, 3))
    const exhaustMat = new THREE.PointsMaterial({
      size: 0.08,
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.9,
    })
    const exhaustParticles = new THREE.Points(exhaustGeo, exhaustMat)
    exhaustParticles.position.set(0, 0, 0.8)
    racerGroup.add(exhaustParticles)

    racerGroup.position.set(0, 0.3, 2)
    scene.add(racerGroup)

    // Finish Line Arch
    const archMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: true })
    const arch = new THREE.Mesh(new THREE.TorusGeometry(2, 0.1, 8, 16, Math.PI), archMat)
    arch.position.set(0, 0, -20)
    scene.add(arch)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const progress = progressRef.current / 100 // 0 to 1
      const isErr = errorRef.current
      const isDone = completedRef.current
      const curWpm = wpmRef.current

      // Target position along track: from z = 2 (start) down to z = -20 (finish line)
      const targetZ = 2 - progress * 22
      racerGroup.position.z += (targetZ - racerGroup.position.z) * 0.1

      // Hover bobbing
      racerGroup.position.y = 0.3 + Math.sin(t * 8) * 0.04

      // Color and visual feedback according to game logic
      if (isErr) {
        bodyMat.color.setHex(0xf43f5e) // red alert on typo
        thrusterMat.color.setHex(0xf43f5e)
        exhaustMat.color.setHex(0xf43f5e)
        racerGroup.rotation.z = Math.sin(t * 30) * 0.15 // shake on typo
        headLight.color.setHex(0xf43f5e)
      } else if (isDone) {
        bodyMat.color.setHex(0xf59e0b) // gold on finish
        thrusterMat.color.setHex(0x10b981)
        exhaustMat.color.setHex(0x34d399)
        racerGroup.rotation.y = t * 2 // victory spin
        headLight.color.setHex(0xf59e0b)
      } else {
        bodyMat.color.setHex(0x10b981) // emerald normal
        thrusterMat.color.setHex(0xf59e0b)
        exhaustMat.color.setHex(0xf59e0b)
        racerGroup.rotation.z = Math.sin(t * 4) * 0.05
        racerGroup.rotation.y = 0
        headLight.color.setHex(0x10b981)
      }

      // Thruster flame scale scales with typing WPM
      const flameScale = Math.max(0.6, Math.min(2.5, curWpm / 35))
      thruster.scale.set(flameScale, flameScale, flameScale * 1.5)

      // Move camera smoothly behind vehicle
      camera.position.z = racerGroup.position.z + 3.2
      camera.position.y = racerGroup.position.y + 1.2
      camera.lookAt(racerGroup.position.x, racerGroup.position.y + 0.3, racerGroup.position.z - 4)

      headLight.position.copy(racerGroup.position)
      headLight.position.y += 0.5

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      bodyGeo.dispose()
      bodyMat.dispose()
      thrusterGeo.dispose()
      thrusterMat.dispose()
      exhaustGeo.dispose()
      exhaustMat.dispose()
      archMat.dispose()
      renderer.dispose()
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-28 sm:h-32 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner ${className}`}
      aria-hidden="true"
    />
  )
}

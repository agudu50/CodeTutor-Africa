import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface CyberRacer3DProps {
  progressPercent: number
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

    const width = container.clientWidth || 600
    const height = container.clientHeight || 220

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(isDark ? 0x000510 : 0x0a0f1e, 0.04)
    scene.background = new THREE.Color(isDark ? 0x000510 : 0x050b1a)

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(0, 2.5, 6)
    camera.lookAt(0, 0.5, -5)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    // === LIGHTING ===
    const ambient = new THREE.AmbientLight(0x1a2a4a, 2.0)
    scene.add(ambient)

    const sunLight = new THREE.DirectionalLight(0x00ffcc, 1.5)
    sunLight.position.set(5, 10, 5)
    sunLight.castShadow = true
    scene.add(sunLight)

    const fillLight = new THREE.PointLight(0x6600ff, 3, 30)
    fillLight.position.set(-5, 3, 0)
    scene.add(fillLight)

    // === GROUND PLANE (dark asphalt) ===
    const groundGeo = new THREE.PlaneGeometry(40, 200)
    const groundMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x050a14 : 0x030710,
      roughness: 0.9,
      metalness: 0.1,
    })
    const ground = new THREE.Mesh(groundGeo, groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.position.set(0, -0.01, -60)
    ground.receiveShadow = true
    scene.add(ground)

    // === NEON GRID (cyberpunk road lines) ===
    const gridHelper = new THREE.GridHelper(200, 60, 0x00ffcc, 0x002233)
    gridHelper.position.set(0, 0, -60)
    scene.add(gridHelper)

    // === NEON ROAD EDGE STRIPS ===
    const edgeMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc })
    for (let side = -1; side <= 1; side += 2) {
      const edgeGeo = new THREE.BoxGeometry(0.08, 0.05, 200)
      const edge = new THREE.Mesh(edgeGeo, edgeMat)
      edge.position.set(side * 3, 0.02, -60)
      scene.add(edge)
    }

    // === SPEED LINE PARTICLES ===
    const speedParticleCount = 300
    const speedPositions = new Float32Array(speedParticleCount * 3)
    for (let i = 0; i < speedParticleCount; i++) {
      speedPositions[i * 3] = (Math.random() - 0.5) * 12
      speedPositions[i * 3 + 1] = Math.random() * 4
      speedPositions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 30
    }
    const speedGeo = new THREE.BufferGeometry()
    speedGeo.setAttribute('position', new THREE.BufferAttribute(speedPositions, 3))
    const speedMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0x00ffcc,
      transparent: true,
      opacity: 0.35,
    })
    const speedParticles = new THREE.Points(speedGeo, speedMat)
    scene.add(speedParticles)

    // === FLOATING HOLOGRAPHIC SIDE PILLARS ===
    for (let i = 0; i < 12; i++) {
      const pillarGeo = new THREE.BoxGeometry(0.15, 3 + Math.random() * 2, 0.15)
      const pillarMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x00ffcc : 0x6600ff,
        wireframe: true,
      })
      const pillar = new THREE.Mesh(pillarGeo, pillarMat)
      pillar.position.set(
        (Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 3),
        1.5,
        -i * 12 - 5
      )
      scene.add(pillar)
    }

    // === FLOATING STAR FIELD ===
    const starCount = 600
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 80
      starPositions[i * 3 + 1] = Math.random() * 30 + 2
      starPositions[i * 3 + 2] = -(Math.random() * 120)
    }
    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ size: 0.08, color: 0xffffff, transparent: true, opacity: 0.6 })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    // === CYBER RACER POD ===
    const racerGroup = new THREE.Group()

    // Sleek body (flattened octahedron)
    const bodyGeo = new THREE.OctahedronGeometry(0.7, 1)
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      metalness: 0.95,
      roughness: 0.05,
      emissive: 0x004433,
      emissiveIntensity: 0.6,
    })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.scale.set(1.4, 0.4, 2.2)
    body.castShadow = true
    racerGroup.add(body)

    // Cockpit dome
    const cockpitGeo = new THREE.SphereGeometry(0.3, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5)
    const cockpitMat = new THREE.MeshStandardMaterial({
      color: 0x00eeff,
      metalness: 0.2,
      roughness: 0.05,
      transparent: true,
      opacity: 0.7,
      emissive: 0x004488,
      emissiveIntensity: 1.2,
    })
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat)
    cockpit.position.set(0, 0.3, -0.3)
    racerGroup.add(cockpit)

    // Underbody glow disc
    const glowGeo = new THREE.CylinderGeometry(0.6, 0.8, 0.05, 16)
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.4 })
    const glow = new THREE.Mesh(glowGeo, glowMat)
    glow.position.set(0, -0.25, 0)
    racerGroup.add(glow)

    // Left wing
    const wingGeo = new THREE.BoxGeometry(0.8, 0.04, 0.5)
    const wingMat = new THREE.MeshStandardMaterial({ color: 0x00ffcc, metalness: 0.9, roughness: 0.1 })
    const leftWing = new THREE.Mesh(wingGeo, wingMat)
    leftWing.position.set(-0.9, 0, 0.3)
    leftWing.rotation.z = -0.2
    racerGroup.add(leftWing)

    const rightWing = new THREE.Mesh(wingGeo, wingMat.clone())
    rightWing.position.set(0.9, 0, 0.3)
    rightWing.rotation.z = 0.2
    racerGroup.add(rightWing)

    // Thruster jets (rear)
    const jetGeo = new THREE.CylinderGeometry(0.1, 0.06, 0.5, 8)
    const jetMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b })

    const jet1 = new THREE.Mesh(jetGeo, jetMat)
    jet1.rotation.x = Math.PI / 2
    jet1.position.set(-0.3, -0.05, 0.9)
    racerGroup.add(jet1)

    const jet2 = new THREE.Mesh(jetGeo, jetMat.clone())
    jet2.rotation.x = Math.PI / 2
    jet2.position.set(0.3, -0.05, 0.9)
    racerGroup.add(jet2)

    // Thruster exhaust particles
    const exhaustCount = 60
    const exhaustPos = new Float32Array(exhaustCount * 3)
    for (let i = 0; i < exhaustCount; i++) {
      exhaustPos[i * 3] = (Math.random() - 0.5) * 0.5
      exhaustPos[i * 3 + 1] = (Math.random() - 0.5) * 0.2
      exhaustPos[i * 3 + 2] = Math.random() * 1.5 + 0.5
    }
    const exhaustGeo = new THREE.BufferGeometry()
    exhaustGeo.setAttribute('position', new THREE.BufferAttribute(exhaustPos, 3))
    const exhaustMat = new THREE.PointsMaterial({ size: 0.12, color: 0xf59e0b, transparent: true, opacity: 0.85 })
    const exhaust = new THREE.Points(exhaustGeo, exhaustMat)
    racerGroup.add(exhaust)

    // Racer dynamic light
    const racerLight = new THREE.PointLight(0x00ffcc, 5, 8)
    racerGroup.add(racerLight)

    racerGroup.position.set(0, 0.4, 4)
    scene.add(racerGroup)

    // === FINISH LINE ARCH ===
    const archMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, wireframe: false, transparent: true, opacity: 0.9 })
    const arch = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.12, 12, 32, Math.PI), archMat)
    arch.position.set(0, 3.5, -115)
    arch.rotation.x = -Math.PI / 2
    scene.add(arch)

    // Animated finish line text pillars
    const checkMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b })
    for (let i = -3; i <= 3; i += 1.5) {
      const checkBar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 7, 0.1), checkMat)
      checkBar.position.set(i, 3.5, -115)
      scene.add(checkBar)
    }

    // === ANIMATION ===
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const progress = progressRef.current / 100
      const isErr = errorRef.current
      const isDone = completedRef.current
      const curWpm = wpmRef.current

      // Move racer along track
      const targetZ = 4 - progress * 119
      racerGroup.position.z += (targetZ - racerGroup.position.z) * 0.08

      // Hover bobbing
      racerGroup.position.y = 0.4 + Math.sin(t * 7) * 0.06

      // React to errors / completion
      if (isErr) {
        bodyMat.color.setHex(0xff2244)
        bodyMat.emissive.setHex(0x440011)
        exhaustMat.color.setHex(0xff2244)
        jetMat.color.setHex(0xff2244)
        racerGroup.rotation.z = Math.sin(t * 40) * 0.18
        racerLight.color.setHex(0xff2244)
        fillLight.color.setHex(0xff0022)
      } else if (isDone) {
        bodyMat.color.setHex(0xf59e0b)
        bodyMat.emissive.setHex(0x442200)
        exhaustMat.color.setHex(0x00ffcc)
        jetMat.color.setHex(0x00ffcc)
        racerGroup.rotation.y = t * 3
        racerLight.color.setHex(0xf59e0b)
        fillLight.color.setHex(0xff8800)
      } else {
        bodyMat.color.setHex(0x00ffcc)
        bodyMat.emissive.setHex(0x004433)
        exhaustMat.color.setHex(0xf59e0b)
        jetMat.color.setHex(0xf59e0b)
        racerGroup.rotation.z = Math.sin(t * 5) * 0.06
        racerGroup.rotation.y = 0
        racerLight.color.setHex(0x00ffcc)
        fillLight.color.setHex(0x6600ff)
      }

      // Flame scale based on WPM
      const flameScale = Math.max(0.5, Math.min(3, curWpm / 30))
      exhaust.scale.set(flameScale, flameScale, flameScale * 1.8)
      glowMat.opacity = 0.3 + flameScale * 0.1

      // Camera chase
      camera.position.z = racerGroup.position.z + 5
      camera.position.y = racerGroup.position.y + 2.2
      camera.lookAt(racerGroup.position.x, racerGroup.position.y + 0.2, racerGroup.position.z - 8)

      // Scroll grid with progress
      gridHelper.position.z = racerGroup.position.z - 60

      // Pulse pillars
      fillLight.intensity = 2.5 + Math.sin(t * 3) * 0.8

      // Warp speed particles based on wpm
      speedMat.opacity = 0.1 + Math.min(0.7, curWpm / 100)

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
      renderer.dispose()
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[220px] sm:min-h-[260px] overflow-hidden rounded-2xl border border-slate-800 shadow-xl ${className}`}
      aria-hidden="true"
    />
  )
}

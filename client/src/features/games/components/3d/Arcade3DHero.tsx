import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface Arcade3DHeroProps {
  className?: string
}

export const Arcade3DHero: React.FC<Arcade3DHeroProps> = ({ className = '' }) => {
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const isDarkRef = useRef(isDark)
  isDarkRef.current = isDark

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let width = container.clientWidth || 480
    let height = container.clientHeight || 300

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000)
    camera.position.set(0, 0.1, 4.8)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // === LIGHTING ===
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 1.0)
    scene.add(ambientLight)

    const primaryLight = new THREE.PointLight(0x00ffcc, isDark ? 6 : 4, 30)
    primaryLight.position.set(4, 4, 5)
    scene.add(primaryLight)

    const accentLight = new THREE.PointLight(0x7c3aed, isDark ? 5 : 3, 25)
    accentLight.position.set(-4, -2, 3)
    scene.add(accentLight)

    const rimLight = new THREE.PointLight(0xf59e0b, isDark ? 3.5 : 2.5, 20)
    rimLight.position.set(0, -4, 2)
    scene.add(rimLight)

    // === CENTRAL FLOATING PLATFORM (hexagonal base) ===
    const hexGeo = new THREE.CylinderGeometry(1.8, 2.0, 0.2, 6)
    const hexMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0d1b2a : 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00ffcc,
      emissiveIntensity: isDark ? 0.15 : 0.08,
    })
    const hexPlatform = new THREE.Mesh(hexGeo, hexMat)
    hexPlatform.position.set(0, -1.2, 0)
    scene.add(hexPlatform)

    // === HEX WIREFRAME RING ===
    const hexRingGeo = new THREE.CylinderGeometry(2.1, 2.1, 0.02, 6)
    const hexRingMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true })
    const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat)
    hexRing.position.set(0, -1.1, 0)
    scene.add(hexRing)

    // === MAIN CRYSTALLINE CORE (floating diamond) ===
    const coreGeo = new THREE.OctahedronGeometry(1.15, 2)
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x00ffcc : 0x06b6d4,
      metalness: 0.95,
      roughness: 0.05,
      emissive: isDark ? 0x004433 : 0x003344,
      emissiveIntensity: 0.9,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // === INNER GLOWING TORUS ===
    const torusGeo = new THREE.TorusGeometry(1.55, 0.07, 16, 80)
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.85 })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.rotation.x = Math.PI * 0.5
    scene.add(torus)

    // === OUTER WIREFRAME SHELL ===
    const shellGeo = new THREE.IcosahedronGeometry(2.1, 1)
    const shellMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00ffcc : 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.28,
    })
    const shell = new THREE.Mesh(shellGeo, shellMat)
    scene.add(shell)

    // === ORBIT RINGS ===
    const ringCount = 2
    const orbitMeshes: THREE.LineLoop[] = []
    for (let r = 0; r < ringCount; r++) {
      const radius = 2.4 + r * 0.5
      const points: THREE.Vector3[] = []
      const segments = 64
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius))
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points)
      const ringMat = new THREE.LineBasicMaterial({
        color: r === 0 ? 0x00ffcc : 0x7c3aed,
        transparent: true,
        opacity: 0.45,
      })
      const ringMesh = new THREE.LineLoop(ringGeo, ringMat)
      ringMesh.rotation.x = (Math.PI / 5) * (r + 1)
      ringMesh.rotation.y = (Math.PI / 4) * r
      scene.add(ringMesh)
      orbitMeshes.push(ringMesh)
    }

    // === SATELLITE CRYSTALS ===
    const satelliteCount = 5
    const satellites: { mesh: THREE.Mesh; orbitRadius: number; speed: number; phase: number }[] = []
    const satColors = [0x00ffcc, 0x7c3aed, 0xf59e0b, 0x10b981, 0x06b6d4]

    for (let i = 0; i < satelliteCount; i++) {
      const satGeo = new THREE.TetrahedronGeometry(0.18 + Math.random() * 0.08)
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i % satColors.length],
        metalness: 0.9,
        roughness: 0.1,
        emissive: satColors[i % satColors.length],
        emissiveIntensity: 0.6,
      })
      const satMesh = new THREE.Mesh(satGeo, satMat)
      const orbitRadius = 1.9 + (i % 3) * 0.45
      const speed = 0.6 + i * 0.15
      const phase = (i / satelliteCount) * Math.PI * 2

      satellites.push({ mesh: satMesh, orbitRadius, speed, phase })
      scene.add(satMesh)
    }

    // === VERTICAL CYBER BEAMS ===
    const beamCount = 6
    const beamGroup = new THREE.Group()
    for (let b = 0; b < beamCount; b++) {
      const angle = (b / beamCount) * Math.PI * 2
      const radius = 1.65
      const beamGeo = new THREE.CylinderGeometry(0.018, 0.018, 3.2, 8)
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0x00ffcc,
        transparent: true,
        opacity: 0.4,
      })
      const beamMesh = new THREE.Mesh(beamGeo, beamMat)
      beamMesh.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      beamGroup.add(beamMesh)
    }
    scene.add(beamGroup)

    // === FLOATING PARTICLES DUST ===
    const particleCount = 70
    const particleGeo = new THREE.BufferGeometry()
    const particlePos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 8
      particlePos[i + 1] = (Math.random() - 0.5) * 6
      particlePos[i + 2] = (Math.random() - 0.5) * 6
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x00ffcc,
      size: 0.06,
      transparent: true,
      opacity: 0.7,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // === MOUSE INTERACTION ===
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    const handleResize = () => {
      if (!container) return
      width = container.clientWidth || 480
      height = container.clientHeight || 300
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    container.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // === ANIMATION LOOP ===
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Core rotation & float
      core.rotation.y = t * 0.4
      core.rotation.x = Math.sin(t * 0.3) * 0.2
      core.position.y = Math.sin(t * 1.2) * 0.18

      // Torus counter-rotate
      torus.rotation.z = -t * 0.5
      torus.position.y = core.position.y

      // Outer shell
      shell.rotation.y = -t * 0.15
      shell.rotation.z = t * 0.08
      shell.position.y = core.position.y

      // Hex platform slow rotation
      hexPlatform.rotation.y = t * 0.1
      hexRing.rotation.y = -t * 0.15

      // Orbit rings
      orbitMeshes[0].rotation.z = t * 0.3
      orbitMeshes[1].rotation.z = -t * 0.2

      // Satellites orbit
      satellites.forEach(({ mesh, orbitRadius, speed, phase }) => {
        const angle = t * speed + phase
        mesh.position.set(
          Math.cos(angle) * orbitRadius,
          Math.sin(angle * 0.5) * 0.6 + core.position.y,
          Math.sin(angle) * orbitRadius * 0.5,
        )
        mesh.rotation.y = t * 2
      })

      // Beam rotate
      beamGroup.rotation.z = t * 0.12

      // Particles drift
      particles.rotation.y = t * 0.04
      particles.rotation.x = t * 0.02

      // Mouse tilt for whole scene
      scene.rotation.y += (mouseX * 0.35 - scene.rotation.y) * 0.05
      scene.rotation.x += (mouseY * 0.2 - scene.rotation.x) * 0.05

      // Pulse lights
      primaryLight.intensity = (isDarkRef.current ? 6 : 4) + Math.sin(t * 2) * 1.0
      accentLight.intensity = (isDarkRef.current ? 5 : 3) + Math.sin(t * 1.7 + 1) * 0.7

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('mousemove', handleMouseMove)
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
      className={`relative w-full h-full min-h-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  )
}

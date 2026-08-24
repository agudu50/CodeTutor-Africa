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

    const width = container.clientWidth || 400
    const height = container.clientHeight || 220

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.set(0, 0.5, 7)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // === LIGHTING ===
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.5 : 0.9)
    scene.add(ambientLight)

    const primaryLight = new THREE.PointLight(0x00ffcc, isDark ? 5 : 3.5, 30)
    primaryLight.position.set(4, 4, 5)
    scene.add(primaryLight)

    const accentLight = new THREE.PointLight(0x7c3aed, isDark ? 4 : 2.5, 25)
    accentLight.position.set(-4, -2, 3)
    scene.add(accentLight)

    const rimLight = new THREE.PointLight(0xf59e0b, isDark ? 3 : 2, 20)
    rimLight.position.set(0, -4, 2)
    scene.add(rimLight)

    // === CENTRAL FLOATING PLATFORM (hexagonal base) ===
    const hexGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.18, 6)
    const hexMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0d1b2a : 0x1e293b,
      metalness: 0.9,
      roughness: 0.2,
      emissive: 0x00ffcc,
      emissiveIntensity: isDark ? 0.12 : 0.06,
    })
    const hexPlatform = new THREE.Mesh(hexGeo, hexMat)
    hexPlatform.position.set(0, -1, 0)
    scene.add(hexPlatform)

    // === HEX WIREFRAME RING ===
    const hexRingGeo = new THREE.CylinderGeometry(1.85, 1.85, 0.02, 6)
    const hexRingMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, wireframe: true })
    const hexRing = new THREE.Mesh(hexRingGeo, hexRingMat)
    hexRing.position.set(0, -0.9, 0)
    scene.add(hexRing)

    // === MAIN CRYSTALLINE CORE (floating diamond) ===
    const coreGeo = new THREE.OctahedronGeometry(1.0, 2)
    const coreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x00ffcc : 0x06b6d4,
      metalness: 0.95,
      roughness: 0.05,
      emissive: isDark ? 0x004433 : 0x003344,
      emissiveIntensity: 0.8,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    scene.add(core)

    // === INNER GLOWING TORUS ===
    const torusGeo = new THREE.TorusGeometry(1.4, 0.06, 16, 80)
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.8 })
    const torus = new THREE.Mesh(torusGeo, torusMat)
    torus.rotation.x = Math.PI * 0.5
    scene.add(torus)

    // === OUTER WIREFRAME SHELL ===
    const shellGeo = new THREE.IcosahedronGeometry(1.9, 1)
    const shellMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00ffcc : 0x0891b2,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    })
    const shell = new THREE.Mesh(shellGeo, shellMat)
    scene.add(shell)

    // === ORBIT RINGS ===
    const orbitData = [
      { radius: 2.6, tubeRadius: 0.03, color: 0x7c3aed, tiltX: 0.4, tiltZ: 0.2 },
      { radius: 3.2, tubeRadius: 0.025, color: 0xf59e0b, tiltX: -0.6, tiltZ: 0.5 },
    ]
    const orbitMeshes = orbitData.map(({ radius, tubeRadius, color, tiltX, tiltZ }) => {
      const geo = new THREE.TorusGeometry(radius, tubeRadius, 8, 80)
      const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.x = tiltX
      mesh.rotation.z = tiltZ
      scene.add(mesh)
      return mesh
    })

    // === ORBITING SATELLITES ===
    const satellites: { mesh: THREE.Mesh; orbitRadius: number; speed: number; phase: number }[] = []
    const satColors = [0x00ffcc, 0xf59e0b, 0x7c3aed]
    satColors.forEach((color, i) => {
      const satGeo = new THREE.OctahedronGeometry(0.12, 0)
      const satMat = new THREE.MeshStandardMaterial({ color, metalness: 0.9, roughness: 0.1, emissive: color, emissiveIntensity: 0.5 })
      const sat = new THREE.Mesh(satGeo, satMat)
      scene.add(sat)
      satellites.push({ mesh: sat, orbitRadius: 2.6 + i * 0.3, speed: 0.6 + i * 0.3, phase: (i * Math.PI * 2) / 3 })
    })

    // === FLOATING CODE PARTICLES (matrix rain style) ===
    const particleCount = 200
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 14
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 10
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: isDark ? 0.06 : 0.07,
      color: isDark ? 0x34d399 : 0x059669,
      transparent: true,
      opacity: isDark ? 0.7 : 0.8,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // === ENERGY BEAM LINES (radiating from core) ===
    const beamGroup = new THREE.Group()
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const beamGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 3, Math.sin(angle) * 3, 0),
      ])
      const beamMat = new THREE.LineBasicMaterial({ color: 0x00ffcc, transparent: true, opacity: 0.12 })
      const beam = new THREE.Line(beamGeo, beamMat)
      beamGroup.add(beam)
    }
    scene.add(beamGroup)

    // Mouse interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Resize
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Core float and spin
      core.position.y = Math.sin(t * 0.8) * 0.15
      core.rotation.y = t * 0.5
      core.rotation.x = t * 0.3

      // Torus rotates around core
      torus.rotation.z = t * 0.4
      torus.position.y = core.position.y

      // Shell counter-rotate
      shell.rotation.y = -t * 0.2
      shell.rotation.x = t * 0.15
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
      scene.rotation.y += (mouseX * 0.3 - scene.rotation.y) * 0.04
      scene.rotation.x += (mouseY * 0.15 - scene.rotation.x) * 0.04

      // Pulse lights
      primaryLight.intensity = (isDarkRef.current ? 5 : 3.5) + Math.sin(t * 2) * 0.8
      accentLight.intensity = (isDarkRef.current ? 4 : 2.5) + Math.sin(t * 1.7 + 1) * 0.5

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
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
      className={`relative w-full h-full min-h-[200px] overflow-hidden ${className}`}
      aria-hidden="true"
    />
  )
}

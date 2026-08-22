import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface VictoryBurst3DProps {
  className?: string
}

export const VictoryBurst3D: React.FC<VictoryBurst3DProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 140

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Center Gold Trophy Orb
    const orbGeo = new THREE.DodecahedronGeometry(1.2, 0)
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // gold amber
      roughness: 0.2,
      metalness: 0.8,
    })
    const orb = new THREE.Mesh(orbGeo, orbMat)
    scene.add(orb)

    // Orbiting Emerald Diamonds
    const diamondGroup = new THREE.Group()
    const diaGeo = new THREE.OctahedronGeometry(0.35, 0)
    const diaMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.1,
      metalness: 0.9,
    })

    for (let i = 0; i < 5; i++) {
      const dia = new THREE.Mesh(diaGeo, diaMat)
      const angle = (i / 5) * Math.PI * 2
      dia.position.set(Math.cos(angle) * 2.2, Math.sin(angle) * 2.2, 0)
      diamondGroup.add(dia)
    }
    scene.add(diamondGroup)

    // Confetti Particles
    const particleCount = 80
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const colorChoices = [
      new THREE.Color(0xf59e0b), // amber
      new THREE.Color(0x10b981), // emerald
      new THREE.Color(0x6366f1), // indigo
      new THREE.Color(0xf43f5e), // rose
    ]

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)]
      colors[i * 3] = col.r
      colors[i * 3 + 1] = col.g
      colors[i * 3 + 2] = col.b
    }

    const partGeo = new THREE.BufferGeometry()
    partGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    partGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const partMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    })
    const particleSystem = new THREE.Points(partGeo, partMat)
    scene.add(particleSystem)

    // Lighting
    const light1 = new THREE.PointLight(0xffffff, 2, 20)
    light1.position.set(3, 3, 4)
    scene.add(light1)

    const light2 = new THREE.PointLight(0xf59e0b, 2, 20)
    light2.position.set(-3, -3, 2)
    scene.add(light2)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      orb.rotation.x = t * 0.8
      orb.rotation.y = t * 1.2

      diamondGroup.rotation.z = -t * 0.7
      diamondGroup.children.forEach((d, idx) => {
        d.rotation.x = t * 2 + idx
        d.rotation.y = t * 2
      })

      particleSystem.rotation.y = t * 0.15

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
      orbGeo.dispose()
      orbMat.dispose()
      diaGeo.dispose()
      diaMat.dispose()
      partGeo.dispose()
      partMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-32 sm:h-36 overflow-hidden rounded-2xl ${className}`}
      aria-hidden="true"
    />
  )
}

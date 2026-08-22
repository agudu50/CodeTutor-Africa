import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface WarpSpeed3DProps {
  speedMultiplier?: number
  comboCount?: number
  className?: string
}

export const WarpSpeed3D: React.FC<WarpSpeed3DProps> = ({
  speedMultiplier = 1,
  comboCount = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const speedRef = useRef(speedMultiplier)
  const comboRef = useRef(comboCount)

  speedRef.current = speedMultiplier
  comboRef.current = comboCount

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 120

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Starfield Tunnel Particles
    const starCount = 200
    const positions = new Float32Array(starCount * 3)
    const speeds = new Float32Array(starCount)

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
      speeds[i] = 0.05 + Math.random() * 0.1
    }

    const starGeo = new THREE.BufferGeometry()
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const starMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
    })

    const starField = new THREE.Points(starGeo, starMat)
    scene.add(starField)

    // Glowing Speed Wireframe Tunnel Rings
    const rings: THREE.Mesh[] = []
    const ringGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.4,
    })

    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.z = -i * 3
      scene.add(ring)
      rings.push(ring)
    }

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // Animation Loop
    let animId: number
    const posAttr = starGeo.attributes.position as THREE.BufferAttribute

    const animate = () => {
      animId = requestAnimationFrame(animate)

      const activeSpeed = Math.max(0.5, speedRef.current * 0.02)
      const currentCombo = comboRef.current

      // Color shift with combos
      if (currentCombo >= 3) {
        starMat.color.setHex(0x10b981) // emerald
      } else {
        starMat.color.setHex(0xf59e0b) // amber
      }

      // Move stars forward
      const arr = posAttr.array as Float32Array
      for (let i = 0; i < starCount; i++) {
        arr[i * 3 + 2] += speeds[i] * (1 + activeSpeed * 2)
        if (arr[i * 3 + 2] > 5) {
          arr[i * 3 + 2] = -15
          arr[i * 3] = (Math.random() - 0.5) * 16
          arr[i * 3 + 1] = (Math.random() - 0.5) * 10
        }
      }
      posAttr.needsUpdate = true

      // Move rings
      rings.forEach((ring) => {
        ring.position.z += 0.04 * (1 + activeSpeed)
        ring.rotation.z += 0.005
        if (ring.position.z > 5) {
          ring.position.z = -13
        }
      })

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      starGeo.dispose()
      starMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-24 sm:h-28 overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 ${className}`}
      aria-hidden="true"
    />
  )
}

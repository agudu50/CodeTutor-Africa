import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface HologramBug3DProps {
  isTargetLocked?: boolean
  isSquashed?: boolean
  className?: string
}

export const HologramBug3D: React.FC<HologramBug3DProps> = ({
  isTargetLocked = false,
  isSquashed = false,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const lockedRef = useRef(isTargetLocked)
  const squashedRef = useRef(isSquashed)

  lockedRef.current = isTargetLocked
  squashedRef.current = isSquashed

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 200
    const height = container.clientHeight || 120

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Holographic Octahedron / Bug Crystal
    const octGeo = new THREE.OctahedronGeometry(1.2, 0)
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e, // rose
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    })
    const bugMesh = new THREE.Mesh(octGeo, octMat)
    scene.add(bugMesh)

    // Inner Core
    const coreGeo = new THREE.SphereGeometry(0.4, 16, 16)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xfb7185,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    scene.add(coreMesh)

    // Target Scanning Ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.65, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    })
    const scanRing = new THREE.Mesh(ringGeo, ringMat)
    scene.add(scanRing)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (squashedRef.current) {
        // Explode / Disperse effect
        bugMesh.scale.multiplyScalar(0.92)
        coreMesh.scale.multiplyScalar(0.92)
        octMat.color.setHex(0x10b981) // turns emerald upon squash
        coreMat.color.setHex(0x34d399)
      } else if (lockedRef.current) {
        // Fast alert spin
        bugMesh.rotation.x = t * 2.5
        bugMesh.rotation.y = t * 3.0
        scanRing.rotation.z = -t * 2.0
        octMat.color.setHex(0xf59e0b) // turns amber when locked
      } else {
        // Idle radar scan
        bugMesh.rotation.x = t * 0.8
        bugMesh.rotation.y = t * 1.2
        scanRing.rotation.z = t * 0.5
        octMat.color.setHex(0xf43f5e)
      }

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
      octGeo.dispose()
      octMat.dispose()
      coreGeo.dispose()
      coreMat.dispose()
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

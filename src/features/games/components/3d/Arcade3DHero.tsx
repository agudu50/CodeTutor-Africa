import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Arcade3DHeroProps {
  className?: string
}

export const Arcade3DHero: React.FC<Arcade3DHeroProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 300
    const height = container.clientHeight || 180

    // Scene, Camera, Renderer
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 6

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x10b981, 3, 50) // emerald
    pointLight1.position.set(4, 4, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xf59e0b, 3, 50) // amber
    pointLight2.position.set(-4, -4, 2)
    scene.add(pointLight2)

    // Main 3D Floating Geometry (Rotating Wireframe Icosahedron)
    const icoGeo = new THREE.IcosahedronGeometry(1.5, 1)
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0x059669,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8,
    })
    const icosahedron = new THREE.Mesh(icoGeo, icoMat)
    scene.add(icosahedron)

    // Inner Glowing Core (Torus Knot)
    const knotGeo = new THREE.TorusKnotGeometry(0.7, 0.18, 64, 8)
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.9,
    })
    const innerKnot = new THREE.Mesh(knotGeo, knotMat)
    scene.add(innerKnot)

    // Floating Star / Particle Field
    const particleCount = 100
    const posArray = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 12
    }
    const particlesGeo = new THREE.BufferGeometry()
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x34d399,
      transparent: true,
      opacity: 0.8,
    })
    const particleSystem = new THREE.Points(particlesGeo, particlesMat)
    scene.add(particleSystem)

    // Mouse Interaction
    let mouseX = 0
    let mouseY = 0
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Handle Resize
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
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Rotate objects
      icosahedron.rotation.x = elapsedTime * 0.4
      icosahedron.rotation.y = elapsedTime * 0.6

      innerKnot.rotation.x = -elapsedTime * 0.8
      innerKnot.rotation.y = elapsedTime * 0.5

      particleSystem.rotation.y = elapsedTime * 0.08

      // Gentle interactive tilt
      icosahedron.position.x += (mouseX * 0.5 - icosahedron.position.x) * 0.05
      icosahedron.position.y += (mouseY * 0.5 - icosahedron.position.y) * 0.05

      innerKnot.position.x = icosahedron.position.x
      innerKnot.position.y = icosahedron.position.y

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
      icoGeo.dispose()
      icoMat.dispose()
      knotGeo.dispose()
      knotMat.dispose()
      particlesGeo.dispose()
      particlesMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[160px] pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  )
}

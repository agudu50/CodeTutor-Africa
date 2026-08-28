import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface CircuitBugScanner3DProps {
  totalLines: number
  selectedLineIndex: number | null
  buggyLineIndex: number
  isLocked: boolean
  isSquashed: boolean
  hasError: boolean
  className?: string
}

export const CircuitBugScanner3D: React.FC<CircuitBugScanner3DProps> = ({
  totalLines,
  selectedLineIndex,
  buggyLineIndex,
  isLocked,
  isSquashed,
  hasError,
  className = '',
}) => {
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)

  const lineCountRef = useRef(totalLines)
  const selectedRef = useRef(selectedLineIndex)
  const buggyRef = useRef(buggyLineIndex)
  const lockedRef = useRef(isLocked)
  const squashedRef = useRef(isSquashed)
  const errorRef = useRef(hasError)

  lineCountRef.current = totalLines
  selectedRef.current = selectedLineIndex
  buggyRef.current = buggyLineIndex
  lockedRef.current = isLocked
  squashedRef.current = isSquashed
  errorRef.current = hasError

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 140

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 3, 7)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.7 : 1.3)
    scene.add(ambient)

    const laserLight = new THREE.PointLight(0xf43f5e, isDark ? 2 : 1.5, 10)
    scene.add(laserLight)

    // Motherboard Chip Base
    const boardGeo = new THREE.BoxGeometry(7, 0.2, 3)
    const boardMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xe2e8f0,
      metalness: isDark ? 0.8 : 0.2,
      roughness: 0.3,
    })
    const board = new THREE.Mesh(boardGeo, boardMat)
    board.position.y = -0.5
    scene.add(board)

    // Line Nodes along the board
    const lineNodes: THREE.Mesh[] = []
    const nodeCount = Math.max(3, Math.min(8, lineCountRef.current))
    const startX = -2.5
    const stepX = 5 / (nodeCount - 1 || 1)

    const nodeGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 16)

    for (let i = 0; i < nodeCount; i++) {
      const nodeMat = new THREE.MeshStandardMaterial({
        color: isDark ? 0x334155 : 0x94a3b8, // slate default
        roughness: 0.4,
      })
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat)
      nodeMesh.position.set(startX + i * stepX, -0.3, 0)
      scene.add(nodeMesh)
      lineNodes.push(nodeMesh)
    }

    // Laser Pointer Reticle
    const reticleGeo = new THREE.RingGeometry(0.35, 0.4, 16)
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    })
    const reticle = new THREE.Mesh(reticleGeo, reticleMat)
    reticle.rotation.x = -Math.PI / 2
    reticle.position.set(0, 0.1, 0)
    scene.add(reticle)

    // Laser Beam Line
    const beamGeo = new THREE.CylinderGeometry(0.02, 0.02, 3, 8)
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.6,
    })
    const beam = new THREE.Mesh(beamGeo, beamMat)
    beam.position.set(0, 1.5, 0)
    scene.add(beam)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const selIdx = selectedRef.current
      const isLock = lockedRef.current
      const isSquash = squashedRef.current
      const isErr = errorRef.current

      // Target X based on selected code line
      let targetX = 0
      if (selIdx !== null && selIdx >= 0 && selIdx < nodeCount) {
        targetX = startX + selIdx * stepX
      }

      reticle.position.x += (targetX - reticle.position.x) * 0.15
      beam.position.x = reticle.position.x
      laserLight.position.x = reticle.position.x
      laserLight.position.y = 0.5

      // Spin reticle
      reticle.rotation.z = t * 3

      // Update Node Colors based on game logic
      lineNodes.forEach((node, idx) => {
        const mat = node.material as THREE.MeshStandardMaterial

        if (isSquash && idx === buggyRef.current) {
          // Bug Squashed -> Glowing emerald victory node
          mat.color.setHex(0x10b981)
          node.position.y = -0.3 + Math.sin(t * 10) * 0.05
        } else if (isLock && idx === selIdx) {
          // Target locked -> Amber pulse
          mat.color.setHex(0xf59e0b)
        } else if (isErr && idx === selIdx) {
          // Wrong line -> Glitch Red
          mat.color.setHex(0xf43f5e)
        } else if (idx === selIdx) {
          // Selected line -> Brand blue
          mat.color.setHex(0x38bdf8)
        } else {
          mat.color.setHex(0x334155)
          node.position.y = -0.3
        }
      })

      // Reticle Color
      if (isSquash) {
        reticleMat.color.setHex(0x10b981)
        beamMat.color.setHex(0x10b981)
        laserLight.color.setHex(0x10b981)
      } else if (isLock) {
        reticleMat.color.setHex(0xf59e0b)
        beamMat.color.setHex(0xf59e0b)
        laserLight.color.setHex(0xf59e0b)
      } else if (isErr) {
        reticleMat.color.setHex(0xf43f5e)
        beamMat.color.setHex(0xf43f5e)
        laserLight.color.setHex(0xf43f5e)
      } else {
        reticleMat.color.setHex(0x38bdf8)
        beamMat.color.setHex(0x38bdf8)
        laserLight.color.setHex(0x38bdf8)
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
      boardGeo.dispose()
      boardMat.dispose()
      nodeGeo.dispose()
      reticleGeo.dispose()
      reticleMat.dispose()
      beamGeo.dispose()
      beamMat.dispose()
      renderer.dispose()
    }
  }, [isDark])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full min-h-[220px] sm:min-h-[260px] overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-inner ${className}`}
      aria-hidden="true"
    />
  )
}

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useTheme } from '@/app/providers/ThemeProvider'

interface AlgorithmBlocks3DProps {
  blockOrder: string[]
  isSuccess: boolean | null // null = idle, true = correct, false = wrong
  className?: string
}

export const AlgorithmBlocks3D: React.FC<AlgorithmBlocks3DProps> = ({
  blockOrder,
  isSuccess,
  className = '',
}) => {
  const { isDark } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const orderRef = useRef(blockOrder)
  const successRef = useRef(isSuccess)

  orderRef.current = blockOrder
  successRef.current = isSuccess

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 130

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 3.5, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, isDark ? 0.8 : 1.3)
    scene.add(ambient)

    const mainLight = new THREE.PointLight(0x10b981, isDark ? 2 : 1.6, 20)
    mainLight.position.set(2, 4, 3)
    scene.add(mainLight)

    // Platform Base
    const baseGeo = new THREE.BoxGeometry(6.5, 0.2, 2)
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x0f172a : 0xe2e8f0,
      metalness: isDark ? 0.8 : 0.2,
      roughness: 0.3,
    })
    const base = new THREE.Mesh(baseGeo, baseMat)
    base.position.y = -0.5
    scene.add(base)

    // 3D Logic Blocks Map
    const blockMeshes: Map<string, THREE.Mesh> = new Map()
    const blockCount = Math.max(3, orderRef.current.length)
    const startX = -2.2
    const stepX = 4.4 / (blockCount - 1 || 1)

    const blockGeo = new THREE.BoxGeometry(0.7, 0.6, 0.7)

    orderRef.current.forEach((id, idx) => {
      const blockMat = new THREE.MeshStandardMaterial({
        color: 0x059669, // emerald
        metalness: 0.6,
        roughness: 0.2,
      })
      const mesh = new THREE.Mesh(blockGeo, blockMat)
      mesh.position.set(startX + idx * stepX, 0, 0)
      scene.add(mesh)
      blockMeshes.set(id, mesh)
    })

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const currentOrder = orderRef.current
      const result = successRef.current

      // Smoothly interpolate physical 3D block positions to match user UI order
      currentOrder.forEach((id, targetIdx) => {
        const mesh = blockMeshes.get(id)
        if (mesh) {
          const targetX = startX + targetIdx * stepX
          mesh.position.x += (targetX - mesh.position.x) * 0.15

          const mat = mesh.material as THREE.MeshStandardMaterial

          if (result === true) {
            // Correct sequence -> Ascend & Glow
            mat.color.setHex(0x10b981)
            mesh.position.y = 0.2 + Math.sin(t * 4 + targetIdx) * 0.1
            mesh.rotation.y = t * 0.5
          } else if (result === false) {
            // Wrong sequence -> Glitch red shake
            mat.color.setHex(0xf43f5e)
            mesh.position.y = 0 + Math.sin(t * 20) * 0.04
            mesh.rotation.z = Math.sin(t * 30) * 0.05
          } else {
            // Idle order mode
            mat.color.setHex(0x059669)
            mesh.position.y = 0
            mesh.rotation.y = 0
            mesh.rotation.z = 0
          }
        }
      })

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
      baseGeo.dispose()
      baseMat.dispose()
      blockGeo.dispose()
      blockMeshes.forEach((mesh) => {
        ;(mesh.material as THREE.Material).dispose()
      })
      renderer.dispose()
    }
  }, [blockOrder.length, isDark])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-28 sm:h-32 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner ${className}`}
      aria-hidden="true"
    />
  )
}

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface MemoryStackFlow3DProps {
  selectedOptionIndex: number | null
  correctIndex: number
  isAnswered: boolean
  isCorrect: boolean
  className?: string
}

export const MemoryStackFlow3D: React.FC<MemoryStackFlow3DProps> = ({
  selectedOptionIndex,
  correctIndex,
  isAnswered,
  isCorrect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedRef = useRef(selectedOptionIndex)
  const correctRef = useRef(correctIndex)
  const answeredRef = useRef(isAnswered)
  const isCorrectRef = useRef(isCorrect)

  selectedRef.current = selectedOptionIndex
  correctRef.current = correctIndex
  answeredRef.current = isAnswered
  isCorrectRef.current = isCorrect

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || 400
    const height = container.clientHeight || 130

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.set(0, 3, 6.5)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambient)

    const dataLight = new THREE.PointLight(0x6366f1, 3, 15) // indigo
    scene.add(dataLight)

    // Center Memory Stack Node (CPU Core)
    const coreGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 6)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x4338ca,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    })
    const core = new THREE.Mesh(coreGeo, coreMat)
    core.position.set(0, 0, -1)
    scene.add(core)

    // 4 Output Ports (A, B, C, D)
    const portGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6)
    const portMeshes: THREE.Mesh[] = []
    const portX = [-2.2, -0.7, 0.7, 2.2]

    for (let i = 0; i < 4; i++) {
      const portMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.3,
      })
      const port = new THREE.Mesh(portGeo, portMat)
      port.position.set(portX[i], -0.2, 1.2)
      scene.add(port)
      portMeshes.push(port)
    }

    // Data Packet Orb
    const packetGeo = new THREE.SphereGeometry(0.2, 16, 16)
    const packetMat = new THREE.MeshBasicMaterial({ color: 0x818cf8 })
    const packet = new THREE.Mesh(packetGeo, packetMat)
    packet.position.set(0, 0.2, -1)
    scene.add(packet)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      const sel = selectedRef.current
      const answered = answeredRef.current
      const right = isCorrectRef.current
      const corrIdx = correctRef.current

      // Rotate core
      core.rotation.y = t * 0.8

      // Target position for data packet
      let targetX = 0
      let targetZ = -1
      if (sel !== null && sel >= 0 && sel < 4) {
        targetX = portX[sel]
        targetZ = 1.2
      } else {
        // idle hover
        targetX = Math.sin(t * 2) * 0.5
        targetZ = -1 + Math.cos(t * 2) * 0.3
      }

      packet.position.x += (targetX - packet.position.x) * 0.12
      packet.position.z += (targetZ - packet.position.z) * 0.12
      dataLight.position.copy(packet.position)

      // Update port colors based on options & answers
      portMeshes.forEach((port, idx) => {
        const mat = port.material as THREE.MeshStandardMaterial

        if (answered) {
          if (idx === corrIdx) {
            mat.color.setHex(0x10b981) // emerald correct
            port.position.y = -0.2 + Math.sin(t * 8) * 0.05
          } else if (idx === sel && !right) {
            mat.color.setHex(0xf43f5e) // rose wrong
          } else {
            mat.color.setHex(0x1e293b)
          }
        } else if (idx === sel) {
          mat.color.setHex(0x6366f1) // active selection
          port.position.y = -0.1
        } else {
          mat.color.setHex(0x334155)
          port.position.y = -0.2
        }
      })

      // Packet color
      if (answered) {
        packetMat.color.setHex(right ? 0x10b981 : 0xf43f5e)
        dataLight.color.setHex(right ? 0x10b981 : 0xf43f5e)
      } else {
        packetMat.color.setHex(0x818cf8)
        dataLight.color.setHex(0x6366f1)
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
      coreGeo.dispose()
      coreMat.dispose()
      portGeo.dispose()
      portMeshes.forEach((p) => (p.material as THREE.Material).dispose())
      packetGeo.dispose()
      packetMat.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-28 sm:h-32 overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-inner ${className}`}
      aria-hidden="true"
    />
  )
}

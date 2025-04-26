'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<THREE.Mesh>(null)
  const keysPressed = useRef<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer()

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Add a simple cube
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    camera.position.z = 5

    const handleKeyUp = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = true
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = false
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate)

      if (cubeRef.current) {
        if (keysPressed.current['ArrowUp']) {
          cubeRef.current.position.y += 0.05
        }
        if (keysPressed.current['ArrowDown']) {
          cubeRef.current.position.y -= 0.05
        }
        if (keysPressed.current['ArrowLeft']) {
          cubeRef.current.position.x -= 0.05
        }
        if (keysPressed.current['ArrowRight']) {
          cubeRef.current.position.x += 0.05
        }
      }

      renderer.render(scene, camera)
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      mountRef.current?.removeChild(renderer.domElement)
    }
  }, []);


  return <div ref={mountRef} />
}
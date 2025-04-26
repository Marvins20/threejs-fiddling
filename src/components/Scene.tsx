'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function Scene() {
  const mountRef = useRef<HTMLDivElement>(null)
  const cubeRef = useRef<THREE.Mesh>(null)
  const keysPressed = useRef<{ [key: string]: boolean }>({})
  const controlsRef = useRef<OrbitControls>(null)

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
    scene.background = new THREE.Color(0xcccccc);
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    // Add a simple cube
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    cube.castShadow = true; // Cube should cast shadows
    cube.position.y = 0.5; // Lift cube slightly so it's above the ground plane
    scene.add(cube)
    if (cubeRef) { // Check if ref exists before assigning
      cubeRef.current = cube;
    }

    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
    plane.receiveShadow = true; // Plane should receive shadows
    scene.add(plane);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // color, intensity
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // color, intensity
    directionalLight.position.set(5, 10, 7.5); // Position the light
    directionalLight.castShadow = true; 
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    const cameraOffset = new THREE.Vector3(0, 2, 5);
    camera.position.copy(cube.position).add(cameraOffset);
    camera.lookAt(cube.position)


    camera.position.set(0, 2, 5);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    controlsRef.current = controls

    const handleKeyUp = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = false
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        keysPressed.current[event.key] = true
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Render the scene
    const animate = () => {
      requestAnimationFrame(animate)
      console.log(keysPressed.current['ArrowUp'])
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
        // const targetCameraPosition = cubeRef.current.position.clone().add(cameraOffset)
        // camera.position.lerp(targetCameraPosition, 0.1)
      
        if (controlsRef.current) {
          controlsRef.current.target.copy(cubeRef.current!.position);
       }
      }

      

      if (controlsRef.current?.enableDamping) {
        controlsRef.current.update();
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
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      controlsRef.current?.dispose();
      // Safely remove child element
      if (mountRef.current && renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
      }
      // Optional: Dispose geometries and materials if needed for complex scenes
      geometry.dispose();
      material.dispose();
      planeGeometry.dispose();
      planeMaterial.dispose();}
  }, []);


  return <div ref={mountRef} />
}
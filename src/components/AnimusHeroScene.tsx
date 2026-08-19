import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function AnimusHeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);
    scene.fog = new THREE.FogExp2(0x06080e, 0.022);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 4, 18);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0x38bdf8, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 3, 50);
    pointLight.position.set(0, 10, 5);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x818cf8, 2, 40);
    backLight.position.set(0, -2, -10);
    scene.add(backLight);

    // 4. Animus Floor Grid
    const gridHelper = new THREE.GridHelper(120, 60, 0x38bdf8, 0x1e293b);
    gridHelper.position.y = -2;
    const gridMat = gridHelper.material as THREE.Material;
    gridMat.opacity = 0.35;
    gridMat.transparent = true;
    scene.add(gridHelper);

    // 5. Monolithic Rising Animus Data Cubes & Pillars
    const cubeCount = 45;
    const cubes: { mesh: THREE.Mesh; initialY: number; speed: number; phase: number; maxHeight: number }[] = [];
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < cubeCount; i++) {
      const scaleX = 0.6 + Math.random() * 1.4;
      const scaleZ = 0.6 + Math.random() * 1.4;
      const height = 1.5 + Math.random() * 6.5;

      const isCyan = Math.random() > 0.4;
      const mat = new THREE.MeshStandardMaterial({
        color: isCyan ? 0x0f172a : 0x090d16,
        emissive: isCyan ? 0x38bdf8 : 0x818cf8,
        emissiveIntensity: 0.25 + Math.random() * 0.4,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: Math.random() > 0.7,
      });

      const mesh = new THREE.Mesh(boxGeo, mat);
      
      const angle = Math.random() * Math.PI * 2;
      const radius = 6 + Math.random() * 28;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius - 8;
      const initialY = -2 + height / 2;

      mesh.position.set(x, initialY, z);
      mesh.scale.set(scaleX, height, scaleZ);

      // Add wireframe edge helper to some monoliths
      if (Math.random() > 0.4) {
        const edges = new THREE.EdgesGeometry(boxGeo);
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
        );
        mesh.add(line);
      }

      scene.add(mesh);

      cubes.push({
        mesh,
        initialY,
        speed: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        maxHeight: 1.5 + Math.random() * 3,
      });
    }

    // 6. Animus Rising Data Dust / Particles
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = -2 + Math.random() * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
      particleSpeeds[i] = 0.02 + Math.random() * 0.05;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 7. Mouse / Touch Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 4;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 6;
      mouseY = -(e.clientY / innerHeight - 0.5) * 3;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 8. Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Camera Interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY + 4 - targetY) * 0.05;
      camera.position.x = targetX;
      camera.position.y = targetY;
      camera.lookAt(0, 2, -10);

      // Animate Rising/Dissolving Monoliths
      cubes.forEach((cube) => {
        const offset = Math.sin(elapsedTime * cube.speed + cube.phase) * cube.maxHeight;
        cube.mesh.position.y = cube.initialY + offset;
        cube.mesh.rotation.y += 0.002;
      });

      // Animate Rising Animus Particles
      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += particleSpeeds[i];
        if (posArray[i * 3 + 1] > 22) {
          posArray[i * 3 + 1] = -2;
          posArray[i * 3] = (Math.random() - 0.5) * 50;
          posArray[i * 3 + 2] = (Math.random() - 0.5) * 50 - 5;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Animus floor slow sweep
      gridHelper.rotation.y = elapsedTime * 0.01;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      boxGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

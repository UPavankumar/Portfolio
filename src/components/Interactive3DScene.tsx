import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Interactive3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02040a, 0.025);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 10);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // 4. Create Multiple Floating & Roaming 3D Meshes
    const roamingGroup = new THREE.Group();
    scene.add(roamingGroup);

    interface FloatingObject {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      speed: number;
      offset: number;
      rotSpeed: THREE.Vector3;
      targetZ: number;
    }

    const floatingObjects: FloatingObject[] = [];

    // Materials
    const cyanMat = new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      metalness: 0.8,
      roughness: 0.2,
      wireframe: true,
    });

    const violetMat = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      metalness: 0.7,
      roughness: 0.3,
      wireframe: true,
    });

    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
    });

    const pinkMat = new THREE.MeshPhysicalMaterial({
      color: 0xec4899,
      metalness: 0.6,
      roughness: 0.4,
      wireframe: true,
    });

    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 1),
      new THREE.TorusGeometry(1.4, 0.4, 16, 32),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TetrahedronGeometry(1.6, 0),
      new THREE.DodecahedronGeometry(1.3, 0),
      new THREE.TorusKnotGeometry(1.0, 0.3, 64, 16),
    ];

    const materials = [cyanMat, violetMat, emeraldMat, pinkMat];

    // Create 14 floating roaming 3D elements spread across 3D space & scroll depths
    for (let i = 0; i < 14; i++) {
      const geo = geometries[i % geometries.length];
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(geo, mat);

      // Initial random 3D position
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 20 - (i * 2); // Distribute vertically along scroll depth
      const z = (Math.random() - 0.5) * 8 - 2;

      mesh.position.set(x, y, z);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      roamingGroup.add(mesh);

      floatingObjects.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        speed: Math.random() * 0.8 + 0.4,
        offset: Math.random() * Math.PI * 2,
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        targetZ: z,
      });
    }

    // 5. 3D Particle Cloud Background
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorCyan = new THREE.Color(0x00f0ff);
    const colorViolet = new THREE.Color(0x8b5cf6);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 15;

      const c = colorCyan.clone().lerp(colorViolet, Math.random());
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. Lighting Setup
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const light1 = new THREE.PointLight(0x00f0ff, 3, 25);
    light1.position.set(6, 6, 6);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x8b5cf6, 2.5, 25);
    light2.position.set(-6, -6, -3);
    scene.add(light2);

    // 7. Input & Scroll Listeners
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const time = clock.getElapsedTime();

      // Smooth lerp for input
      currentMouseX += (targetMouseX - currentMouseX) * 0.06;
      currentMouseY += (targetMouseY - currentMouseY) * 0.06;
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;

      const scrollOffset = currentScrollY * 0.008; // Scroll drives Y displacement

      // Move camera along scroll depth
      camera.position.y = -scrollOffset + currentMouseY * 1.2;
      camera.position.x = currentMouseX * 1.5 + Math.sin(time * 0.2) * 0.5;
      camera.position.z = 10 + Math.cos(time * 0.3) * 0.5;

      // Animate roaming 3D elements
      floatingObjects.forEach((obj, idx) => {
        const floatY = Math.sin(time * obj.speed + obj.offset) * 0.8;
        const floatX = Math.cos(time * obj.speed * 0.7 + obj.offset) * 0.6;
        const floatZ = Math.sin(time * obj.speed * 0.5 + obj.offset) * 0.4;

        // Position = base position + continuous roaming float + scroll response
        obj.mesh.position.x = obj.basePos.x + floatX + currentMouseX * (idx % 2 === 0 ? 1 : -1) * 0.8;
        obj.mesh.position.y = obj.basePos.y + floatY - scrollOffset * 0.15;
        obj.mesh.position.z = obj.basePos.z + floatZ;

        // Continuous rotation
        obj.mesh.rotation.x += obj.rotSpeed.x;
        obj.mesh.rotation.y += obj.rotSpeed.y;
        obj.mesh.rotation.z += obj.rotSpeed.z;
      });

      // Slowly rotate background particle cloud
      particleSystem.rotation.y = time * 0.03;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-80"
      aria-hidden="true"
    />
  );
}

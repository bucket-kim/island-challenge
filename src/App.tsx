import { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";

// Main App Component
const App = () => {
  const [isDay, setIsDay] = useState(true);
  const [popupContent, setPopupContent] = useState(null);

  return (
    <div className="w-full h-screen overflow-hidden bg-blue-900 relative">
      <UI isDay={isDay} setIsDay={setIsDay} />
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ position: "fixed", top: "0", left: "0" }}
      >
        <IslandScene isDay={isDay} setPopupContent={setPopupContent} />
      </Canvas>

      {popupContent && (
        <InfoPopup content={popupContent} setPopupContent={setPopupContent} />
      )}
    </div>
  );
};

// Main 3D Scene Component
const IslandScene = ({ isDay, setPopupContent }) => {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={isDay ? 0.5 : 0.2} />
      <directionalLight
        position={isDay ? [5, 10, 5] : [-5, 5, -5]}
        intensity={isDay ? 1 : 0.3}
        color={isDay ? "#ffebcd" : "#4682b4"}
      />

      {/* Island Components */}
      <Island />
      <Volcano setPopupContent={setPopupContent} />
      <PalmForest setPopupContent={setPopupContent} />
      <CoralReef setPopupContent={setPopupContent} />
      <Water isDay={isDay} />

      {/* Night sky */}
      {!isDay && <Stars radius={100} depth={50} count={5000} factor={4} />}

      {/* Camera controls */}
      <OrbitControls
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />
    </>
  );
};

// Base Island Component
const Island = () => {
  const islandRef = useRef();

  useFrame((state) => {
    if (islandRef.current) {
      islandRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={islandRef}>
      {/* Island base */}
      <mesh position={[0, -0.5, 0]}>
        <coneGeometry args={[3, 1, 8]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Island top (grass) */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[3, 3, 0.1, 16]} />
        <meshStandardMaterial color="#7cfc00" />
      </mesh>
    </group>
  );
};

// Volcano Component
const Volcano = ({ setPopupContent }) => {
  const [hovered, setHovered] = useState(false);
  const volcanoRef = useRef();

  useFrame((state) => {
    if (volcanoRef.current && hovered) {
      volcanoRef.current.scale.y =
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <group>
      <mesh
        ref={volcanoRef}
        position={[1, 0.5, 1]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() =>
          setPopupContent({
            title: "Volcanic Activity",
            text: "Volcanoes form islands by erupting magma from beneath the Earth's crust. When lava cools, it creates new land. Many islands in the Pacific formed this way!",
          })
        }
      >
        <coneGeometry args={[0.7, 1.2, 16]} />
        <meshStandardMaterial color="#8B0000" />

        {/* Volcano crater */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.3, 0.5, 0.2, 16]} />
          <meshStandardMaterial color="#FF4500" />
        </mesh>
      </mesh>

      {hovered && (
        <Text
          position={[1, 2, 1]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Volcano
        </Text>
      )}
    </group>
  );
};

// Palm Forest Component
const PalmForest = ({ setPopupContent }) => {
  const [hovered, setHovered] = useState(false);
  const treeGroupRef = useRef();

  useFrame((state) => {
    if (treeGroupRef.current && hovered) {
      treeGroupRef.current.children.forEach((tree, i) => {
        tree.rotation.x = Math.sin(state.clock.elapsedTime + i * 0.5) * 0.05;
      });
    }
  });

  // Create multiple palm trees
  const trees = [];
  const treePositions = [
    [-1.5, 0, 1.5],
    [-2, 0, 0.5],
    [-1.2, 0, 0],
  ];

  for (let i = 0; i < treePositions.length; i++) {
    trees.push(
      <group key={i} position={treePositions[i]}>
        {/* Trunk */}
        <mesh>
          <cylinderGeometry args={[0.08, 0.1, 1, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Leaves */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.3, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>
      </group>,
    );
  }

  return (
    <group
      ref={treeGroupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() =>
        setPopupContent({
          title: "Tropical Forest",
          text: "Palm trees thrive in tropical climates and provide food and shelter for many animals. They have adapted to withstand strong winds and can live for 100 years!",
        })
      }
    >
      {trees}

      {hovered && (
        <Text
          position={[-1.5, 2, 0.7]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Palm Forest
        </Text>
      )}
    </group>
  );
};

// Coral Reef Component
const CoralReef = ({ setPopupContent }) => {
  const [hovered, setHovered] = useState(false);
  const reefRef = useRef();

  useFrame((state) => {
    if (reefRef.current && hovered) {
      reefRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.05;
    }
  });

  return (
    <group>
      <group
        ref={reefRef}
        position={[-2, -0.8, -2]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() =>
          setPopupContent({
            title: "Coral Reef Ecosystem",
            text: "Coral reefs support 25% of all marine species despite covering less than 1% of the ocean floor. They protect coastlines from storms and erosion while providing habitat for thousands of species.",
          })
        }
      >
        {/* Base reef */}
        <mesh>
          <boxGeometry args={[2, 0.2, 2]} />
          <meshStandardMaterial color="#E6E6FA" />
        </mesh>

        {/* Coral formations */}
        <mesh position={[0.5, 0.25, 0.5]}>
          <coneGeometry args={[0.2, 0.3, 8]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>

        <mesh position={[-0.5, 0.25, -0.3]}>
          <sphereGeometry args={[0.2, 8, 8]} />
          <meshStandardMaterial color="#FF1493" />
        </mesh>

        <mesh position={[0, 0.25, -0.5]}>
          <coneGeometry args={[0.15, 0.3, 8]} />
          <meshStandardMaterial color="#9370DB" />
        </mesh>
      </group>

      {hovered && (
        <Text
          position={[-2, 0.5, -2]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          Coral Reef
        </Text>
      )}
    </group>
  );
};

// Animated Water Component
const Water = ({ isDay }) => {
  const waterRef = useRef();

  useFrame((state) => {
    if (waterRef.current) {
      // Gentle wave animation
      waterRef.current.position.y =
        -1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
      <planeGeometry args={[50, 50, 20, 20]} />
      <meshStandardMaterial
        color={isDay ? "#1e90ff" : "#191970"}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// UI Component
const UI = ({ isDay, setIsDay }) => {
  return (
    <div className="ui " style={{ position: "fixed", top: "0", left: "0" }}>
      <h1 className="text-3xl font-bold mb-2">Island Explorer</h1>
      <p className="mb-4">Click objects to learn about the island ecosystem!</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        onClick={() => setIsDay((prev) => !prev)}
      >
        {isDay ? "Switch to Night" : "Switch to Day"}
      </button>
    </div>
  );
};

// Info Popup Component
const InfoPopup = ({ content, setPopupContent }) => {
  return (
    <div className="popup absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-90 p-6 rounded-lg max-w-md text-center shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-3">{content.title}</h2>
      <p className="text-gray-800 mb-4">{content.text}</p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
        onClick={() => setPopupContent(null)}
      >
        Close
      </button>
    </div>
  );
};

export default App;

'use client';

import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import { fillBallPattern } from './ballPattern';
import { useBallScene } from './useBallScene';

// 768×384 es el punto medio entre nitidez de costuras y costo de generarla
// (~70 ms en desktop, una sola vez al montar). Subilo a 1024×512 si querés
// más definición en pantallas muy densas.
const TEX_W = 768;
const TEX_H = 384;

function createBallTexture(): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = TEX_W;
  canvas.height = TEX_H;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D no disponible');

  const image = ctx.createImageData(TEX_W, TEX_H);
  fillBallPattern(image.data, TEX_W, TEX_H);
  ctx.putImageData(image, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export function Ball() {
  const texture = useMemo(() => createBallTexture(), []);

  useEffect(() => () => texture.dispose(), [texture]);

  const group = useBallScene();

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1, 64, 48]} />
        <meshStandardMaterial map={texture} roughness={0.42} metalness={0.05} />
      </mesh>
    </group>
  );
}
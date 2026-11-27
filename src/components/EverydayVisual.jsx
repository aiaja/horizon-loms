import { FIGMA_ASSETS } from '../assets/figmaAssets';

export function EverydayVisual({ iconKey = 'salt', size = 76 }) {
  if (iconKey === 'salt') {
    return (
      <img
        src={FIGMA_ASSETS.saltShakerImg}
        alt="Garam Dapur"
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }
  if (iconKey === 'water' || iconKey === 'air') {
    return (
      <img
        src={FIGMA_ASSETS.waterDropImg}
        alt="Air Minum"
        style={{ width: Math.round(size * 0.78), height: size, objectFit: 'contain' }}
      />
    );
  }
  if (iconKey === 'microchip') {
    return (
      <img
        src={FIGMA_ASSETS.microchipImg}
        alt="Microchip Silikon"
        style={{ width: size, height: size, objectFit: 'contain' }}
      />
    );
  }
  if (iconKey === 'iodine') {
    return (
      <img
        src={FIGMA_ASSETS.iodineBottleImg}
        alt="Antiseptik Iodin"
        style={{ width: Math.round(size * 0.52), height: size, objectFit: 'contain' }}
      />
    );
  }
  if (iconKey === 'balloon') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
        <path d="M40 52 C40 62 34 66 39 74" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="40" cy="30" rx="18" ry="22" fill="#8885D2" stroke="#4F467F" strokeWidth="2" />
        <ellipse cx="34" cy="22" rx="4" ry="7" fill="#C8C7EA" opacity="0.7" />
        <polygon points="36,52 44,52 40,48" fill="#4F467F" />
      </svg>
    );
  }
  if (iconKey === 'battery') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
        <rect x="26" y="14" width="28" height="6" rx="2" fill="#94A3B8" />
        <rect x="18" y="20" width="44" height="46" rx="8" fill="#DE3838" stroke="#9E2828" strokeWidth="2" />
        <path d="M42 29 L33 44 H41 L38 56 L49 41 H41 Z" fill="#FEC233" />
      </svg>
    );
  }
  if (iconKey === 'crystal') {
    return (
      <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
        <polygon points="40,12 64,26 64,54 40,68 16,54 16,26" fill="#00936D" stroke="#00694E" strokeWidth="2" />
        <polygon points="40,12 64,26 40,40 16,26" fill="#5CC5A7" opacity="0.6" />
        <polygon points="40,40 64,26 64,54 40,68" fill="#00694E" opacity="0.45" />
      </svg>
    );
  }
  //fallback icon magnet kalau ga ketemu iconKey yg pas
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <path d="M22 18 V44 C22 55 30 62 40 62 C50 62 58 55 58 44 V18" fill="none" stroke="#E4C18A" strokeWidth="14" strokeLinecap="butt" />
      <rect x="15" y="16" width="14" height="14" rx="3" fill="#FC6E48" />
      <rect x="51" y="16" width="14" height="14" rx="3" fill="#DE3838" />
      <text x="22" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">N</text>
      <text x="58" y="26" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="800">S</text>
    </svg>
  );
}

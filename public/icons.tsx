import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

// ─────────────────────────────────────────────────────────────────
// 1. CONO  –  pink scoop + amber waffle cone
// ─────────────────────────────────────────────────────────────────
export const ConeIcon = (props: IconProps) => (
  <svg width="28" height="34" viewBox="0 0 28 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* scoop */}
    <circle cx="14" cy="11" r="10" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    {/* cone */}
    <path d="M4 21 L24 21 L14 33 Z" fill="#FDE68A" stroke="#D97706" strokeWidth="1" />
    {/* waffle grid */}
    <line x1="9"  y1="21" x2="14" y2="32" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="19" y1="21" x2="14" y2="32" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="6"  y1="25" x2="22" y2="25" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
    <line x1="9"  y1="29" x2="19" y2="29" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 2. MINI DELI  –  small round tub with dome lid
// ─────────────────────────────────────────────────────────────────
export const MiniDeliIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* body */}
    <path d="M4 15 L24 15 L21 26 L7 26 Z" fill="#FEF9C3" stroke="#EAB308" strokeWidth="1.5" />
    {/* dome lid */}
    <path d="M4 15 Q4 5 14 5 Q24 5 24 15 Z" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
    {/* cream swirl */}
    <path d="M9 10 Q14 7 19 10" fill="none" stroke="#FBCFE8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 3. 1/4 KG  –  small amber container (1 dot)
// ─────────────────────────────────────────────────────────────────
export const QuarterKgIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="7" y="5" width="14" height="5" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M8 10 L20 10 L19 24 L9 24 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="14" cy="17" r="2.5" fill="#FCD34D" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 4. 1/2 KG  –  medium amber container (2 dots)
// ─────────────────────────────────────────────────────────────────
export const HalfKgIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="5" y="5" width="18" height="5" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M5 10 L23 10 L22 24 L6 24 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="10" cy="17" r="2.5" fill="#FCD34D" />
    <circle cx="18" cy="17" r="2.5" fill="#FCD34D" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 5. SIMPLE  –  cup + 1 pink scoop
// ─────────────────────────────────────────────────────────────────
export const SimpleIcon = (props: IconProps) => (
  <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 15 L23 15 L20 29 L8 29 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="14" cy="12" r="9" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 6. DOBLE  –  cup + pink & lavender scoops
// ─────────────────────────────────────────────────────────────────
export const DobleIcon = (props: IconProps) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 18 L24 18 L21 29 L9 29 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="11" cy="15" r="7" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    <circle cx="21" cy="15" r="7" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 7. TRIPLE  –  cup + pink, lavender & mint scoops
// ─────────────────────────────────────────────────────────────────
export const TripleIcon = (props: IconProps) => (
  <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 22 L25 22 L22 33 L10 33 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="11" cy="19" r="7" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    <circle cx="21" cy="19" r="7" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5" />
    <circle cx="16" cy="12" r="7" fill="#BBF7D0" stroke="#34D399" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 8. SIMPLE S/A  –  blue cup + blue scoop
// ─────────────────────────────────────────────────────────────────
export const SimpleSAIcon = (props: IconProps) => (
  <svg width="28" height="30" viewBox="0 0 28 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 15 L23 15 L20 29 L8 29 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="14" cy="12" r="9" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 9. DOBLE S/A  –  blue cup + sky-blue & teal scoops
// ─────────────────────────────────────────────────────────────────
export const DobleSAIcon = (props: IconProps) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 18 L24 18 L21 29 L9 29 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="11" cy="15" r="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
    <circle cx="21" cy="15" r="7" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 10. TRIPLE S/A  –  blue cup + three cool-tone scoops
// ─────────────────────────────────────────────────────────────────
export const TripleSAIcon = (props: IconProps) => (
  <svg width="32" height="34" viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M7 22 L25 22 L22 33 L10 33 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="11" cy="19" r="7" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
    <circle cx="21" cy="19" r="7" fill="#CCFBF1" stroke="#14B8A6" strokeWidth="1.5" />
    <circle cx="16" cy="12" r="7" fill="#E0F2FE" stroke="#0369A1" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 11. MAGNUM  –  chocolate-coated bar on stick
// ─────────────────────────────────────────────────────────────────
export const MagnumIcon = (props: IconProps) => (
  <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* stick */}
    <rect x="8" y="26" width="5" height="6" rx="2" fill="#D97706" />
    {/* chocolate exterior */}
    <rect x="2" y="4" width="18" height="23" rx="4" fill="#78350F" />
    {/* cream interior */}
    <rect x="5" y="10" width="12" height="12" rx="2" fill="#FFFBEB" />
    {/* shine */}
    <ellipse cx="8" cy="7" rx="3" ry="1.5" fill="#92400E" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 12. MEDIANA  –  wide open cup with two scoops visible
// ─────────────────────────────────────────────────────────────────
export const MedianaIcon = (props: IconProps) => (
  <svg width="30" height="26" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* cup body */}
    <path d="M2 10 L28 10 L25 24 L5 24 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    {/* rim */}
    <rect x="1" y="8" width="28" height="3" rx="1.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
    {/* two scoops peeking over rim */}
    <ellipse cx="10" cy="9" rx="6" ry="3.5" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1" />
    <ellipse cx="20" cy="9" rx="6" ry="3.5" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 13. ESPECIAL  –  cup + scoop + golden star
// ─────────────────────────────────────────────────────────────────
export const EspecialIcon = (props: IconProps) => (
  <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5 17 L25 17 L22 31 L8 31 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="15" cy="15" r="9" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    {/* 5-point star centred at (15,13), outer r=5, inner r=2 */}
    <path
      d="M15,8 L16.2,11.4 L19.8,11.5 L16.9,13.6 L17.9,17.1 L15,15 L12.1,17.1 L13.1,13.6 L10.2,11.5 L13.8,11.4 Z"
      fill="#FBBF24"
    />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 14. SANDWICH  –  two chocolate wafers + cream layer
// ─────────────────────────────────────────────────────────────────
export const SandwichIcon = (props: IconProps) => (
  <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* top wafer */}
    <rect x="3" y="2"  width="24" height="7" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    {/* cream */}
    <rect x="3" y="9"  width="24" height="6" rx="1" fill="#FFFBEB" stroke="#FDE68A" strokeWidth="1" />
    {/* bottom wafer */}
    <rect x="3" y="15" width="24" height="7" rx="2" fill="#D97706" stroke="#92400E" strokeWidth="1" />
    {/* waffle lines on top wafer */}
    <line x1="9"  y1="2"  x2="9"  y2="9"  stroke="#92400E" strokeWidth="0.8" opacity="0.6" />
    <line x1="15" y1="2"  x2="15" y2="9"  stroke="#92400E" strokeWidth="0.8" opacity="0.6" />
    <line x1="21" y1="2"  x2="21" y2="9"  stroke="#92400E" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 15. BANANA SPLIT  –  banana arch + 3 scoops + boat dish
// ─────────────────────────────────────────────────────────────────
export const BananaSplitIcon = (props: IconProps) => (
  <svg width="36" height="26" viewBox="0 0 36 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* dish */}
    <path d="M2 16 Q2 24 18 24 Q34 24 34 16 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    {/* banana */}
    <path d="M3 14 Q7 6 18 9 Q29 6 33 14" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
    {/* left scoop – pink */}
    <circle cx="9"  cy="13" r="6" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5" />
    {/* center scoop – mint */}
    <circle cx="18" cy="10" r="6" fill="#BBF7D0" stroke="#34D399" strokeWidth="1.5" />
    {/* right scoop – lavender */}
    <circle cx="27" cy="13" r="6" fill="#DDD6FE" stroke="#A78BFA" strokeWidth="1.5" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 16. 1 KG  –  large amber container (3 dots)
// ─────────────────────────────────────────────────────────────────
export const OneKgIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="5" width="24" height="5" rx="2" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
    <path d="M2 10 L26 10 L25 24 L3 24 Z" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
    <circle cx="8"  cy="17" r="2.5" fill="#FCD34D" />
    <circle cx="14" cy="17" r="2.5" fill="#FCD34D" />
    <circle cx="20" cy="17" r="2.5" fill="#FCD34D" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 17. FRUTI PALETAS  –  bicolor fruit popsicle on stick
// ─────────────────────────────────────────────────────────────────
export const FrutiPaletasIcon = (props: IconProps) => (
  <svg width="22" height="32" viewBox="0 0 22 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* stick */}
    <rect x="8" y="25" width="5" height="7" rx="2" fill="#D97706" />
    {/* green top half */}
    <path d="M19,8 Q19,3 11,3 Q3,3 3,8 L3,15 L19,15 Z" fill="#86EFAC" />
    {/* pink/strawberry bottom half */}
    <path d="M3,15 L19,15 L19,24 Q19,26 11,26 Q3,26 3,24 Z" fill="#FCA5A5" />
    {/* full outline */}
    <path d="M19,8 Q19,3 11,3 Q3,3 3,8 L3,24 Q3,26 11,26 Q19,26 19,24 Z" fill="none" stroke="#EA580C" strokeWidth="1.5" />
    {/* divider */}
    <line x1="3" y1="15" x2="19" y2="15" stroke="white" strokeWidth="1.5" />
    {/* seeds */}
    <circle cx="8"  cy="10" r="1" fill="#15803D" />
    <circle cx="14" cy="11" r="1" fill="#15803D" />
    <circle cx="11" cy="8"  r="1" fill="#15803D" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 18. 1/2 KG S/A  –  medium blue container (2 dots)
// ─────────────────────────────────────────────────────────────────
export const HalfKgSAIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="5" y="5" width="18" height="5" rx="2" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M5 10 L23 10 L22 24 L6 24 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="10" cy="17" r="2.5" fill="#93C5FD" />
    <circle cx="18" cy="17" r="2.5" fill="#93C5FD" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 19. 1/4 KG S/A  –  small blue container (1 dot)
// ─────────────────────────────────────────────────────────────────
export const QuarterKgSAIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="7" y="5" width="14" height="5" rx="2" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M8 10 L20 10 L19 24 L9 24 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="14" cy="17" r="2.5" fill="#93C5FD" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// 20. 1 KG S/A  –  large blue container (3 dots)
// ─────────────────────────────────────────────────────────────────
export const OneKgSAIcon = (props: IconProps) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="5" width="24" height="5" rx="2" fill="#BFDBFE" stroke="#3B82F6" strokeWidth="1.5" />
    <path d="M2 10 L26 10 L25 24 L3 24 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5" />
    <circle cx="8"  cy="17" r="2.5" fill="#93C5FD" />
    <circle cx="14" cy="17" r="2.5" fill="#93C5FD" />
    <circle cx="20" cy="17" r="2.5" fill="#93C5FD" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────
// Legacy aliases (keep backward-compatibility with old imports)
// ─────────────────────────────────────────────────────────────────
export const IceCreamIcon  = ConeIcon;
export const CupIcon       = SimpleIcon;
export const ContainerIcon = HalfKgIcon;

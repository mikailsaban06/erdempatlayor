import React from 'react';

// --- THREE.JS JSX TYPES ---
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      cylinderGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      pointLight: any;
      spotLight: any;
      ambientLight: any;
      fog: any;
      color: any;
      primitive: any;
      [elemName: string]: any;
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      group: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshPhysicalMaterial: any;
      meshBasicMaterial: any;
      cylinderGeometry: any;
      circleGeometry: any;
      ringGeometry: any;
      pointLight: any;
      spotLight: any;
      ambientLight: any;
      fog: any;
      color: any;
      primitive: any;
      [elemName: string]: any;
    }
  }
}

// --- APP TYPES ---

export enum PartCategory {
  CASE = 'Case',
  CPU = 'CPU',
  MOTHERBOARD = 'Motherboard',
  GPU = 'GPU',
  RAM = 'RAM',
  COOLER = 'CPU Cooler',
  STORAGE = 'Storage',
  PSU = 'Power Supply',
  FAN = 'Case Fan'
}

export interface Part {
  id: string;
  name: string;
  category: PartCategory;
  price: number;
  wattage: number;
  color?: string;
  description?: string;
  socket?: string;
  formFactor?: string;
  image?: string;
  store?: string;
  manufacturer?: string;
  specs: {
    [key: string]: string | number | boolean;
  };
  inStock?: boolean;
}

export interface BuildState {
  [key: string]: Part | null;
}

export interface SavedBuild {
  id: string;
  name: string;
  updatedAt: number;
  parts: BuildState;
  thumbnail?: string;
}

export interface BuildStats {
  totalPrice: number;
  totalWattage: number;
  compatible: boolean;
  warnings: string[];
}

export type Language = 'en' | 'tr';
export type Theme = 'dark' | 'light';

export interface Currency {
  code: string;
  symbol: string;
  rate: number;
  countryCode: string; 
  name: string;
}

export type FilterType = 'range' | 'checkbox' | 'boolean';

export interface FilterDefinition {
  id: string;
  label: string;
  type: FilterType;
  min?: number;
  max?: number;
  unit?: string;
  step?: number;
  options?: string[]; 
}

export interface CategoryFilterConfig {
  filters: FilterDefinition[];
}

export type UpdateType = 'feature' | 'fix' | 'performance' | 'content' | 'ui';

export interface UpdateItem {
  id: string;
  title: string;
  summary: string;
  description: string;
  date: string;
  version?: string;
  type: UpdateType;
}

// --- BENCHMARKS ---

export type BenchmarkCategory = 'GPU' | 'CPU' | 'PSU' | 'SSD';

export interface BenchmarkBase {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export type TierGroup = 'T1' | 'T2' | 'T3' | 'T4';
export type QualityTier = 'S' | 'A' | 'B' | 'C' | 'D';

export interface BenchmarkGPU extends BenchmarkBase {
  type: 'GPU';
  brand: 'NVIDIA' | 'AMD' | 'Intel';
  vram: number;
  vramType: 'GDDR6X' | 'GDDR6' | 'GDDR7' | 'HBM2';
  tierGroup: TierGroup;
  tierLabel: string;
  percentile: number;
}

export interface BenchmarkCPU extends BenchmarkBase {
  type: 'CPU';
  brand: 'Intel' | 'AMD';
  cores: number;
  threads: number;
  tdp: number;
  memorySupport: 'DDR4' | 'DDR5' | 'DDR4+DDR5';
  tierGroup: TierGroup;
  tierLabel: string;
  percentile: number;
}

export interface BenchmarkPSU extends BenchmarkBase {
  type: 'PSU';
  brand: string;
  wattage: number;
  efficiency: '80+ Bronze' | '80+ Gold' | '80+ Platinum' | '80+ Titanium';
  modular: 'Full' | 'Semi' | 'No';
  atx3: boolean;
  qualityTier: QualityTier;
  score: number;
}

export interface BenchmarkSSD extends BenchmarkBase {
  type: 'SSD';
  brand: string;
  interface: 'Gen5' | 'Gen4' | 'Gen3' | 'SATA';
  capacity: string;
  readSpeed: number;
  writeSpeed: number;
  qualityTier: QualityTier;
  score: number;
}

export type BenchmarkItem = BenchmarkGPU | BenchmarkCPU | BenchmarkPSU | BenchmarkSSD;

// --- COMMUNITY GROUPS ---

export type GroupRole = 'OWNER' | 'MODERATOR' | 'HELPER' | 'MEMBER';

export interface User {
  id: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
}

export interface GroupMember {
  userId: string;
  role: GroupRole;
  joinedAt: number;
  mutedUntil?: number;
  bannedUntil?: number;
}

export interface Announcement {
  id: string;
  groupId: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: number;
  isPinned: boolean;
}

export interface Group {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  banner: string;
  ownerId: string;
  members: GroupMember[];
  createdAt: number;
  tags: string[];
  popularityScore: number;
  rules?: string;
  isPrivate?: boolean;
  announcements?: Announcement[];
}

export interface ChatMessage {
  id: string;
  groupId: string;
  userId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'system' | 'image';
  imageUrl?: string;
}

// --- SHARED BUILDS FEED (NEW) ---

export type ReactionType = 'like' | 'fire' | 'diamond' | 'mindblown';
export type Visibility = 'public' | 'unlisted' | 'private';

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null; // For threading (1 level deep usually)
  userId: string;
  username: string;
  avatar: string;
  content: string;
  createdAt: number;
  isDeleted: boolean;
  likes: string[]; // userIds
}

export interface BuildPost {
  id: string;
  originalBuildId: string;
  title: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  thumbnail?: string;
  images: string[]; // Additional screenshots
  
  // The actual build data for remixing/checking
  parts: BuildState;

  // Parts Snapshot for cards
  partsSummary: {
      cpu: string;
      gpu: string;
      case: string;
      ram: string;
  };
  totalPrice: number;
  totalWattage: number;
  isCompatible: boolean;
  
  tags: string[];
  visibility: Visibility;
  
  // Metrics
  views: number;
  favorites: number;
  commentsCount: number;
  
  // User Interactions
  reactions: Record<string, ReactionType>; // userId -> ReactionType
  favoritedBy: string[]; // userIds
  
  createdAt: number;
  updatedAt: number;
  
  // Badges & Verification
  isVerified?: boolean;
  verificationWarnings?: string[];
  checkedAt?: number;
  isFeatured?: boolean;
}

// Deprecated SharedBuild interface kept for transition if needed, but mapped to BuildPost
export type SharedBuild = BuildPost;
export type BuildComment = Comment;
import { BenchmarkGPU, BenchmarkCPU, BenchmarkPSU, BenchmarkSSD } from '../types';

// --- GPUs ---
export const BENCHMARK_GPUS: BenchmarkGPU[] = [
  // T1 - Elite 4K
  {
    id: 'gpu_4090', type: 'GPU', name: 'NVIDIA GeForce RTX 4090', brand: 'NVIDIA', vram: 24, vramType: 'GDDR6X', price: 1599,
    tierGroup: 'T1', tierLabel: 'Elite (4K Ultra + RT)', percentile: 100
  },
  {
    id: 'gpu_7900xtx', type: 'GPU', name: 'AMD Radeon RX 7900 XTX', brand: 'AMD', vram: 24, vramType: 'GDDR6', price: 999,
    tierGroup: 'T1', tierLabel: 'Elite (4K Ultra + RT)', percentile: 92
  },
  {
    id: 'gpu_4080s', type: 'GPU', name: 'NVIDIA GeForce RTX 4080 Super', brand: 'NVIDIA', vram: 16, vramType: 'GDDR6X', price: 999,
    tierGroup: 'T1', tierLabel: 'Elite (4K Ultra + RT)', percentile: 88
  },
  {
    id: 'gpu_4080', type: 'GPU', name: 'NVIDIA GeForce RTX 4080', brand: 'NVIDIA', vram: 16, vramType: 'GDDR6X', price: 1199,
    tierGroup: 'T1', tierLabel: 'Elite (4K Ultra + RT)', percentile: 86
  },
  
  // T2 - High End 1440p
  {
    id: 'gpu_7900xt', type: 'GPU', name: 'AMD Radeon RX 7900 XT', brand: 'AMD', vram: 20, vramType: 'GDDR6', price: 749,
    tierGroup: 'T2', tierLabel: 'High-End (1440p Ultra)', percentile: 79
  },
  {
    id: 'gpu_4070tis', type: 'GPU', name: 'NVIDIA GeForce RTX 4070 Ti Super', brand: 'NVIDIA', vram: 16, vramType: 'GDDR6X', price: 799,
    tierGroup: 'T2', tierLabel: 'High-End (1440p Ultra)', percentile: 76
  },
  {
    id: 'gpu_4070ti', type: 'GPU', name: 'NVIDIA GeForce RTX 4070 Ti', brand: 'NVIDIA', vram: 12, vramType: 'GDDR6X', price: 749,
    tierGroup: 'T2', tierLabel: 'High-End (1440p Ultra)', percentile: 72
  },
  {
    id: 'gpu_7800xt', type: 'GPU', name: 'AMD Radeon RX 7800 XT', brand: 'AMD', vram: 16, vramType: 'GDDR6', price: 499,
    tierGroup: 'T2', tierLabel: 'High-End (1440p Ultra)', percentile: 68
  },
  
  // T3 - Mid Range 1440p/1080p
  {
    id: 'gpu_4070', type: 'GPU', name: 'NVIDIA GeForce RTX 4070', brand: 'NVIDIA', vram: 12, vramType: 'GDDR6X', price: 549,
    tierGroup: 'T3', tierLabel: 'Mid-Range (1440p/1080p Ultra)', percentile: 65
  },
  {
    id: 'gpu_7700xt', type: 'GPU', name: 'AMD Radeon RX 7700 XT', brand: 'AMD', vram: 12, vramType: 'GDDR6', price: 449,
    tierGroup: 'T3', tierLabel: 'Mid-Range (1440p/1080p Ultra)', percentile: 61
  },
  {
    id: 'gpu_4060ti16', type: 'GPU', name: 'NVIDIA GeForce RTX 4060 Ti 16GB', brand: 'NVIDIA', vram: 16, vramType: 'GDDR6', price: 449,
    tierGroup: 'T3', tierLabel: 'Mid-Range (1440p/1080p Ultra)', percentile: 55
  },
  {
    id: 'gpu_6800', type: 'GPU', name: 'AMD Radeon RX 6800', brand: 'AMD', vram: 16, vramType: 'GDDR6', price: 399,
    tierGroup: 'T3', tierLabel: 'Mid-Range (1440p/1080p Ultra)', percentile: 58
  },

  // T4 - Budget 1080p
  {
    id: 'gpu_7600', type: 'GPU', name: 'AMD Radeon RX 7600', brand: 'AMD', vram: 8, vramType: 'GDDR6', price: 269,
    tierGroup: 'T4', tierLabel: 'Entry (1080p High)', percentile: 45
  },
  {
    id: 'gpu_4060', type: 'GPU', name: 'NVIDIA GeForce RTX 4060', brand: 'NVIDIA', vram: 8, vramType: 'GDDR6', price: 299,
    tierGroup: 'T4', tierLabel: 'Entry (1080p High)', percentile: 47
  },
  {
    id: 'gpu_a770', type: 'GPU', name: 'Intel Arc A770', brand: 'Intel', vram: 16, vramType: 'GDDR6', price: 329,
    tierGroup: 'T4', tierLabel: 'Entry (1080p High)', percentile: 49
  },
  {
    id: 'gpu_6600', type: 'GPU', name: 'AMD Radeon RX 6600', brand: 'AMD', vram: 8, vramType: 'GDDR6', price: 199,
    tierGroup: 'T4', tierLabel: 'Entry (1080p High)', percentile: 35
  }
];

// --- CPUs ---
export const BENCHMARK_CPUS: BenchmarkCPU[] = [
  // T1
  {
    id: 'cpu_7800x3d', type: 'CPU', name: 'AMD Ryzen 7 7800X3D', brand: 'AMD', cores: 8, threads: 16, tdp: 120, memorySupport: 'DDR5', price: 399,
    tierGroup: 'T1', tierLabel: 'Elite Gaming', percentile: 100
  },
  {
    id: 'cpu_14900k', type: 'CPU', name: 'Intel Core i9-14900K', brand: 'Intel', cores: 24, threads: 32, tdp: 125, memorySupport: 'DDR4+DDR5', price: 549,
    tierGroup: 'T1', tierLabel: 'Elite Gaming', percentile: 98
  },
  {
    id: 'cpu_7950x3d', type: 'CPU', name: 'AMD Ryzen 9 7950X3D', brand: 'AMD', cores: 16, threads: 32, tdp: 120, memorySupport: 'DDR5', price: 599,
    tierGroup: 'T1', tierLabel: 'Elite Gaming', percentile: 97
  },
  
  // T2
  {
    id: 'cpu_14700k', type: 'CPU', name: 'Intel Core i7-14700K', brand: 'Intel', cores: 20, threads: 28, tdp: 125, memorySupport: 'DDR4+DDR5', price: 399,
    tierGroup: 'T2', tierLabel: 'High Performance', percentile: 92
  },
  {
    id: 'cpu_13600k', type: 'CPU', name: 'Intel Core i5-13600K', brand: 'Intel', cores: 14, threads: 20, tdp: 125, memorySupport: 'DDR4+DDR5', price: 299,
    tierGroup: 'T2', tierLabel: 'High Performance', percentile: 88
  },
  {
    id: 'cpu_7700x', type: 'CPU', name: 'AMD Ryzen 7 7700X', brand: 'AMD', cores: 8, threads: 16, tdp: 105, memorySupport: 'DDR5', price: 299,
    tierGroup: 'T2', tierLabel: 'High Performance', percentile: 86
  },

  // T3
  {
    id: 'cpu_7600', type: 'CPU', name: 'AMD Ryzen 5 7600', brand: 'AMD', cores: 6, threads: 12, tdp: 65, memorySupport: 'DDR5', price: 219,
    tierGroup: 'T3', tierLabel: 'Mainstream', percentile: 75
  },
  {
    id: 'cpu_13400f', type: 'CPU', name: 'Intel Core i5-13400F', brand: 'Intel', cores: 10, threads: 16, tdp: 65, memorySupport: 'DDR4+DDR5', price: 209,
    tierGroup: 'T3', tierLabel: 'Mainstream', percentile: 72
  },
  {
    id: 'cpu_5800x3d', type: 'CPU', name: 'AMD Ryzen 7 5800X3D', brand: 'AMD', cores: 8, threads: 16, tdp: 105, memorySupport: 'DDR4', price: 329,
    tierGroup: 'T3', tierLabel: 'Mainstream', percentile: 80
  },

  // T4
  {
    id: 'cpu_5600x', type: 'CPU', name: 'AMD Ryzen 5 5600X', brand: 'AMD', cores: 6, threads: 12, tdp: 65, memorySupport: 'DDR4', price: 149,
    tierGroup: 'T4', tierLabel: 'Entry Level', percentile: 55
  },
  {
    id: 'cpu_12100f', type: 'CPU', name: 'Intel Core i3-12100F', brand: 'Intel', cores: 4, threads: 8, tdp: 58, memorySupport: 'DDR4+DDR5', price: 99,
    tierGroup: 'T4', tierLabel: 'Entry Level', percentile: 45
  }
];

// --- PSUs ---
export const BENCHMARK_PSUS: BenchmarkPSU[] = [
  // S Tier
  {
    id: 'psu_ax1600i', type: 'PSU', name: 'Corsair AX1600i', brand: 'Corsair', wattage: 1600, efficiency: '80+ Titanium', modular: 'Full', atx3: false, qualityTier: 'S', score: 99, price: 609
  },
  {
    id: 'psu_vertex1200', type: 'PSU', name: 'Seasonic Vertex GX-1200', brand: 'Seasonic', wattage: 1200, efficiency: '80+ Gold', modular: 'Full', atx3: true, qualityTier: 'S', score: 98, price: 229
  },
  {
    id: 'psu_darkpower13', type: 'PSU', name: 'be quiet! Dark Power 13', brand: 'be quiet!', wattage: 1000, efficiency: '80+ Titanium', modular: 'Full', atx3: true, qualityTier: 'S', score: 97, price: 289
  },
  
  // A Tier
  {
    id: 'psu_rm1000x', type: 'PSU', name: 'Corsair RM1000x Shift', brand: 'Corsair', wattage: 1000, efficiency: '80+ Gold', modular: 'Full', atx3: true, qualityTier: 'A', score: 93, price: 189
  },
  {
    id: 'psu_mpg1000', type: 'PSU', name: 'MSI MPG A1000G', brand: 'MSI', wattage: 1000, efficiency: '80+ Gold', modular: 'Full', atx3: true, qualityTier: 'A', score: 92, price: 159
  },
  {
    id: 'psu_toughpower', type: 'PSU', name: 'Thermaltake GF3 850W', brand: 'Thermaltake', wattage: 850, efficiency: '80+ Gold', modular: 'Full', atx3: true, qualityTier: 'A', score: 90, price: 119
  },
  {
    id: 'psu_focusgx', type: 'PSU', name: 'Seasonic Focus GX-850', brand: 'Seasonic', wattage: 850, efficiency: '80+ Gold', modular: 'Full', atx3: true, qualityTier: 'A', score: 91, price: 139
  },

  // B Tier
  {
    id: 'psu_supernova', type: 'PSU', name: 'EVGA SuperNOVA 750 GT', brand: 'EVGA', wattage: 750, efficiency: '80+ Gold', modular: 'Full', atx3: false, qualityTier: 'B', score: 82, price: 99
  },
  {
    id: 'psu_mwe', type: 'PSU', name: 'Cooler Master MWE Gold 850 V2', brand: 'Cooler Master', wattage: 850, efficiency: '80+ Gold', modular: 'Full', atx3: false, qualityTier: 'B', score: 79, price: 95
  },
  {
    id: 'psu_cx750', type: 'PSU', name: 'Corsair CX750M', brand: 'Corsair', wattage: 750, efficiency: '80+ Bronze', modular: 'Semi', atx3: false, qualityTier: 'B', score: 75, price: 79
  },
  
  // C Tier
  {
    id: 'psu_smart', type: 'PSU', name: 'Thermaltake Smart 600W', brand: 'Thermaltake', wattage: 600, efficiency: '80+ Gold', modular: 'No', atx3: false, qualityTier: 'C', score: 60, price: 45
  },
  {
    id: 'psu_cv650', type: 'PSU', name: 'Corsair CV650', brand: 'Corsair', wattage: 650, efficiency: '80+ Bronze', modular: 'No', atx3: false, qualityTier: 'C', score: 65, price: 59
  }
];

// --- SSDs ---
export const BENCHMARK_SSDS: BenchmarkSSD[] = [
  // S Tier (Gen5)
  {
    id: 'ssd_t700', type: 'SSD', name: 'Crucial T700 2TB', brand: 'Crucial', interface: 'Gen5', capacity: '2TB', readSpeed: 12400, writeSpeed: 11800, qualityTier: 'S', score: 99, price: 299
  },
  {
    id: 'ssd_mp700', type: 'SSD', name: 'Corsair MP700 Pro', brand: 'Corsair', interface: 'Gen5', capacity: '2TB', readSpeed: 12000, writeSpeed: 11000, qualityTier: 'S', score: 98, price: 319
  },

  // A Tier (High End Gen4)
  {
    id: 'ssd_990pro', type: 'SSD', name: 'Samsung 990 Pro', brand: 'Samsung', interface: 'Gen4', capacity: '2TB', readSpeed: 7450, writeSpeed: 6900, qualityTier: 'A', score: 95, price: 179
  },
  {
    id: 'ssd_sn850x', type: 'SSD', name: 'WD Black SN850X', brand: 'Western Digital', interface: 'Gen4', capacity: '2TB', readSpeed: 7300, writeSpeed: 6600, qualityTier: 'A', score: 94, price: 159
  },
  {
    id: 'ssd_kc3000', type: 'SSD', name: 'Kingston KC3000', brand: 'Kingston', interface: 'Gen4', capacity: '2TB', readSpeed: 7000, writeSpeed: 7000, qualityTier: 'A', score: 92, price: 149
  },
  {
    id: 'ssd_p44', type: 'SSD', name: 'Solidigm P44 Pro', brand: 'Solidigm', interface: 'Gen4', capacity: '2TB', readSpeed: 7000, writeSpeed: 6500, qualityTier: 'A', score: 93, price: 169
  },

  // B Tier (Mid Gen4 / High Gen3)
  {
    id: 'ssd_970evo', type: 'SSD', name: 'Samsung 970 EVO Plus', brand: 'Samsung', interface: 'Gen3', capacity: '1TB', readSpeed: 3500, writeSpeed: 3300, qualityTier: 'B', score: 75, price: 89
  },
  {
    id: 'ssd_p3plus', type: 'SSD', name: 'Crucial P3 Plus', brand: 'Crucial', interface: 'Gen4', capacity: '1TB', readSpeed: 5000, writeSpeed: 3600, qualityTier: 'B', score: 70, price: 69
  },

  // C Tier (SATA / Budget NVMe)
  {
    id: 'ssd_mx500', type: 'SSD', name: 'Crucial MX500', brand: 'Crucial', interface: 'SATA', capacity: '1TB', readSpeed: 560, writeSpeed: 510, qualityTier: 'C', score: 50, price: 69
  },
  {
    id: 'ssd_870evo', type: 'SSD', name: 'Samsung 870 EVO', brand: 'Samsung', interface: 'SATA', capacity: '1TB', readSpeed: 560, writeSpeed: 530, qualityTier: 'C', score: 52, price: 79
  }
];
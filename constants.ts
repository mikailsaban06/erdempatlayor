import { Part, PartCategory, FilterDefinition } from './types';

// --- Dynamic Filter Configuration ---

export const CATEGORY_FILTERS: Record<PartCategory, FilterDefinition[]> = {
  [PartCategory.CPU]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 1000, unit: '$', step: 10 },
    { id: 'manufacturer', label: 'Manufacturer', type: 'checkbox', options: ['Intel', 'AMD'] },
    { id: 'Socket', label: 'Socket', type: 'checkbox', options: ['LGA1700', 'AM5', 'AM4'] },
    { id: 'Cores', label: 'Core Count', type: 'range', min: 4, max: 24, step: 2 },
    { id: 'TDP', label: 'TDP (W)', type: 'range', min: 35, max: 300, unit: 'W', step: 5 },
    { id: 'Integrated Graphics', label: 'Integrated Graphics', type: 'checkbox', options: ['Yes', 'No'] },
  ],
  [PartCategory.GPU]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 2500, unit: '$', step: 50 },
    { id: 'manufacturer', label: 'Chipset Brand', type: 'checkbox', options: ['NVIDIA', 'AMD', 'Intel'] },
    { id: 'VRAM', label: 'VRAM (GB)', type: 'range', min: 8, max: 24, unit: 'GB', step: 4 },
    { id: 'Length', label: 'Length (mm)', type: 'range', min: 200, max: 400, unit: 'mm', step: 5 },
    { id: 'Boost Clock', label: 'Boost Clock (MHz)', type: 'range', min: 1000, max: 3000, unit: 'MHz', step: 50 },
  ],
  [PartCategory.CASE]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 500, unit: '$', step: 10 },
    { id: 'manufacturer', label: 'Brand', type: 'checkbox', options: ['NZXT', 'Corsair', 'Hyte', 'Lian Li', 'Fractal Design'] },
    { id: 'Form Factor', label: 'Form Factor', type: 'checkbox', options: ['ATX', 'mATX', 'E-ATX', 'ITX'] },
    { id: 'Side Panel', label: 'Side Panel', type: 'checkbox', options: ['Tempered Glass', 'Mesh', 'Acrylic', 'Solid'] },
    { id: 'Color', label: 'Color', type: 'checkbox', options: ['Black', 'White', 'Red', 'Silver'] },
    { id: 'Max GPU Length', label: 'Max GPU Length (mm)', type: 'range', min: 250, max: 450, unit: 'mm', step: 10 },
  ],
  [PartCategory.MOTHERBOARD]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 800, unit: '$', step: 10 },
    { id: 'Socket', label: 'Socket', type: 'checkbox', options: ['LGA1700', 'AM5', 'AM4'] },
    { id: 'Form Factor', label: 'Form Factor', type: 'checkbox', options: ['ATX', 'mATX', 'ITX'] },
    { id: 'Memory Type', label: 'Memory', type: 'checkbox', options: ['DDR5', 'DDR4'] },
    { id: 'WiFi', label: 'WiFi Support', type: 'checkbox', options: ['Yes', 'No'] },
  ],
  [PartCategory.RAM]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 400, unit: '$', step: 10 },
    { id: 'Memory Type', label: 'Type', type: 'checkbox', options: ['DDR5', 'DDR4'] },
    { id: 'Capacity', label: 'Total Capacity', type: 'checkbox', options: ['16GB', '32GB', '64GB'] },
    { id: 'Speed', label: 'Speed (MT/s)', type: 'range', min: 3200, max: 8000, unit: 'MT/s', step: 200 },
    { id: 'RGB', label: 'RGB Lighting', type: 'checkbox', options: ['Yes', 'No'] },
  ],
  [PartCategory.COOLER]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 400, unit: '$', step: 10 },
    { id: 'Type', label: 'Cooler Type', type: 'checkbox', options: ['AIO Liquid', 'Air'] },
    { id: 'Radiator Size', label: 'Radiator Size', type: 'checkbox', options: ['120mm', '240mm', '280mm', '360mm', 'None'] },
    { id: 'Height', label: 'Height (mm)', type: 'range', min: 50, max: 180, unit: 'mm', step: 5 },
  ],
  [PartCategory.PSU]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 500, unit: '$', step: 10 },
    { id: 'Wattage', label: 'Wattage (W)', type: 'range', min: 450, max: 1600, unit: 'W', step: 50 },
    { id: 'Efficiency', label: 'Efficiency Rating', type: 'checkbox', options: ['80+ Bronze', '80+ Gold', '80+ Platinum', '80+ Titanium'] },
    { id: 'Modular', label: 'Modular', type: 'checkbox', options: ['Full', 'Semi', 'No'] },
  ],
  [PartCategory.STORAGE]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 500, unit: '$', step: 10 },
    { id: 'Type', label: 'Drive Type', type: 'checkbox', options: ['NVMe M.2', 'SATA SSD', 'HDD'] },
    { id: 'Capacity', label: 'Capacity', type: 'checkbox', options: ['500GB', '1TB', '2TB', '4TB'] },
  ],
  [PartCategory.FAN]: [
    { id: 'price', label: 'Price', type: 'range', min: 0, max: 200, unit: '$', step: 5 },
    { id: 'Size', label: 'Fan Size', type: 'checkbox', options: ['120mm', '140mm'] },
    { id: 'RGB', label: 'RGB', type: 'checkbox', options: ['Yes', 'No'] },
    { id: 'Pack', label: 'Pack Size', type: 'checkbox', options: ['Single', '3-Pack'] },
  ]
};

// --- Enriched Mock Data ---

export const MOCK_PARTS: Part[] = [
  // --- CASES ---
  { 
    id: 'c1', name: 'NZXT H9 Flow (Black)', category: PartCategory.CASE, price: 159.99, wattage: 0, color: '#111', formFactor: 'ATX', store: 'Amazon', manufacturer: 'NZXT', inStock: true,
    specs: { 'Form Factor': 'ATX', 'Side Panel': 'Tempered Glass', 'Color': 'Black', 'Max GPU Length': 435, 'Volume': '65L' }
  },
  { 
    id: 'c2', name: 'Corsair 4000D Airflow (White)', category: PartCategory.CASE, price: 104.99, wattage: 0, color: '#eee', formFactor: 'ATX', store: 'Newegg', manufacturer: 'Corsair', inStock: true,
    specs: { 'Form Factor': 'ATX', 'Side Panel': 'Tempered Glass', 'Color': 'White', 'Max GPU Length': 360, 'Volume': '48L' }
  },
  { 
    id: 'c3', name: 'Hyte Y60 (Red)', category: PartCategory.CASE, price: 199.99, wattage: 0, color: '#991111', formFactor: 'ATX', store: 'B&H', manufacturer: 'Hyte', inStock: false,
    specs: { 'Form Factor': 'ATX', 'Side Panel': 'Tempered Glass', 'Color': 'Red', 'Max GPU Length': 375, 'Volume': '60L' }
  },
  { 
    id: 'c4', name: 'Lian Li O11 Dynamic Evo', category: PartCategory.CASE, price: 169.99, wattage: 0, color: '#111', formFactor: 'ATX', store: 'Amazon', manufacturer: 'Lian Li', inStock: true,
    specs: { 'Form Factor': 'ATX', 'Side Panel': 'Tempered Glass', 'Color': 'Black', 'Max GPU Length': 422, 'Volume': '62L' }
  },

  // --- MOTHERBOARDS ---
  { 
    id: 'mb1', name: 'ASUS ROG Strix Z790-E', category: PartCategory.MOTHERBOARD, price: 399.99, wattage: 70, color: '#222', socket: 'LGA1700', formFactor: 'ATX', store: 'Amazon', manufacturer: 'ASUS', inStock: true,
    specs: { 'Socket': 'LGA1700', 'Form Factor': 'ATX', 'Memory Type': 'DDR5', 'WiFi': 'Yes', 'Chipset': 'Z790' }
  },
  { 
    id: 'mb2', name: 'MSI MAG B650 Tomahawk', category: PartCategory.MOTHERBOARD, price: 219.99, wattage: 50, color: '#333', socket: 'AM5', formFactor: 'ATX', store: 'Best Buy', manufacturer: 'MSI', inStock: true,
    specs: { 'Socket': 'AM5', 'Form Factor': 'ATX', 'Memory Type': 'DDR5', 'WiFi': 'Yes', 'Chipset': 'B650' }
  },
  { 
    id: 'mb3', name: 'ASUS TUF Gaming B550-PLUS', category: PartCategory.MOTHERBOARD, price: 159.99, wattage: 50, color: '#333', socket: 'AM4', formFactor: 'ATX', store: 'Newegg', manufacturer: 'ASUS', inStock: true,
    specs: { 'Socket': 'AM4', 'Form Factor': 'ATX', 'Memory Type': 'DDR4', 'WiFi': 'Yes', 'Chipset': 'B550' }
  },

  // --- CPUs ---
  { 
    id: 'cpu1', name: 'Intel Core i9-14900K', category: PartCategory.CPU, price: 549.99, wattage: 253, socket: 'LGA1700', store: 'Amazon', manufacturer: 'Intel', inStock: true,
    specs: { 'Socket': 'LGA1700', 'Cores': 24, 'Boost Clock': '6.0 GHz', 'TDP': 125, 'Integrated Graphics': 'Yes' }
  },
  { 
    id: 'cpu2', name: 'AMD Ryzen 7 7800X3D', category: PartCategory.CPU, price: 399.00, wattage: 120, socket: 'AM5', store: 'Newegg', manufacturer: 'AMD', inStock: true,
    specs: { 'Socket': 'AM5', 'Cores': 8, 'Boost Clock': '5.0 GHz', 'TDP': 120, 'Integrated Graphics': 'Yes' }
  },
  { 
    id: 'cpu3', name: 'Intel Core i5-13600K', category: PartCategory.CPU, price: 289.99, wattage: 181, socket: 'LGA1700', store: 'Amazon', manufacturer: 'Intel', inStock: true,
    specs: { 'Socket': 'LGA1700', 'Cores': 14, 'Boost Clock': '5.1 GHz', 'TDP': 125, 'Integrated Graphics': 'Yes' }
  },
  { 
    id: 'cpu4', name: 'AMD Ryzen 5 5600X', category: PartCategory.CPU, price: 149.99, wattage: 65, socket: 'AM4', store: 'Amazon', manufacturer: 'AMD', inStock: true,
    specs: { 'Socket': 'AM4', 'Cores': 6, 'Boost Clock': '4.6 GHz', 'TDP': 65, 'Integrated Graphics': 'No' }
  },

  // --- GPUs ---
  { 
    id: 'gpu1', name: 'NVIDIA RTX 4090 FE', category: PartCategory.GPU, price: 1599.99, wattage: 450, color: '#333', store: 'Best Buy', manufacturer: 'NVIDIA', inStock: true,
    specs: { 'VRAM': 24, 'Length': 304, 'Boost Clock': 2520 }
  },
  { 
    id: 'gpu2', name: 'ASUS TUF RTX 4070 Ti', category: PartCategory.GPU, price: 799.99, wattage: 285, color: '#444', store: 'Amazon', manufacturer: 'ASUS', inStock: true,
    specs: { 'VRAM': 12, 'Length': 305, 'Boost Clock': 2760 }
  },
  { 
    id: 'gpu3', name: 'Gigabyte RX 7800 XT', category: PartCategory.GPU, price: 499.99, wattage: 263, color: '#222', store: 'Newegg', manufacturer: 'Gigabyte', inStock: true,
    specs: { 'VRAM': 16, 'Length': 302, 'Boost Clock': 2430 }
  },

  // --- RAM ---
  { 
    id: 'ram1', name: 'G.Skill Trident Z5 RGB 32GB', category: PartCategory.RAM, price: 119.99, wattage: 10, color: '#111', store: 'Amazon', manufacturer: 'G.Skill', inStock: true, 
    specs: { 'Speed': 6000, 'Memory Type': 'DDR5', 'Capacity': '32GB', 'RGB': 'Yes' } 
  },
  { 
    id: 'ram2', name: 'Corsair Vengeance 32GB', category: PartCategory.RAM, price: 99.99, wattage: 5, color: '#111', store: 'Newegg', manufacturer: 'Corsair', inStock: true, 
    specs: { 'Speed': 5600, 'Memory Type': 'DDR5', 'Capacity': '32GB', 'RGB': 'No' } 
  },
  { 
    id: 'ram3', name: 'Corsair Vengeance LPX 16GB', category: PartCategory.RAM, price: 49.99, wattage: 5, color: '#111', store: 'Amazon', manufacturer: 'Corsair', inStock: true, 
    specs: { 'Speed': 3200, 'Memory Type': 'DDR4', 'Capacity': '16GB', 'RGB': 'No' } 
  },

  // --- COOLERS ---
  { 
    id: 'col1', name: 'NZXT Kraken Elite 360', category: PartCategory.COOLER, price: 279.99, wattage: 25, color: '#111', store: 'Amazon', manufacturer: 'NZXT', inStock: true, 
    specs: { 'Radiator Size': '360mm', 'Type': 'AIO Liquid', 'Height': 55 } 
  },
  { 
    id: 'col2', name: 'Noctua NH-D15 Black', category: PartCategory.COOLER, price: 109.95, wattage: 5, color: '#111', store: 'Amazon', manufacturer: 'Noctua', inStock: true, 
    specs: { 'Radiator Size': 'None', 'Type': 'Air', 'Height': 165 } 
  },

  // --- PSUs ---
  { 
    id: 'psu1', name: 'Corsair RM1000x', category: PartCategory.PSU, price: 169.99, wattage: 0, store: 'Best Buy', manufacturer: 'Corsair', inStock: true, 
    specs: { 'Efficiency': '80+ Gold', 'Modular': 'Full', 'Wattage': 1000 } 
  },
  { 
    id: 'psu2', name: 'Seasonic Focus GX-750', category: PartCategory.PSU, price: 99.99, wattage: 0, store: 'Newegg', manufacturer: 'Seasonic', inStock: true, 
    specs: { 'Efficiency': '80+ Gold', 'Modular': 'Full', 'Wattage': 750 } 
  },

  // --- STORAGE ---
  { id: 'sto1', name: 'Samsung 990 Pro 2TB', category: PartCategory.STORAGE, price: 169.99, wattage: 8, store: 'Amazon', manufacturer: 'Samsung', inStock: true, specs: { 'Type': 'NVMe M.2', 'Capacity': '2TB' } },
  { id: 'sto2', name: 'WD Black SN850X 1TB', category: PartCategory.STORAGE, price: 89.99, wattage: 6, store: 'Best Buy', manufacturer: 'Western Digital', inStock: true, specs: { 'Type': 'NVMe M.2', 'Capacity': '1TB' } },

  // --- FANS ---
  { id: 'fan1', name: 'Lian Li Uni Fan SL120 (3-Pack)', category: PartCategory.FAN, price: 79.99, wattage: 15, store: 'Newegg', manufacturer: 'Lian Li', inStock: true, specs: { 'RGB': 'Yes', 'Size': '120mm', 'Pack': '3-Pack' } }
];
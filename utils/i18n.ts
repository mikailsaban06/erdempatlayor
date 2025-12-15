import { Language } from '../types';

const translations = {
  en: {
    build: 'Build',
    products: 'Products',
    tools: 'Useful Tools',
    sales: 'Sales',
    compare: 'Compare',
    gallery: '3D Part Gallery',
    benchmarks: 'Benchmarks',
    community: 'Community',
    updates: 'Updates',
    joinTeam: 'Join our Team',
    forBusiness: 'For Businesses',
    
    // Header
    buildsList: 'Builds List',
    createNew: 'Create New',
    newBuild: 'New Build',
    
    // Builder
    systemBuilder: 'System Builder',
    configureComponents: 'Configure your custom PC components',
    addPart: 'Add Part',
    checkout: 'Checkout System',
    changeSelection: 'Change Selection',
    remove: 'Remove',
    
    // Stats
    totalPrice: 'Total Price',
    estPower: 'Est. Power',
    compatibility: 'Compatibility',
    compatible: 'Compatible',
    issuesFound: 'Issues Found',
    
    // Saved Builds
    savedBuilds: 'Saved Builds',
    lastUpdated: 'Last updated',
    actions: 'Actions',
    load: 'Load',
    clone: 'Clone',
    delete: 'Delete',
    noBuilds: 'No saved builds found.',
    
    // Quick Add
    filters: 'Filters',
    compatibleOnly: 'Compatible Only',
    search: 'Search',
    addToBuild: 'Add to Build',
    inStock: 'In Stock',
    soldOut: 'Sold Out'
  },
  tr: {
    build: 'Montaj',
    products: 'Ürünler',
    tools: 'Araçlar',
    sales: 'İndirimler',
    compare: 'Karşılaştır',
    gallery: '3D Galeri',
    benchmarks: 'Testler',
    community: 'Topluluk',
    updates: 'Güncellemeler',
    joinTeam: 'Ekibimize Katıl',
    forBusiness: 'Kurumsal',
    
    // Header
    buildsList: 'Kayıtlı Sistemler',
    createNew: 'Yeni Oluştur',
    newBuild: 'Yeni Sistem',
    
    // Builder
    systemBuilder: 'Sistem Toplayıcı',
    configureComponents: 'PC bileşenlerini özelleştir',
    addPart: 'Parça Ekle',
    checkout: 'Sistemi Satın Al',
    changeSelection: 'Seçimi Değiştir',
    remove: 'Kaldır',
    
    // Stats
    totalPrice: 'Toplam Fiyat',
    estPower: 'Güç Tüketimi',
    compatibility: 'Uyumluluk',
    compatible: 'Uyumlu',
    issuesFound: 'Sorun Var',
    
    // Saved Builds
    savedBuilds: 'Kayıtlı Sistemler',
    lastUpdated: 'Son güncelleme',
    actions: 'İşlemler',
    load: 'Yükle',
    clone: 'Kopyala',
    delete: 'Sil',
    noBuilds: 'Kayıtlı sistem bulunamadı.',
    
    // Quick Add
    filters: 'Filtreler',
    compatibleOnly: 'Sadece Uyumlu',
    search: 'Ara',
    addToBuild: 'Sisteme Ekle',
    inStock: 'Stokta',
    soldOut: 'Tükendi'
  }
};

export const t = (key: string, lang: Language): string => {
  return (translations[lang] as any)[key] || key;
};
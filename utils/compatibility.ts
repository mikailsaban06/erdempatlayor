import { BuildState, PartCategory, Part } from '../types';

export const checkCompatibility = (build: BuildState) => {
    const parts = Object.values(build).filter((p): p is Part => p !== null && p !== undefined);
    const totalPrice = parts.reduce((acc, p) => acc + Number(p.price || 0), 0);
    const totalWattage = parts.reduce((acc, p) => acc + Number(p.wattage || 0), 0);
    
    const warnings: string[] = [];
    let compatible = true;

    const cpu = build[PartCategory.CPU];
    const mobo = build[PartCategory.MOTHERBOARD];
    const psu = build[PartCategory.PSU];
    const ram = build[PartCategory.RAM];
    const gpu = build[PartCategory.GPU];
    const casePart = build[PartCategory.CASE];
    const cooler = build[PartCategory.COOLER];

    // 1. CPU <-> Motherboard Socket
    if (cpu && mobo) {
        if (cpu.specs['Socket'] !== mobo.specs['Socket']) {
            compatible = false;
            warnings.push(`Incompatible Socket: CPU (${cpu.specs['Socket']}) vs Mobo (${mobo.specs['Socket']})`);
        }
    }

    // 2. RAM <-> Motherboard Type
    if (ram && mobo) {
        if (ram.specs['Memory Type'] !== mobo.specs['Memory Type']) {
            compatible = false;
            warnings.push(`Incompatible RAM: Mobo requires ${mobo.specs['Memory Type']}, RAM is ${ram.specs['Memory Type']}`);
        }
    }

    // 3. PSU Headroom
    if (psu) {
        let psuCapacity = Number(psu.specs['Wattage'] || 0);
        // Fallback parsing if specs missing but name has wattage
        if (psuCapacity === 0) {
            const match = psu.name.match(/(\d{3,4})W?/);
            if (match) psuCapacity = parseInt(match[1]);
            else psuCapacity = 600; // Default fallback
        }

        if (totalWattage > psuCapacity) {
             compatible = false;
             warnings.push(`Insufficient Power: Estimated ${totalWattage}W exceeds PSU capacity (~${psuCapacity}W)`);
        } else if (totalWattage > psuCapacity * 0.9) {
             warnings.push(`Low Power Headroom: Estimated load is >90% of PSU capacity.`);
        }
    } else if (totalWattage > 0) {
        // No PSU selected but consuming power
        warnings.push("No Power Supply Unit (PSU) selected.");
    }

    // 4. GPU Length vs Case
    if (casePart && gpu) {
        const maxGpuLength = Number(casePart.specs['Max GPU Length'] || 999);
        const gpuLength = Number(gpu.specs['Length'] || 0);
        if (gpuLength > maxGpuLength) {
            compatible = false;
            warnings.push(`GPU Clearance: GPU (${gpuLength}mm) exceeds Case max length (${maxGpuLength}mm).`);
        }
    }

    // 5. Cooler Height vs Case (Mock logic as height data isn't always in mocks)
    if (casePart && cooler && cooler.specs['Type'] === 'Air') {
        const coolerHeight = Number(cooler.specs['Height'] || 0);
        // Assuming generic case clearance if not specified
        const caseClearance = 165; 
        if (coolerHeight > caseClearance) {
            compatible = false;
            warnings.push(`Cooler Height: Cooler (${coolerHeight}mm) might not fit in Case (Limit ~${caseClearance}mm).`);
        }
    }

    return { totalPrice, totalWattage, compatible, warnings };
};
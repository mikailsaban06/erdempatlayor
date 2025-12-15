import { UpdateItem } from '../types';

export const UPDATES_DATA: UpdateItem[] = [
    {
        id: 'u1',
        title: 'Shareable Build Links & Currency Support',
        summary: 'You can now share your custom builds via direct links and switch between global currencies.',
        description: `
            <p>We've introduced two major features in this release:</p>
            <ul class="list-disc ml-5 mt-2 space-y-1">
                <li><strong>Build Sharing:</strong> Generate unique URLs for your builds to share with friends or on social media. The receiver gets an instant view of your configuration.</li>
                <li><strong>Multi-Currency Support:</strong> Toggle between USD, EUR, GBP, TRY, and more. Prices are automatically converted based on daily rates.</li>
            </ul>
        `,
        date: '2023-10-25T14:30:00Z',
        version: 'v1.2.0',
        type: 'feature'
    },
    {
        id: 'u2',
        title: 'Performance Improvements for 3D Scene',
        summary: 'Optimized rendering for mobile devices and reduced memory usage.',
        description: `
            <p>We've refactored the <code>PCModel</code> component to use instanced rendering where possible and optimized texture sizes. This results in:</p>
            <ul class="list-disc ml-5 mt-2 space-y-1">
                <li><strong>60 FPS</strong> on mid-range mobile devices.</li>
                <li>Reduced initial load time by 40%.</li>
                <li>Fixed a memory leak when switching between "Case" and "Motherboard" views rapidly.</li>
            </ul>
        `,
        date: '2023-10-18T09:00:00Z',
        version: 'v1.1.5',
        type: 'performance'
    },
    {
        id: 'u3',
        title: 'New Cases and GPU Models',
        summary: 'Added the NZXT H9 Flow and RTX 4090 to the parts library.',
        description: `
            <p>The parts library has been expanded with requested high-end components:</p>
            <ul class="list-disc ml-5 mt-2 space-y-1">
                <li><strong>Cases:</strong> NZXT H9 Flow, Hyte Y70 Touch.</li>
                <li><strong>GPUs:</strong> NVIDIA RTX 4090 FE, ASUS TUF RTX 4070 Ti.</li>
                <li><strong>Motherboards:</strong> Added 3 new Z790 boards with white PCB options.</li>
            </ul>
        `,
        date: '2023-10-10T11:20:00Z',
        type: 'content'
    },
    {
        id: 'u4',
        title: 'UI Visual Overhaul',
        summary: 'A fresh dark mode aesthetic with improved accessibility.',
        description: `
            <p>We've updated the entire color palette to "Zinc" for a more professional look.</p>
            <p>Changes include:</p>
            <ul class="list-disc ml-5 mt-2 space-y-1">
                <li>New transparent glass-morphism sidebars.</li>
                <li>Improved contrast on text elements.</li>
                <li>Smoother transitions for modal windows.</li>
            </ul>
        `,
        date: '2023-10-01T16:45:00Z',
        version: 'v1.1.0',
        type: 'ui'
    },
    {
        id: 'u5',
        title: 'Compatibility Logic Fix',
        summary: 'Fixed an issue where DDR5 RAM was incorrectly flagged as incompatible with some Z790 boards.',
        description: `
            <p>The compatibility engine was being too aggressive with RAM speed checks. We've relaxed the constraints to match manufacturer QVL lists more accurately.</p>
        `,
        date: '2023-09-28T10:00:00Z',
        type: 'fix'
    }
];
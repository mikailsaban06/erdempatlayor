export const BANNED_WORDS = [
    'badword', 'stupid', 'idiot', 'scam', 'spam', 'fake', 
    'aptal', 'salak', 'dolandırıcı', 'fuck', 'shit', 'bitch', 'asshole',
    'cunt', 'dick', 'cock', 'pussy', 'whore', 'slut', 'fag', 'faggot',
    'nigger', 'nigga', 'retard', 'bastard', 'crap', 'bullshit'
];

export const sanitizeText = (text: string): string => {
    if (!text) return '';
    let sanitized = text;
    BANNED_WORDS.forEach(word => {
        // More robust regex to catch word boundaries case-insensitively
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        sanitized = sanitized.replace(regex, '*'.repeat(word.length));
    });
    return sanitized;
};

export const hasProfanity = (text: string): boolean => {
    return BANNED_WORDS.some(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        return regex.test(text);
    });
};
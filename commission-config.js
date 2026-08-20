export const COMMISSION_CONFIG = {
    availability: 'open',
    endpoint: '',
    responseWindow: '',
    deliveryGuidance: '',
    fallbackContact: '',
    contactMethods: ['Email', 'Telegram', 'Discord'],
    budgetOptions: ['Under €50', '€50–€100', '€100–€250', '€250+', 'Not sure yet'],
    pricingGroups: [
        { title: 'Focused fixes and code edits', description: 'Bug fixes, UI cleanup, README work, and small changes to existing projects.' },
        { title: 'Scripts, automation, and bot features', description: 'Focused tools that remove a repetitive task or add one clearly scoped feature.' },
        { title: 'Small websites and landing pages', description: 'Simple, responsive sites and focused pages with a clearly agreed scope.' }
    ]
};

export function trackCommissionEvent(name) {
    if (typeof window.gtag === 'function') window.gtag('event', name);
}

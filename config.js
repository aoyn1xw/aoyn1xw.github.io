// =============================================================================
// SITE CONFIGURATION
// =============================================================================

// Commission availability status.
// Supported values: 'open' | 'limited' | 'closed'
// - 'open':    accepting requests, shown as "Open for commissions"
// - 'limited': accepting a few requests, shown as "Limited availability"
// - 'closed':  form locked, shown as "Commissions closed"
export const COMMISSION_STATUS = 'limited';

export const COMMISSION_STATUS_META = {
    open: {
        label: 'Open for commissions',
        acceptingRequests: true
    },
    limited: {
        label: 'Limited availability',
        acceptingRequests: true
    },
    closed: {
        label: 'Commissions closed',
        acceptingRequests: false
    }
};

export const COMMISSION_CLOSED_MESSAGE = 'Commissions are currently closed. You can still read the process and terms, but requests cannot be submitted right now.';

// Endpoint of the Cloudflare Worker that forwards commission requests
// to Telegram. Replace YOUR_SUBDOMAIN with your real workers.dev subdomain
// after deploying the worker (see worker/README.md).
export const COMMISSION_ENDPOINT = 'https://portfolio-commissions.ayon1xw.workers.dev/';

// Fallback contact used when a submission fails.
export const TELEGRAM_CONTACT_URL = 'https://t.me/ayon1xw';

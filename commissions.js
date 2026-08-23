import {
    COMMISSION_STATUS,
    COMMISSION_STATUS_META,
    COMMISSION_CLOSED_MESSAGE,
    COMMISSION_ENDPOINT,
    TELEGRAM_CONTACT_URL
} from './config.js';

const TELEGRAM_USERNAME_PATTERN = /^[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

const form = document.getElementById('commission-form');
const statusRegion = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');
const descriptionInput = document.getElementById('project_description');
const counterElement = document.getElementById('counter-description');

const touchedFields = new Set();
let isSubmitting = false;
let hasSucceeded = false;

function getStatusMeta() {
    return COMMISSION_STATUS_META[COMMISSION_STATUS] || COMMISSION_STATUS_META.closed;
}

function initStatusLabel() {
    const meta = getStatusMeta();
    document.querySelectorAll('[data-commission-status-label]').forEach(element => {
        element.textContent = meta.label;
    });
}

function normalizeUsername(value) {
    return value.trim().replace(/^@+/, '');
}

function parseReferenceLinks(value) {
    return value
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');
}

function isValidHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function getFieldValue(name) {
    const field = form.elements[name];
    return field ? field.value : '';
}

function validators() {
    return {
        telegram_username() {
            const normalized = normalizeUsername(getFieldValue('telegram_username'));
            if (normalized === '') {
                return 'Enter your Telegram username.';
            }
            if (!TELEGRAM_USERNAME_PATTERN.test(normalized)) {
                return 'That does not look like a valid Telegram username. Use 5–32 letters, numbers, or underscores, starting with a letter.';
            }
            return '';
        },
        project_description() {
            const length = getFieldValue('project_description').trim().length;
            if (length < 50) {
                return `Please describe your project in at least 50 characters (${length}/50 so far).`;
            }
            if (length > 3000) {
                return 'The description must be at most 3,000 characters.';
            }
            return '';
        },
        preferred_deadline() {
            if (getFieldValue('preferred_deadline').trim().length > 100) {
                return 'Keep the deadline under 100 characters.';
            }
            return '';
        },
        reference_links() {
            const links = parseReferenceLinks(getFieldValue('reference_links'));
            if (links.length > 5) {
                return 'You can add up to five reference links.';
            }
            const invalid = links.find(link => !isValidHttpUrl(link));
            if (invalid) {
                return `“${invalid.length > 60 ? invalid.slice(0, 60) + '…' : invalid}” is not a valid URL. Each line must be an http:// or https:// address.`;
            }
            return '';
        },
        accepted_terms() {
            return form.elements.accepted_terms.checked ? '' : 'Please confirm you have read the Commission Terms.';
        },
        understands_request() {
            return form.elements.understands_request.checked ? '' : 'Please confirm you understand this is only a request.';
        }
    };
}

function showError(name, message) {
    const errorElement = document.getElementById(`error-${name}`);
    const field = form.elements[name];
    if (errorElement) {
        errorElement.textContent = message;
    }
    if (field) {
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }
}

function validateField(name) {
    const validator = validators()[name];
    if (!validator) {
        return true;
    }
    const message = validator();
    showError(name, message);
    return message === '';
}

function validateAllFields() {
    let allValid = true;
    Object.keys(validators()).forEach(name => {
        const valid = validateField(name);
        if (!valid) {
            allValid = false;
        }
    });
    return allValid;
}

function isFormValid() {
    return validateAllFields();
}

function updateSubmitState() {
    if (hasSucceeded || isSubmitting) {
        return;
    }
    let valid = true;
    Object.keys(validators()).forEach(name => {
        if (validators()[name]() !== '') {
            valid = false;
        }
    });
    submitButton.disabled = !valid;
}

function updateCounter() {
    const length = descriptionInput.value.length;
    counterElement.textContent = `${length} / 3000 characters`;
}

function lockForm() {
    Array.from(form.elements).forEach(element => {
        element.disabled = true;
    });
}

function setStatusMessage(message, { variant, fallbackLink } = {}) {
    statusRegion.textContent = '';
    const paragraph = document.createElement('p');
    paragraph.className = variant ? `status-message ${variant}` : 'status-message';
    paragraph.textContent = message;
    statusRegion.appendChild(paragraph);

    if (fallbackLink) {
        const link = document.createElement('a');
        link.href = fallbackLink.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'btn btn-secondary fallback-link';
        link.textContent = fallbackLink.label;
        statusRegion.appendChild(link);
    }
}

function buildPayload() {
    return {
        telegram_username: '@' + normalizeUsername(getFieldValue('telegram_username')),
        project_description: getFieldValue('project_description').trim(),
        preferred_deadline: getFieldValue('preferred_deadline').trim(),
        reference_links: parseReferenceLinks(getFieldValue('reference_links')),
        accepted_terms: form.elements.accepted_terms.checked,
        understands_request: form.elements.understands_request.checked,
        website: getFieldValue('website') || ''
    };
}

async function sendRequest(payload) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(COMMISSION_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });
        if (!response.ok) {
            throw new Error(`Worker responded with ${response.status}`);
        }
        const result = await response.json();
        if (!result || result.ok !== true) {
            throw new Error('Worker rejected the request');
        }
        return true;
    } finally {
        clearTimeout(timeout);
    }
}

async function handleSubmit(event) {
    event.preventDefault();

    if (isSubmitting || hasSucceeded) {
        return;
    }

    if (!validateAllFields()) {
        setStatusMessage('Please fix the highlighted fields and try again.', { variant: 'error' });
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) {
            firstInvalid.focus();
        }
        return;
    }

    isSubmitting = true;
    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';

    if (COMMISSION_ENDPOINT.includes('YOUR_SUBDOMAIN')) {
        handleFailure(originalLabel);
        return;
    }

    try {
        await sendRequest(buildPayload());
        hasSucceeded = true;
        lockForm();
        submitButton.textContent = originalLabel;
        setStatusMessage(
            'Request sent. I’ll review it and normally contact you on Telegram within 24 hours. This does not mean the commission has been accepted yet.',
            { variant: 'success' }
        );
    } catch {
        handleFailure(originalLabel);
    }
}

function handleFailure(originalLabel) {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
    setStatusMessage(
        'Something went wrong and your request wasn’t sent. Please message me privately instead.',
        {
            variant: 'error',
            fallbackLink: {
                url: TELEGRAM_CONTACT_URL,
                label: 'Message me on Telegram'
            }
        }
    );
}

function applyClosedStatus() {
    const closedNotice = document.querySelector('[data-commission-closed]');
    if (!getStatusMeta().acceptingRequests) {
        if (closedNotice) {
            closedNotice.hidden = false;
            closedNotice.textContent = COMMISSION_CLOSED_MESSAGE;
        }
        if (form) {
            lockForm();
        }
        if (submitButton) {
            submitButton.setAttribute('title', 'Commissions are currently closed');
        }
    } else if (closedNotice) {
        closedNotice.remove();
    }
}

function initForm() {
    if (!form) {
        return;
    }

    applyClosedStatus();

    Object.keys(validators()).forEach(name => {
        const field = form.elements[name];
        if (!field) {
            return;
        }
        field.addEventListener('blur', () => {
            if (touchedFields.has(name)) {
                validateField(name);
            }
            touchedFields.add(name);
        });
        field.addEventListener('input', () => {
            if (touchedFields.has(name)) {
                validateField(name);
            }
            updateSubmitState();
        });
        field.addEventListener('change', () => {
            touchedFields.add(name);
            validateField(name);
            updateSubmitState();
        });
    });

    descriptionInput.addEventListener('input', updateCounter);
    updateCounter();
    updateSubmitState();

    form.addEventListener('submit', handleSubmit);
}

initStatusLabel();
initForm();

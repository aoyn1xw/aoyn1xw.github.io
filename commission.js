import { COMMISSION_CONFIG as config, trackCommissionEvent } from './commission-config.js';

const form = document.querySelector('#commission-form');
const methodSelect = document.querySelector('#contactMethod');
const budgetSelect = document.querySelector('#budget');
const deadlineType = document.querySelector('#deadlineType');
const deadlineDate = document.querySelector('#deadlineDate');
const deadlineField = document.querySelector('#deadline-field');
const errorSummary = document.querySelector('#error-summary');
const submitError = document.querySelector('#submit-error');
const successPanel = document.querySelector('#success-panel');
let started = false;
let submitting = false;

const messages = {
    name: 'Enter your name or display name.',
    contactMethod: 'Choose how you want to be contacted.',
    projectType: 'Choose a project type.',
    summary: 'Describe what you need in at least 30 characters.',
    requirements: 'List the features that must be included.',
    existingUrl: 'Enter a complete URL starting with https://.',
    budget: 'Choose a budget range or Not sure yet.',
    deadlineType: 'Choose a future deadline or select No fixed deadline.',
    deadlineDate: 'Choose a future deadline or select No fixed deadline.'
};

function setAvailability() {
    const labels = { open: 'Commissions open', limited: 'Limited availability', closed: 'Commissions currently closed' };
    document.querySelector('#commission-status').textContent = labels[config.availability];
    if (config.availability === 'closed') {
        form.hidden = true;
        document.querySelector('.request-heading p:last-child').textContent = 'Requests are not being accepted right now. The services, process, and terms remain available above.';
    }
}

function populateConfig() {
    config.contactMethods.forEach(method => methodSelect.add(new Option(method, method)));
    config.budgetOptions.forEach(budget => budgetSelect.add(new Option(budget, budget)));
    const grid = document.querySelector('#pricing-grid');
    config.pricingGroups.forEach(group => {
        const card = document.createElement('article');
        card.className = 'info-card';
        card.innerHTML = `<h3>${group.title}</h3><p>${group.description}</p><p class="quote-note">Quoted after a manual scope review.</p>`;
        grid.append(card);
    });
    if (!config.endpoint) {
        document.querySelector('#setup-notice').hidden = false;
        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        button.querySelector('.button-text').textContent = 'Online requests temporarily unavailable';
    }
}

function updateContact() {
    const contact = document.querySelector('#contact');
    const label = document.querySelector('#contact-label');
    const method = methodSelect.value;
    label.innerHTML = `${method || 'Contact address or handle'} <span>required</span>`;
    contact.type = method === 'Email' ? 'email' : 'text';
    contact.autocomplete = method === 'Email' ? 'email' : 'off';
    contact.placeholder = method === 'Telegram' ? '@username' : method === 'Discord' ? 'username' : '';
    if (contact.getAttribute('aria-invalid') === 'true') validateField(contact);
}

function setDeadline() {
    const required = deadlineType.value === 'I have a deadline';
    deadlineField.hidden = !required;
    deadlineDate.required = required;
    deadlineDate.min = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    if (!required) {
        deadlineDate.value = '';
        clearError(deadlineDate);
    }
}

function isValidHttpsUrl(value) {
    try { return new URL(value).protocol === 'https:'; } catch { return false; }
}

function fieldMessage(field) {
    const value = field.value.trim();
    if (field.name === 'contact') {
        if (methodSelect.value === 'Email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address.';
        return value ? '' : 'Enter your Telegram or Discord handle.';
    }
    if (field.name === 'summary' && value.length < 30) return messages.summary;
    if (field.name === 'requirements' && value.length < 20) return messages.requirements;
    if (field.name === 'existingUrl' && value && !isValidHttpsUrl(value)) return messages.existingUrl;
    if (field.name === 'deadlineDate' && deadlineDate.required && (!value || value <= new Date().toISOString().slice(0, 10))) return messages.deadlineDate;
    if (field.required && !value) return messages[field.name] || 'Complete this required field.';
    return '';
}

function clearError(field) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    const error = document.querySelector(`#${field.id}-error`);
    if (error) error.textContent = '';
}

function validateField(field) {
    const message = fieldMessage(field);
    const error = document.querySelector(`#${field.id}-error`);
    if (message) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.id}-error`);
        if (error) error.textContent = message;
    } else clearError(field);
    return message;
}

function validateForm() {
    const errors = [];
    form.querySelectorAll('input:not([name="companyWebsite"]), select, textarea').forEach(field => {
        const message = validateField(field);
        if (message) errors.push({ field, message });
    });
    errorSummary.hidden = errors.length === 0;
    const list = errorSummary.querySelector('ul');
    list.innerHTML = '';
    errors.forEach(({ field, message }) => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${field.id}`;
        link.textContent = message;
        link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
        item.append(link); list.append(item);
    });
    if (errors.length) {
        trackCommissionEvent('commission_validation_error');
        errorSummary.focus();
    }
    return errors.length === 0;
}

function payload() {
    return Object.fromEntries(new FormData(form).entries());
}

function setLoading(loading) {
    submitting = loading;
    const button = form.querySelector('[type="submit"]');
    button.disabled = loading;
    button.querySelector('.button-text').textContent = loading ? 'Sending request…' : 'Send commission request';
    button.querySelector('.spinner').hidden = !loading;
}

async function submitRequest(event) {
    event.preventDefault();
    if (!config.endpoint) return;
    if (submitting || !validateForm()) return;
    submitError.hidden = true;
    setLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
        const response = await fetch(config.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload()), signal: controller.signal });
        const result = await response.json().catch(() => null);
        if (!response.ok || !result?.ok || typeof result.requestId !== 'string') throw new Error('Invalid response');
        form.hidden = true;
        errorSummary.hidden = true;
        document.querySelector('#success-copy').textContent = `Thanks. I will review the details and contact you through ${methodSelect.value}.`;
        document.querySelector('#request-reference').textContent = result.requestId;
        successPanel.hidden = false;
        successPanel.querySelector('h2').focus();
        trackCommissionEvent('commission_submit_success');
    } catch {
        submitError.hidden = false;
        submitError.scrollIntoView({ block: 'center' });
        trackCommissionEvent('commission_submit_error');
    } finally {
        clearTimeout(timeout); setLoading(false);
    }
}

methodSelect.addEventListener('change', updateContact);
deadlineType.addEventListener('change', setDeadline);
form.addEventListener('input', event => {
    if (!started && event.target.name !== 'companyWebsite') { started = true; trackCommissionEvent('commission_form_start'); }
    if (event.target.getAttribute('aria-invalid') === 'true') validateField(event.target);
});
form.addEventListener('submit', submitRequest);
document.querySelector('#another-request').addEventListener('click', () => {
    form.reset(); form.hidden = false; successPanel.hidden = true; started = false; updateContact(); setDeadline(); form.querySelector('input').focus();
});
document.querySelectorAll('[data-commission-cta]').forEach(link => link.addEventListener('click', () => trackCommissionEvent('commission_cta_click')));
document.querySelectorAll('[data-terms-link]').forEach(link => link.addEventListener('click', () => trackCommissionEvent('commission_terms_click')));

populateConfig(); setAvailability(); updateContact(); setDeadline(); trackCommissionEvent('commission_page_view');

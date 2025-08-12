/* Register and login a Capital One host, then attempt semester registrations */
import fs from 'fs';

function getApiBase() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) throw new Error('Missing .env');
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(l => l.startsWith('VITE_API_URL='));
  if (!line) throw new Error('VITE_API_URL not found');
  return line.split('=')[1].trim().replace(/\/$/, '');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(t);
    return res;
  } catch (e) {
    clearTimeout(t);
    throw e;
  }
}

async function requestJson(base, method, path, body, token, timeoutMs = 20000) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetchWithTimeout(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined }, timeoutMs);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, json };
}

async function main() {
  const base = getApiBase();
  const ts = Date.now();
  const email = `ceo.${ts}@capitalone.com`;
  const password = 'CapitalOne123!';

  console.log('API', base);
  console.log('Registering host', email);

  const hostProfile = {
    email,
    password,
    firstName: 'Richard',
    lastName: 'Fairbank',
    role: 'host',
    jobTitle: 'Chairman and CEO',
    organization: 'Capital One',
    workLocation: 'McLean, VA',
    workPhone: '555-555-0100',
    careerFields: ['Business', 'Computing/Computer Science and Technology'],
  };

  try {
    const reg = await requestJson(base, 'POST', '/auth/register', hostProfile);
    console.log('POST /auth/register', reg.status);
    if (reg.status >= 400) console.log('Body', reg.json);
  } catch (e) {
    console.log('Register ERROR', e.message);
  }

  let token;
  try {
    const login = await requestJson(base, 'POST', '/auth/login', { email, password }, undefined, 20000);
    console.log('POST /auth/login', login.status);
    token = (login.json && login.json.data && login.json.data.token) || login.json.token;
    if (!token) console.log('Login body', login.json);
  } catch (e) {
    console.log('Login ERROR', e.message);
  }

  const basePayload = {
    semester: 'Fall 2025',
    maxStudents: 1,
    availableDays: ['Monday'],
    additionalInfo: '',
  };

  try {
    const r1 = await requestJson(base, 'POST', '/users/semester-registration', { ...basePayload, experienceType: 'in-person' }, token);
    console.log('POST semester (in-person)', r1.status);
    if (r1.status >= 400) console.log('Body', r1.json);
  } catch (e) {
    console.log('Semester in-person ERROR', e.message);
  }

  try {
    const r2 = await requestJson(base, 'POST', '/users/semester-registration', { ...basePayload, experienceType: 'virtual' }, token);
    console.log('POST semester (virtual)', r2.status);
    if (r2.status >= 400) console.log('Body', r2.json);
  } catch (e) {
    console.log('Semester virtual ERROR', e.message);
  }
}

main().catch(e => { console.error('Fatal', e.message); process.exit(1); });



/* Login with provided credentials and submit two semester registrations (in-person and virtual) */
import fs from 'fs';

function getApiBase() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) throw new Error('Missing .env');
  const line = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).find(l => l.startsWith('VITE_API_URL='));
  if (!line) throw new Error('VITE_API_URL not found');
  return line.split('=')[1].trim().replace(/\/$/, '');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
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

async function requestJson(base, method, path, body, token, timeoutMs) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetchWithTimeout(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }, timeoutMs);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, json };
}

async function main() {
  const base = getApiBase();
  let email = process.env.IFAD_TEST_EMAIL;
  let password = process.env.IFAD_TEST_PASSWORD;
  if (!email || !password) {
    const credsPath = 'tests/host-creds.json';
    if (!fs.existsSync(credsPath)) throw new Error('Missing IFAD_TEST_EMAIL/IFAD_TEST_PASSWORD and tests/host-creds.json');
    const creds = JSON.parse(fs.readFileSync(credsPath, 'utf8'));
    email = creds.email;
    password = creds.password;
  }
  console.log('API', base);
  console.log('EMAIL', email);

  // Health
  try {
    const h = await requestJson(base, 'GET', '/public/health');
    console.log('GET /public/health', h.status);
  } catch (e) {
    console.log('GET /public/health ERROR', e.message);
  }

  // Login
  let token;
  try {
    const login = await requestJson(base, 'POST', '/auth/login', { email, password }, undefined, 15000);
    console.log('POST /auth/login', login.status);
    token = (login.json && login.json.data && login.json.data.token) || login.json.token;
    if (!token) console.log('Login response (no token field)', login.json);
  } catch (e) {
    console.log('POST /auth/login ERROR', e.message);
  }
  if (!token) return;

  // Semester registrations: in-person and virtual
  const basePayload = {
    semester: 'Fall 2025',
    maxStudents: 1,
    availableDays: ['Monday'],
    additionalInfo: '',
  };

  try {
    const r1 = await requestJson(base, 'POST', '/users/semester-registration', { ...basePayload, experienceType: 'in-person' }, token, 15000);
    console.log('POST semester (in-person)', r1.status);
    if (r1.status >= 400) console.log('Body', r1.json);
  } catch (e) {
    console.log('Semester in-person ERROR', e.message);
  }

  try {
    const r2 = await requestJson(base, 'POST', '/users/semester-registration', { ...basePayload, experienceType: 'virtual' }, token, 15000);
    console.log('POST semester (virtual)', r2.status);
    if (r2.status >= 400) console.log('Body', r2.json);
  } catch (e) {
    console.log('Semester virtual ERROR', e.message);
  }
}

main().catch(e => { console.error('Fatal', e.message); process.exit(1); });



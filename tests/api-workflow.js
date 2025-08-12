/* Minimal API workflow smoke test. Requires VITE_API_URL in project .env */
import fs from 'fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getApiBase() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) throw new Error('Missing .env file');
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  const line = lines.find((l) => l.startsWith('VITE_API_URL='));
  if (!line) throw new Error('VITE_API_URL not found in .env');
  return line.split('=')[1].trim().replace(/\/$/, '');
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

async function requestJson(base, method, path, body, token, timeoutMs = 10000) {
  const url = base + path;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetchWithTimeout(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }, timeoutMs);
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { status: res.status, json };
}

async function main() {
  const base = getApiBase();
  console.log('API', base);

  try {
    const h = await requestJson(base, 'GET', '/public/health');
    console.log('GET /public/health', h.status);
  } catch (e) {
    console.log('GET /public/health ERROR', e.message);
  }

  try {
    const p = await requestJson(base, 'GET', '/public/hosts');
    console.log('GET /public/hosts', p.status);
  } catch (e) {
    console.log('GET /public/hosts ERROR', e.message);
  }

  const ts = Date.now();
  const email = `autotest+${ts}@example.com`;
  const password = 'DemoPass123!';
  const hostProfile = {
    email,
    password,
    firstName: 'Auto',
    lastName: 'Test',
    role: 'host',
    jobTitle: 'Engineer',
    organization: 'TestOrg',
    workLocation: 'virtual',
    workPhone: '555-555-0100',
    careerFields: ['Engineering'],
  };

  let token;
  try {
    const reg = await requestJson(base, 'POST', '/auth/register', hostProfile, undefined, 15000);
    console.log('POST /auth/register', reg.status);
    if (reg.status !== 201 && reg.status !== 200 && reg.status !== 409) {
      console.log('Register response', reg.json);
    }
    // Small wait before login
    await sleep(1500);
  } catch (e) {
    console.log('POST /auth/register ERROR', e.message);
  }

  try {
    const login = await requestJson(base, 'POST', '/auth/login', { email, password }, undefined, 15000);
    console.log('POST /auth/login', login.status);
    if (login.status >= 200 && login.status < 300) {
      token = (login.json && login.json.data && login.json.data.token) || login.json.token;
    }
  } catch (e) {
    console.log('POST /auth/login ERROR', e.message);
  }

  if (!token) {
    console.log('No token; skipping semester registration tests');
    return;
  }

  const semBase = {
    semester: 'Fall 2025',
    maxStudents: 1,
    availableDays: ['Monday'],
    additionalInfo: '',
  };

  try {
    const inperson = await requestJson(base, 'POST', '/users/semester-registration', { ...semBase, experienceType: 'in-person' }, token);
    console.log('POST /users/semester-registration (in-person)', inperson.status);
  } catch (e) {
    console.log('Semester (in-person) ERROR', e.message);
  }

  try {
    const virtual = await requestJson(base, 'POST', '/users/semester-registration', { ...semBase, experienceType: 'virtual' }, token);
    console.log('POST /users/semester-registration (virtual)', virtual.status);
  } catch (e) {
    console.log('Semester (virtual) ERROR', e.message);
  }
}

main().catch((e) => {
  console.error('Fatal error', e);
  process.exit(1);
});



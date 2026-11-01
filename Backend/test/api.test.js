const assert = require('node:assert/strict');
const { once } = require('node:events');
const { after, before, test } = require('node:test');
const { createSlug, parseId } = require('../utils/api');
const { requireRole } = require('../middleware/protect');
const { app } = require('../server');

let server;
let baseUrl;

before(async () => {
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    if (server) {
        await new Promise((resolve, reject) => {
            server.close((error) => error ? reject(error) : resolve());
        });
    }
});

test('createSlug normalizes accents and punctuation', () => {
    assert.equal(createSlug('  Layanan Kesehatan: Ibu & Anak  '), 'layanan-kesehatan-ibu-anak');
    assert.equal(createSlug(''), '');
});

test('parseId accepts only safe positive integer identifiers', () => {
    assert.equal(parseId('17'), 17);
    assert.equal(parseId('0'), null);
    assert.equal(parseId('-1'), null);
    assert.equal(parseId('1.5'), null);
    assert.equal(parseId('9007199254740992'), null);
});

test('role middleware allows content admins and restricts account management to superadmins', () => {
    let nextCalled = false;
    const response = {
        statusCode: null,
        status(code) {
            this.statusCode = code;
            return this;
        },
        json(body) {
            this.body = body;
            return this;
        }
    };

    requireRole('admin', 'superadmin')(
        { user: { role: 'admin' } },
        response,
        () => { nextCalled = true; }
    );
    assert.equal(nextCalled, true);

    nextCalled = false;
    requireRole('superadmin')({ user: { role: 'admin' } }, response, () => {
        nextCalled = true;
    });
    assert.equal(nextCalled, false);
    assert.equal(response.statusCode, 403);
    assert.deepEqual(response.body, { message: 'Forbidden' });

    requireRole('superadmin')({ user: { role: 'superadmin' } }, response, () => {
        nextCalled = true;
    });
    assert.equal(nextCalled, true);
});

test('health endpoint and API not-found response are available', async () => {
    const health = await fetch(`${baseUrl}/api/health`);
    assert.equal(health.status, 200);
    assert.deepEqual(await health.json(), { status: 'ok' });

    const missing = await fetch(`${baseUrl}/api/unknown`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { message: 'Endpoint not found' });
});

test('admin writes require a bearer token', async () => {
    const response = await fetch(`${baseUrl}/api/faq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pertanyaan: 'Question', jawaban: 'Answer' })
    });
    assert.equal(response.status, 401);

    const accountManagement = await fetch(`${baseUrl}/api/admins`);
    assert.equal(accountManagement.status, 401);
});

test('login rejects an empty request before querying the database', async () => {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    });
    assert.equal(response.status, 400);
});

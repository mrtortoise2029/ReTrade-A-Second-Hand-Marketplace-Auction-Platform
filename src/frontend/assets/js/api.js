(function () {
  'use strict';
  const marker = '/src/frontend/';
  const path = window.location.pathname;
  const root = path.includes(marker) ? path.slice(0, path.indexOf(marker)) : '';
  const base = root + '/src/backend/api/';

  async function request(resource, options) {
    const opts = Object.assign({ credentials: 'same-origin', headers: {} }, options || {});
    if (opts.body && !(opts.body instanceof FormData) && typeof opts.body !== 'string') {
      opts.headers['Content-Type'] = 'application/json';
      opts.body = JSON.stringify(opts.body);
    }
    const response = await fetch(base + resource, opts);
    let payload;
    try { payload = await response.json(); } catch (_) { payload = { ok: false, message: 'Invalid server response.' }; }
    if (!response.ok || !payload.ok) {
      const error = new Error(payload.message || 'Request failed.');
      error.status = response.status;
      error.errors = payload.errors || {};
      throw error;
    }
    return payload.data;
  }

  window.ReTradeAPI = {
    base,
    get(resource) { return request(resource); },
    post(resource, body) { return request(resource, { method: 'POST', body }); },
    patch(resource, body) { return request(resource, { method: 'PATCH', body }); },
    delete(resource, body) { return request(resource, { method: 'DELETE', body }); },
    request
  };
}());

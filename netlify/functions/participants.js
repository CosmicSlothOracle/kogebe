const { netlifyIdentityAuthRequired, jsonResponse } = require("./common");
const { getStore } = require("@netlify/blobs");
const { v4: uuidv4 } = require("uuid");

/**
 * Create a Netlify Blob store with the correct configuration.
 *
 * In production on Netlify, `@netlify/blobs` automatically injects the
 * required `siteID` and `token` so you can simply call `getStore()`
 * with a store name. However, when running functions locally (for
 * example via `netlify dev`), those environment variables are not
 * injected and `getStore()` will throw a MissingBlobsEnvironmentError.
 * To support local development you can set `NETLIFY_BLOBS_SITE_ID` and
 * `NETLIFY_BLOBS_TOKEN` in your environment and this helper will pass
 * them to `getStore()`.
 *
 * @param {string} name The name of the blob store (e.g. `participants`)
 */
function createStore(name) {
  const opts = { consistency: "strong" };
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    opts.siteID = siteID;
    opts.token = token;
  }
  return getStore(name, opts);
}

async function addParticipant(event) {
  const store = createStore("participants");
  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }
  const { name, email, message, banner } = data;
  if (!name) return jsonResponse({ error: "Name is required" }, 400);
  const id = uuidv4();
  const participant = { id, name, email, message, banner, timestamp: new Date().toISOString() };
  await store.setJSON(id, participant);
  return jsonResponse({ success: true, participant }, 201);
}

async function listParticipants() {
  const store = createStore("participants");
  const all = [];
  for await (const page of store.list({ paginate: true })) {
    for (const blob of page.blobs) {
      const data = await store.get(blob.key, { type: "json", consistency: "strong" });
      if (data) all.push(data);
    }
  }
  // Sort newest first
  all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  return jsonResponse({ participants: all });
}

exports.handler = async (event, context) => {
  if (event.httpMethod === "POST") {
    return addParticipant(event);
  }
  if (event.httpMethod === "GET") {
    // protect GET with auth
    return netlifyIdentityAuthRequired(() => listParticipants())(event, context);
  }
  return { statusCode: 405, body: "Method Not Allowed" };
};
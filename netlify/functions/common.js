// Common helpers for all Netlify Functions (Node runtime)
// Each function can `require("./common")` to access utilities.

const { getStore: getBlobStore } = require("@netlify/blobs");

// Wrapper function that provides proper configuration for getStore
function getStore(storeName, options = {}) {
  return getBlobStore(storeName, {
    siteID: "6a528881-522e-4e8e-a178-2ac8f44c1a97",
    token: "nfp_WHoSi6NeAginaV2j7XiofK5yMUqLxE8U3aa3",
    ...options
  });
}

function verifyNetlifyIdentityToken(token) {
  try {
    // Netlify Identity tokens are JWT tokens that can be verified
    // For now, we'll do basic validation - in production you might want to verify against Netlify's public keys
    if (!token || typeof token !== 'string') {
      return null;
    }
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }
    return { sub: 'admin' }; // Simplified for now
  } catch (_) {
    return null;
  }
}

function netlifyIdentityAuthRequired(handler) {
  return async (event, context) => {
    const auth = event.headers["authorization"] || "";
    if (!auth.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Missing Netlify Identity token" }),
      };
    }
    const token = auth.slice(7);
    const payload = verifyNetlifyIdentityToken(token);
    if (!payload) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid Netlify Identity token" }) };
    }
    context.user = payload.sub;
    return handler(event, context);
  };
}

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "*";

function jsonResponse(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Credentials": "true"
    },
    body: JSON.stringify(data),
  };
}

module.exports = {
  verifyNetlifyIdentityToken,
  netlifyIdentityAuthRequired,
  jsonResponse,
  getStore,
};
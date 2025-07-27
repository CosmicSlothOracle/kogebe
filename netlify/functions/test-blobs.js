const { getStore } = require('@netlify/blobs');

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
 * @param {string} name The name of the blob store (e.g. `test`)
 */
function createStore(name) {
  const opts = { consistency: 'strong' };
  const siteID = process.env.NETLIFY_BLOBS_SITE_ID;
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  if (siteID && token) {
    opts.siteID = siteID;
    opts.token = token;
  }
  return getStore(name, opts);
}

exports.handler = async (event, context) => {
  try {
    const store = createStore('test');
    
    // Test writing a simple blob
    const testData = { message: 'Hello from Netlify Blobs!', timestamp: new Date().toISOString() };
    await store.setJSON('test-key', testData);
    
    // Test reading the blob back
    const retrievedData = await store.get('test-key', { type: 'json' });
    
    // Clean up
    await store.delete('test-key');
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        message: 'Netlify Blobs is working correctly!',
        environment: {
          hasSiteID: !!process.env.NETLIFY_BLOBS_SITE_ID,
          hasToken: !!process.env.NETLIFY_BLOBS_TOKEN,
          siteID: process.env.NETLIFY_BLOBS_SITE_ID ? '***' : 'NOT_SET',
        },
        testData: retrievedData,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: false,
        error: error.message,
        errorType: error.name,
        environment: {
          hasSiteID: !!process.env.NETLIFY_BLOBS_SITE_ID,
          hasToken: !!process.env.NETLIFY_BLOBS_TOKEN,
        },
      }),
    };
  }
};
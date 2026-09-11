import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
// Assuming your constants file is correctly located relative to this script
// Adjust the import path as necessary if this script is moved or the constants file is elsewhere.
// For this example, I'm assuming a relative path. If your project setup allows for aliases like '@/',
// that would be preferable, but direct relative paths are more common in standalone scripts.
// This path assumes 'Postman' directory is at the root, and 'src' is also at the root.
import { API_AUTH_PATHS } from '../src/lib/constants/routes.js';
import { APP_NAME } from '../src/lib/constants/site.js'; // Import APP_NAME

// ---------- Configuration ----------
const BASE_URL_PLACEHOLDER = '{{baseUrl}}';
// Sanitize APP_NAME for filenames (e.g., remove spaces)
const APP_NAME_SANITIZED = APP_NAME.replace(/\s+/g, '');

const COLLECTION_NAME = `${APP_NAME} API`; // Use APP_NAME
const ENVIRONMENT_NAME = `${APP_NAME} Environment`; // Use APP_NAME

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const OUTPUT_DIR = dirname(__filename);

const OUTPUT_COLLECTION_FILENAME = path.join(
  OUTPUT_DIR,
  `${APP_NAME_SANITIZED}-API.postman_collection.json` // Use sanitized name
);
const OUTPUT_ENVIRONMENT_FILENAME = path.join(
  OUTPUT_DIR,
  `${APP_NAME_SANITIZED}-API.postman_environment.json` // Use sanitized name
);

// API structure for Auth
const apiRoutes = [
  {
    name: 'BetterAuth Core',
    description: 'Standard BetterAuth.js endpoints',
    endpoints: [
      {
        name: 'Get CSRF Token',
        method: 'GET',
        path: '/api/auth/csrf',
        description:
          'Retrieves a CSRF token needed for POST requests (e.g., login, logout, registration).\nCopy the value for `csrfToken` from the response and paste it into the Postman environment variable `csrfToken`.',
      },
      {
        name: 'Sign In (Credentials)',
        method: 'POST',
        path: '/api/auth/signin/credentials',
        description:
          'Logs in a user with email and password. Requires a valid `csrfToken`. Automatically sets cookies upon successful login.',
        body: {
          email: '{{testUserEmail}}',
          password: '{{testUserPassword}}',
          csrfToken: '{{csrfToken}}',
          redirect: false, // Prevent redirect, return JSON instead
          json: true, // Request JSON response
        },
      },
      {
        name: 'Get Session',
        method: 'GET',
        path: '/api/auth/session',
        description:
          'Retrieves information about the current user session (if logged in via cookie).',
      },
      {
        name: 'Sign Out',
        method: 'POST',
        path: '/api/auth/signout',
        description:
          'Logs out the current user. Requires a valid `csrfToken`. Removes session cookies.',
        body: {
          csrfToken: '{{csrfToken}}',
        },
      },
      {
        name: 'Initiate Google Sign In (Browser Only)',
        method: 'GET',
        path: '/api/auth/signin/google',
        description:
          'This URL is normally used in a browser to initiate the Google OAuth flow. It will redirect to Google. Cannot be fully tested in Postman without manual steps.',
      },
    ],
  },
  {
    name: 'Custom Auth',
    description: 'Custom authentication endpoints',
    endpoints: [
      {
        name: 'Register User',
        method: 'POST',
        path: API_AUTH_PATHS.REGISTER,
        description:
          'Registers a new user via your custom `/api/auth/register` endpoint. Likely requires `csrfToken`.',
        body: {
          // Adjust fields according to your registration logic
          name: 'Test User',
          email: 'new-test-user@example.com',
          password: 'password1234',
          csrfToken: '{{csrfToken}}', // Assumption: CSRF required
        },
      },
      {
        name: 'Verify User',
        method: 'POST', // Or GET? Adjust according to your implementation
        path: API_AUTH_PATHS.VERIFY_EMAIL,
        description:
          'Verifies a user via your custom `/api/auth/verify` endpoint. Adjust body and method as needed. Likely requires `csrfToken`.',
        body: {
          token: 'VERIFICATION_TOKEN_FROM_EMAIL_OR_LINK', // Adjust this field
          csrfToken: '{{csrfToken}}', // Assumption: CSRF required
        },
      },
    ],
  },
];

// Create Postman collection
const collection = {
  info: {
    name: COLLECTION_NAME,
    description: `Postman collection for ${APP_NAME} API`, // Use APP_NAME
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  item: [],
};

// Create environment variables
const environment = {
  name: ENVIRONMENT_NAME,
  values: [
    {
      key: 'baseUrl',
      value: 'http://localhost:3000', // Default for development
      type: 'default',
      enabled: true,
    },
    {
      key: 'csrfToken',
      value: '', // Filled in manually after calling /api/auth/csrf
      type: 'secret', // Mark as secret for security
      enabled: true,
    },
    {
      key: 'testUserEmail',
      value: 'test@example.com', // Change to a valid test user
      type: 'default',
      enabled: true,
    },
    {
      key: 'testUserPassword',
      value: 'password123', // Change to the test user's password
      type: 'secret',
      enabled: true,
    },
  ],
};

// Function to create a request structure (simplified)
function createRequestItem(endpoint) {
  const urlPath = endpoint.path;
  const rawUrl = `${BASE_URL_PLACEHOLDER}${urlPath}`;
  const pathSegments = urlPath.replace(/^\/|\/$/g, '').split('/');

  const item = {
    name: endpoint.name,
    request: {
      method: endpoint.method,
      header: [],
      description: endpoint.description || '',
      url: {
        raw: rawUrl,
        host: [BASE_URL_PLACEHOLDER],
        path: pathSegments,
      },
    },
    response: [], // Empty array for responses
  };

  // Add request body if it exists
  if (endpoint.body) {
    item.request.header.push({
      key: 'Content-Type',
      value: 'application/json',
    });
    item.request.body = {
      mode: 'raw',
      raw: JSON.stringify(endpoint.body, null, 2), // Format JSON
      options: {
        raw: {
          language: 'json',
        },
      },
    };
  }

  // Add event for CSRF token retrieval
  if (endpoint.path === '/api/auth/csrf') {
    item.event = [
      {
        listen: 'test',
        script: {
          exec: [
            'try {',
            '    const jsonData = pm.response.json();',
            '    if (jsonData.csrfToken) {',
            '        pm.environment.set("csrfToken", jsonData.csrfToken);',
            '        console.log("CSRF Token set in environment:", jsonData.csrfToken);',
            '    } else {',
            '        console.warn("CSRF token not found in response JSON.");',
            '    }',
            '} catch (e) {',
            '    console.error("Failed to parse JSON or set CSRF token:", e);',
            '}',
            '',
          ],
          type: 'text/javascript',
        },
      },
    ];
  }

  return item;
}

// Authentication instructions
const authInstructions = {
  name: 'Authentication Instructions (Cookie Method)',
  request: {
    method: 'GET', // No actual request, just information
    url: { raw: '' }, // Empty URL
    description: `# BetterAuth.js Authentication in Postman

BetterAuth.js uses **cookie-based authentication**. To test endpoints that require login in Postman:

1.  **Get CSRF Token:** Run \`GET /api/auth/csrf\` first. This automatically sets \`csrfToken\` in your environment (via the Test script).
2.  **Sign In:** Run \`POST /api/auth/signin/credentials\` with your test user credentials (from the environment). If successful, BetterAuth.js will return session cookies that Postman **automatically saves and sends** in future requests to the same domain (\`{{baseUrl}}\`).
3.  **Verify Session:** Run \`GET /api/auth/session\` to see if you are logged in and view session data.
4.  **Test protected endpoints:** Now you can call other API endpoints that require login. Postman automatically sends the cookie.
5.  **Sign Out:** Run \`POST /api/auth/signout\` (with a valid \`csrfToken\`) to remove the cookie.

**Important:**
* Make sure your \`{{baseUrl}}\` in the Postman environment matches the URL your Next.js app is running on.
* Postman handles cookies per domain.
* Google Sign-In cannot be fully completed within Postman due to browser redirects.
`,
  },
};

// Add instructions first
collection.item.push({
  name: 'README - Authentication',
  item: [authInstructions],
  description:
    'Important information about how authentication works in Postman with this API.',
});

// Add all API groups and endpoints
apiRoutes.forEach((group) => {
  const folderItem = {
    name: group.name,
    description: group.description,
    item: [],
  };

  group.endpoints.forEach((endpoint) => {
    folderItem.item.push(createRequestItem(endpoint));
  });

  collection.item.push(folderItem);
});

// Save collection and environment as JSON files
try {
  fs.writeFileSync(
    OUTPUT_COLLECTION_FILENAME,
    JSON.stringify(collection, null, 2) // Indent for readability
  );
  console.log(
    `✅ Postman collection saved to ${path.basename(OUTPUT_COLLECTION_FILENAME)}`
  ); // Use dynamic filename

  fs.writeFileSync(
    OUTPUT_ENVIRONMENT_FILENAME,
    JSON.stringify(environment, null, 2) // Indent for readability
  );
  console.log(
    `✅ Postman environment saved to ${path.basename(OUTPUT_ENVIRONMENT_FILENAME)}`
  ); // Use dynamic filename

  console.log('\nNext steps:');
  console.log(
    `1. Import ${path.basename(OUTPUT_COLLECTION_FILENAME)} and ${path.basename(OUTPUT_ENVIRONMENT_FILENAME)} into Postman.`
  );
  console.log('2. Select the imported environment (top right).');
  console.log(
    '3. Follow the instructions in "README - Authentication" to sign in and test.'
  );
} catch (error) {
  console.error('❌ Error writing Postman files:', error);
}

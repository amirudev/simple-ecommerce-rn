
/**
 * Network Debugger
 * Intercepts global fetch requests and logs them to the console.
 * This is useful for debugging API calls without using external tools.
 */

if (__DEV__) {
    const originalFetch = global.fetch;

    // Add a flag to prevent multiple wrappings
    if (!(global as any).isFetchIntercepted) {
        console.log('🔌 Network Debugger Initialized');

        global.fetch = async (...args) => {
            const [resource, config] = args;
            const url = typeof resource === 'string' ? resource : resource instanceof URL ? resource.toString() : (resource as Request).url;
            const method = config?.method || 'GET';

            console.group(`🚀 API Request: ${method} ${url}`);
            console.log('URL:', url);
            console.log('Method:', method);

            if (config) {
                if (config.headers) {
                    console.log('Headers:', config.headers);
                }
                if (config.body) {
                    try {
                        // Try to parse body if it is a string
                        if (typeof config.body === 'string') {
                            console.log('Body:', JSON.parse(config.body));
                        } else {
                            console.log('Body:', config.body);
                        }
                    } catch (e) {
                        console.log('Body:', config.body);
                    }
                }
            }
            console.groupEnd();

            try {
                const response = await originalFetch(...args);

                const clone = response.clone();

                // Process response asynchronously to not block the UI
                clone.json().then(data => {
                    console.group(`✅ API Response: ${response.status} ${url}`);
                    console.log('Status:', response.status);
                    console.log('Data:', data);
                    console.groupEnd();
                }).catch(async () => {
                    try {
                        const text = await clone.text();
                        console.group(`✅ API Response (Text): ${response.status} ${url}`);
                        console.log('Status:', response.status);
                        console.log('Body:', text);
                        console.groupEnd();
                    } catch (e) {
                        console.log(`❌ API Response Error: ${response.status} ${url} - Could not read body`);
                    }
                });

                return response;
            } catch (error) {
                console.group(`❌ API Error: ${method} ${url}`);
                console.log('Error:', error);
                console.groupEnd();
                throw error;
            }
        };

        (global as any).isFetchIntercepted = true;
    }
}

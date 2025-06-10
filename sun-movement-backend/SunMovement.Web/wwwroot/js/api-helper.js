/**
 * API Helper class to standardize fetching data from the backend
 */
class ApiHelper {
    /**
     * Fetch data from an API endpoint
     * @param {string} url - API endpoint URL
     * @param {Object} options - Fetch options
     * @returns {Promise} - Promise containing the response data
     */
    static async fetchData(url, options = {}) {
        // Default options with cache busting
        const timestamp = new Date().getTime();
        const bustUrl = url.includes('?') ? `${url}&_=${timestamp}` : `${url}?_=${timestamp}`;
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
            },
            credentials: 'include',
        };
        
        const mergedOptions = { ...defaultOptions, ...options };
        
        try {
            console.log(`Fetching from: ${bustUrl}`);
            const response = await fetch(bustUrl, mergedOptions);
            
            // Check if the response is successful
            if (!response.ok) {
                // Get more information about the error
                const errorText = await response.text();
                console.error(`API Error (${response.status}): ${errorText}`);
                throw new Error(`API Error (${response.status}): ${response.statusText}`);
            }
            
            // Handle empty responses (204 No Content)
            if (response.status === 204) {
                return null;
            }
            
            // Parse the response as JSON
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API fetch error:', error);
            throw error;
        }
    }
    
    /**
     * Get data from an API endpoint
     * @param {string} url - API endpoint URL
     * @returns {Promise} - Promise containing the response data
     */
    static async get(url) {
        return this.fetchData(url);
    }
    
    /**
     * Post data to an API endpoint
     * @param {string} url - API endpoint URL
     * @param {Object} body - Request body
     * @returns {Promise} - Promise containing the response data
     */
    static async post(url, body) {
        return this.fetchData(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }
    
    /**
     * Put data to an API endpoint
     * @param {string} url - API endpoint URL
     * @param {Object} body - Request body
     * @returns {Promise} - Promise containing the response data
     */
    static async put(url, body) {
        return this.fetchData(url, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }
    
    /**
     * Delete data from an API endpoint
     * @param {string} url - API endpoint URL
     * @returns {Promise} - Promise containing the response data
     */
    static async delete(url) {
        return this.fetchData(url, {
            method: 'DELETE',
        });
    }
    
    /**
     * Set the authorization token for all future requests
     * @param {string} token - JWT token
     */
    static setAuthToken(token) {
        this.authToken = token;
        if (token) {
            this.defaultHeaders = {
                ...this.defaultHeaders,
                'Authorization': `Bearer ${token}`,
            };
        } else {
            delete this.defaultHeaders['Authorization'];
        }
    }
    
    // Default headers
    static defaultHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
    };
}

// Export the ApiHelper class
window.ApiHelper = ApiHelper;

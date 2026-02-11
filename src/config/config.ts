/**
 * API Configuration
 * 
 * IMPORTANT: Update the IP address here when your local network IP changes.
 * To find your current IP, run: node get_ip.js
 * 
 * Current IP: 192.168.29.97
 * Last Updated: 2026-02-10
 */

// Base URL for backend API
// IMPORTANT: Update this IP address if your local network IP changes
export const API_BASE_URL = 'http://192.168.29.97:8080/backend';

/**
 * API Endpoints
 * All API endpoints are defined here for easy maintenance
 */
export const API_ENDPOINTS = {
    // Farmer Registration
    registerFarmer: `${API_BASE_URL}/register_farmer.php`,

    // Retailer Auth
    registerRetailer: `${API_BASE_URL}/register_retailer.php`,
    loginRetailer: `${API_BASE_URL}/login_retailer.php`,

    // Location Data
    getLocations: `${API_BASE_URL}/get_locations.php`,

    // Farmer Approval (Admin)
    approveFarmer: `${API_BASE_URL}/approve_farmer.php`,

    // SuperAdmin Settings Management
    getSettings: `${API_BASE_URL}/get_settings.php`,
    updateSetting: `${API_BASE_URL}/update_setting.php`,
    updateSeasonalSetting: `${API_BASE_URL}/update_seasonal_setting.php`,

    // SuperAdmin User Management
    manageUsers: `${API_BASE_URL}/manage_users.php`,
    getPendingApprovals: `${API_BASE_URL}/get_pending_approvals.php`,

    // SuperAdmin Advisory Management
    manageAdvisory: `${API_BASE_URL}/manage_advisory.php`,

    // Media Upload
    uploadMedia: `${API_BASE_URL}/upload_media.php`,

    // Add more endpoints here as needed
} as const;

// SuperAdmin Credentials (hardcoded for now)
export const SUPERADMIN_CREDENTIALS = {
    username: 'sadmin',
    password: 'weknowtech'
} as const;

/**
 * Helper function to build location API URL with query parameters
 */
export const buildLocationUrl = (type: string, parentId?: string): string => {
    let url = `${API_ENDPOINTS.getLocations}?type=${type}`;
    if (parentId) {
        url += `&parent_id=${parentId}`;
    }
    return url;
};

// Export for backwards compatibility
export { API_BASE_URL as API_URL };

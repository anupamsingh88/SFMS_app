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
    // Farmer endpoints
    registerFarmer: `${API_BASE_URL}/register_farmer.php`,
    loginFarmer: `${API_BASE_URL}/login_farmer.php`,
    getDistricts: `${API_BASE_URL}/get_districts.php`,
    getLocations: `${API_BASE_URL}/get_locations.php`,

    // Retailer endpoints
    registerRetailer: `${API_BASE_URL}/register_retailer.php`,
    loginRetailer: `${API_BASE_URL}/login_retailer.php`,

    // Super Admin endpoints
    getUsersPendingApproval: `${API_BASE_URL}/get_pending_approvals.php`, // Renamed from getPendingApprovals
    updateApprovalStatus: `${API_BASE_URL}/update_approval_status.php`,
    getSeasonalSetting: `${API_BASE_URL}/get_seasonal_setting.php`,
    updateSeasonalSetting: `${API_BASE_URL}/update_seasonal_setting.php`,
    manageUsers: `${API_BASE_URL}/manage_users.php`, // Moved from SuperAdmin User Management section
    getFertilizerPrices: `${API_BASE_URL}/get_fertilizer_prices.php`, // New endpoint

    // Advisory Tips endpoints
    getAdvisoryTips: `${API_BASE_URL}/get_advisory_tips.php`,
    manageAdvisoryTips: `${API_BASE_URL}/manage_advisory_tips.php`,

    // App Content Management endpoints
    getAppContent: `${API_BASE_URL}/get_app_content.php`,
    manageAppContent: `${API_BASE_URL}/manage_app_content.php`,

    // Settings endpoints
    getSettings: `${API_BASE_URL}/get_settings.php`,
    updateSetting: `${API_BASE_URL}/update_setting.php`,

    // Media Upload
    uploadMedia: `${API_BASE_URL}/upload_media.php`,

    // Add more endpoints here as needed
} as const;

// SuperAdmin Credentials (hardcoded for now)
export const SUPERADMIN_CREDENTIALS = {
    username: 'sadmin',
    password: 'weknowtech'
} as const;

// Export for backwards compatibility
export { API_BASE_URL as API_URL };

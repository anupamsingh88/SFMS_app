<?php
// Test if get_settings.php is working
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

try {
    require_once 'db_connect.php';

    // Check if connection exists
    if (!isset($conn)) {
        throw new Exception("Database connection failed");
    }

    // Check if app_settings table exists
    $checkTable = $conn->query("SHOW TABLES LIKE 'app_settings'");
    if ($checkTable->num_rows === 0) {
        throw new Exception("Table 'app_settings' does not exist. Please run setup_superadmin_complete.sql first!");
    }

    // Try to fetch settings
    $query = "SELECT setting_key, setting_value FROM app_settings";
    $result = $conn->query($query);

    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    $settings = [];
    while ($row = $result->fetch_assoc()) {
        $settings[$row['setting_key']] = $row['setting_value'];
    }

    echo json_encode([
        'success' => true,
        'message' => 'Settings fetched successfully',
        'data' => $settings
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
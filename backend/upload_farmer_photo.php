<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connect.php';

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get farmer_id from POST data
$farmer_id = $_POST['farmer_id'] ?? null;

if (!$farmer_id) {
    echo json_encode(['success' => false, 'message' => 'Farmer ID is required']);
    exit;
}

// Check if file was uploaded
if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'No photo uploaded or upload error']);
    exit;
}

$file = $_FILES['photo'];

// Validate file type
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png'];
$file_type = mime_content_type($file['tmp_name']);

if (!in_array($file_type, $allowed_types)) {
    echo json_encode(['success' => false, 'message' => 'Invalid file type. Only JPEG and PNG allowed']);
    exit;
}

// Validate file size (max 2MB)
$max_size = 2 * 1024 * 1024; // 2MB in bytes
if ($file['size'] > $max_size) {
    echo json_encode(['success' => false, 'message' => 'File too large. Maximum 2MB allowed']);
    exit;
}

try {
    // Create upload directory if it doesn't exist
    $upload_dir = __DIR__ . '/uploads/farmer_photos/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = 'farmer_' . $farmer_id . '_' . time() . '.' . $extension;
    $filepath = $upload_dir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode(['success' => false, 'message' => 'Failed to save photo']);
        exit;
    }

    // Update database with photo path
    $photo_url = 'uploads/farmer_photos/' . $filename;
    $stmt = $pdo->prepare("UPDATE farmer_info SET profile_photo = ? WHERE farmer_id = ?");
    $stmt->execute([$photo_url, $farmer_id]);

    if ($stmt->rowCount() === 0) {
        // Rollback - delete uploaded file if DB update failed
        unlink($filepath);
        echo json_encode(['success' => false, 'message' => 'Farmer not found']);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Photo uploaded successfully',
        'photo_url' => $photo_url
    ]);

} catch (PDOException $e) {
    // If DB error, try to delete uploaded file
    if (isset($filepath) && file_exists($filepath)) {
        unlink($filepath);
    }
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
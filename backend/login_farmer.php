<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connect.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['mobile'])) {
    echo json_encode(['success' => false, 'message' => 'Mobile number is required']);
    exit;
}

try {
    // Fetch farmer details including profile photo
    $stmt = $pdo->prepare("SELECT farmer_id, name, mobile, aadhaar, village_id, district_id, 
                                   tehsil_id, block_id, khasra_number, khasra_rukba, land_acres, 
                                   wa_notification, status, profile_photo
                           FROM farmer_info 
                           WHERE mobile = ? AND status = 1");
    $stmt->execute([$input['mobile']]);
    $farmer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$farmer) {
        echo json_encode(['success' => false, 'message' => 'Farmer not found or not approved']);
        exit;
    }

    // Return farmer profile with photo URL
    echo json_encode([
        'success' => true,
        'farmer' => $farmer
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
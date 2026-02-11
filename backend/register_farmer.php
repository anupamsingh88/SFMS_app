<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require 'db_connect.php';

// Get JSON input
$rawInput = file_get_contents('php://input');
// Enhanced Debug Logging
$logData = "--------------------------------------------------\n";
$logData .= "Time: " . date('Y-m-d H:i:s') . "\n";
$logData .= "Method: " . $_SERVER['REQUEST_METHOD'] . "\n";
$logData .= "URI: " . $_SERVER['REQUEST_URI'] . "\n";
$logData .= "Headers: " . print_r(getallheaders(), true) . "\n";
$logData .= "Raw Input Length: " . strlen($rawInput) . "\n";
$logData .= "Raw Input: " . $rawInput . "\n";
file_put_contents('debug_log.txt', $logData, FILE_APPEND);


$input = json_decode($rawInput, true);

if (!$input) {
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit;
}

// Basic validation
$requiredFields = ['name', 'mobile', 'aadhaar', 'village_id', 'district_id', 'tehsil_id', 'block_id', 'khasra_number', 'khasra_rukba'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        echo json_encode(['success' => false, 'message' => "Field '$field' is required"]);
        exit;
    }
}

try {
    // Generate a unique farmer_id if not provided (or use one from input if app generates it)
    $farmerId = $input['id'] ?? uniqid('FARMER_');

    $stmt = $pdo->prepare("INSERT INTO farmer_info (
        farmer_id, name, mobile, aadhaar, village_id, district_id, tehsil_id, block_id, 
        khasra_number, khasra_rukba, land_acres, wa_notification, status
    ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
    )");

    $stmt->execute([
        $farmerId,
        $input['name'],
        $input['mobile'],
        $input['aadhaar'],
        $input['village_id'],
        $input['district_id'],
        $input['tehsil_id'],
        $input['block_id'],
        $input['khasra_number'],
        $input['khasra_rukba'],
        $input['khasra_rukba'], // Assuming land_acres = khasra_rukba based on frontend logic
        $input['wa_notification'] ? 1 : 0
    ]);

    echo json_encode(['success' => true, 'message' => 'Registration successful. Pending approval.']);

} catch (PDOException $e) {
    // specific error handling for duplicate entry
    if ($e->getCode() == 23000) {
         echo json_encode(['success' => false, 'message' => 'Farmer with this ID or Mobile already exists']);
    } else {
         echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>

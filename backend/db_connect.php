<?php
/**
 * Database Connection File
 * Uses MySQLi for database operations
 */

// Database configuration
$host = 'localhost';
$db = 'sfms_app';
$user = 'root';
$pass = 'mysql';
$charset = 'utf8mb4';

// Create connection using MySQLi
$conn = new mysqli($host, $user, $pass, $db);

// Check MySQLi connection
if ($conn->connect_error) {
    error_log("MySQLi Connection failed: " . $conn->connect_error);
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database connection failed.']);
        exit;
    }
    die("Connection failed: " . $conn->connect_error);
}

// Create connection using PDO
try {
    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    error_log("PDO Connection failed: " . $e->getMessage());
    if (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => 'Database connection failed (PDO).']);
        exit;
    }
    die("PDO Connection failed: " . $e->getMessage());
}

// Set charset for MySQLi
$conn->set_charset($charset);
?>
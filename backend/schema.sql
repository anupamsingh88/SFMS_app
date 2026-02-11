CREATE TABLE IF NOT EXISTS farmer_info (
    id INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    aadhaar VARCHAR(20) NOT NULL,
    village VARCHAR(100),
    district VARCHAR(100),
    tehsil VARCHAR(100),
    block VARCHAR(100),
    khasra_number VARCHAR(100),
    khasra_rukba DECIMAL(10, 2),
    land_acres DECIMAL(10, 2),
    wa_notification BOOLEAN DEFAULT FALSE,
    already_taken_bags INT DEFAULT 0,
    status TINYINT DEFAULT 0 COMMENT '0: Pending/Inactive, 1: Active/Approved',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

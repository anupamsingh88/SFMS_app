-- Complete SuperAdmin Database Setup
-- Run this entire script in phpMyAdmin SQL tab
-- Database: fertilizer_distribution (or your database name)

-- 1. Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('text', 'number', 'image', 'json', 'boolean') DEFAULT 'text',
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default settings
INSERT INTO app_settings (setting_key, setting_value, setting_type, description) VALUES
('app_name', 'उर्वरक वितरण प्रणाली', 'text', 'Application name in Hindi'),
('app_heading', 'स्वागत है', 'text', 'Main heading on landing page'),
('app_tagline', 'किसानों की सेवा में', 'text', 'Application tagline'),
('logo_url', '/uploads/logos/default_logo.png', 'image', 'Application logo'),
('icon_url', '/uploads/icons/default_icon.png', 'image', 'Application icon'),
('urea_price', '300', 'number', 'Price per bag of Urea in Rupees'),
('dap_price', '1350', 'number', 'Price per bag of DAP in Rupees'),
('npk_price', '1200', 'number', 'Price per bag of NPK in Rupees'),
('mop_price', '1100', 'number', 'Price per bag of MOP in Rupees'),
('current_season', 'Rabi', 'text', 'Current active season'),
('enable_registrations', '1', 'boolean', 'Enable/disable new registrations')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- 2. Create seasonal_settings table (Rabi and Kharif only)
CREATE TABLE IF NOT EXISTS seasonal_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    season_name ENUM('Rabi', 'Kharif') NOT NULL,
    fertilizer_type ENUM('Urea', 'DAP', 'NPK', 'MOP') NOT NULL,
    allotment_per_hectare DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_season_fertilizer (season_name, fertilizer_type),
    INDEX idx_season (season_name),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default seasonal allotments (in kg per hectare)
INSERT INTO seasonal_settings (season_name, fertilizer_type, allotment_per_hectare, is_active) VALUES
-- Rabi Season (Winter crops: Wheat, Barley, etc.)
('Rabi', 'Urea', 130.00, 1),
('Rabi', 'DAP', 100.00, 1),
('Rabi', 'NPK', 80.00, 1),
('Rabi', 'MOP', 50.00, 1),

-- Kharif Season (Monsoon crops: Rice, Maize, etc.)
('Kharif', 'Urea', 150.00, 1),
('Kharif', 'DAP', 120.00, 1),
('Kharif', 'NPK', 100.00, 1),
('Kharif', 'MOP', 60.00, 1)
ON DUPLICATE KEY UPDATE 
    allotment_per_hectare=VALUES(allotment_per_hectare),
    is_active=VALUES(is_active);

-- 3. Create advisory_tips table
CREATE TABLE IF NOT EXISTS advisory_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tip_type ENUM('general', 'seasonal', 'fertilizer', 'crop') DEFAULT 'general',
    season ENUM('Rabi', 'Kharif', 'All') DEFAULT 'All',
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_season (season),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default advisory tips in Hindi
INSERT INTO advisory_tips (title, description, tip_type, season, display_order, is_active) VALUES
('मिट्टी परीक्षण', 'खेती से पहले मिट्टी की जांच अवश्य करवाएं। इससे सही मात्रा में उर्वरक का उपयोग हो सकेगा।', 'general', 'All', 1, 1),
('यूरिया का सही उपयोग', 'यूरिया को 2-3 बार में विभाजित करके डालें। एक बार में पूरी मात्रा न डालें।', 'fertilizer', 'All', 2, 1),
('रबी की फसल', 'गेहूं और जौ के लिए DAP और यूरिया का संतुलित उपयोग करें।', 'seasonal', 'Rabi', 3, 1),
('खरीफ की फसल', 'धान की फसल में यूरिया की मात्रा 3 बार में दें - रोपाई के समय, कल्ले फूटते समय, और बाली निकलते समय।', 'seasonal', 'Kharif', 4, 1),
('जल प्रबंधन', 'उर्वरक डालने के बाद हल्की सिंचाई अवश्य करें। इससे पोषक तत्व जड़ों तक पहुंचते हैं।', 'general', 'All', 5, 1)
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- 4. Update farmer_info table (if it exists)
-- Note: These will give errors if columns already exist - that's okay, just ignore those errors

-- Add approval_status column
ALTER TABLE farmer_info 
ADD COLUMN approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending' AFTER status;

-- Add is_active column
ALTER TABLE farmer_info 
ADD COLUMN is_active TINYINT(1) DEFAULT 0 AFTER approval_status;

-- Add approved_by column
ALTER TABLE farmer_info 
ADD COLUMN approved_by INT NULL AFTER is_active;

-- Add approved_at column
ALTER TABLE farmer_info 
ADD COLUMN approved_at TIMESTAMP NULL AFTER approved_by;

-- Add indexes (will skip if already exist)
ALTER TABLE farmer_info ADD INDEX idx_approval_status (approval_status);
ALTER TABLE farmer_info ADD INDEX idx_is_active (is_active);

-- Update existing records to have proper approval status
UPDATE farmer_info 
SET approval_status = CASE 
    WHEN status = 1 THEN 'approved'
    ELSE 'pending'
END,
is_active = status
WHERE approval_status = 'pending' OR approval_status IS NULL;

-- 5. Create retailers table
CREATE TABLE IF NOT EXISTS retailers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    retailer_id VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    shop_name VARCHAR(200),
    address TEXT,
    district VARCHAR(100),
    tehsil VARCHAR(100),
    block VARCHAR(100),
    license_number VARCHAR(100),
    approval_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    is_active TINYINT(1) DEFAULT 0,
    approved_by INT NULL,
    approved_at TIMESTAMP NULL,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mobile (mobile),
    INDEX idx_approval_status (approval_status),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Done! All tables created successfully
SELECT 'SuperAdmin Database Setup Complete!' AS status;

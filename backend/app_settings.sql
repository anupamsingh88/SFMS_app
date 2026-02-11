-- App Settings Table for SuperAdmin Dashboard
-- This table stores all configurable application settings

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

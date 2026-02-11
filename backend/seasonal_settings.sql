-- Seasonal Settings Table
-- Manages season-wise fertilizer allotment per hectare

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
-- Only Rabi and Kharif seasons
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

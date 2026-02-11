-- Advisory Tips Table
-- Stores agricultural tips and advice managed by SuperAdmin

CREATE TABLE IF NOT EXISTS advisory_tips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tip_type ENUM('general', 'seasonal', 'fertilizer', 'crop') DEFAULT 'general',
    season ENUM('Rabi', 'Kharif', 'Zaid', 'All') DEFAULT 'All',
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

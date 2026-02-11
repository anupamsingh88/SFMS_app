-- App Content Management Table
-- Stores all dynamic app content (instructions, helpline, notices, etc.)

CREATE TABLE IF NOT EXISTS app_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_key VARCHAR(100) UNIQUE NOT NULL,
    content_value TEXT NOT NULL,
    content_type ENUM('text', 'number', 'html', 'json') DEFAULT 'text',
    category VARCHAR(50) NOT NULL,
    display_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_active (is_active),
    INDEX idx_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Content

-- App Instructions (4 Steps)
INSERT INTO app_content (content_key, content_value, category, display_order, is_active) VALUES
('app_step_1_title', 'खाद अनुरोध (Retailer Selection)', 'instructions', 1, 1),
('app_step_1_description', 'डैशबोर्ड पर "खाद अनुरोध" बटन पर क्लिक करें। अपने नजदीकी दुकानदार का चयन करें।', 'instructions', 1, 1),
('app_step_2_title', 'दिनांक और मात्रा चुनें', 'instructions', 2, 1),
('app_step_2_description', 'अपनी सुविधानुसार तारीख चुनें और उपलब्ध स्टॉक में से खाद की मात्रा चुनें।', 'instructions', 2, 1),
('app_step_3_title', 'बुकिंग कन्फर्म करें', 'instructions', 3, 1),
('app_step_3_description', 'विवरण की जाँच करें और "बुकिंग कन्फर्म करें" बटन दबाएं।', 'instructions', 3, 1),
('app_step_4_title', 'टोकन और QR कोड प्राप्त करें', 'instructions', 4, 1),
('app_step_4_description', 'आपको एक टोकन नंबर और QR कोड मिलेगा। इसे दुकानदार को दिखाएं और खाद प्राप्त करें।', 'instructions', 4, 1),

-- Helpline Information
('helpline_number', '1800-180-1551', 'helpline', 1, 1),
('helpline_title', 'किसान सहायता केंद्र', 'helpline', 1, 1),
('helpline_description', 'किसी भी सहायता के लिए कॉल करें', 'helpline', 1, 1),
('helpline_button_text', 'कॉल करें', 'helpline', 1, 1),

-- Important Notices
('notice_1', 'खाद लेते समय अपना आधार कार्ड साथ रखें।', 'notices', 1, 1),
('notice_2', 'रसीद अवश्य लें।', 'notices', 2, 1),
('notice_3', 'टोकन केवल चयनित तिथि के लिए मान्य है।', 'notices', 3, 1),

-- Headers and Labels
('advice_screen_title', '💡 ऐप निर्देश और सहायता', 'headers', 1, 1),
('advice_screen_subtitle', 'ऐप का उपयोग कैसे करें', 'headers', 1, 1),
('notices_title', '📢 महत्वपूर्ण सूचना', 'headers', 2, 1),
('farmer_advice_title', '🌾 किसान सलाह', 'headers', 3, 1)

ON DUPLICATE KEY UPDATE 
    content_value = VALUES(content_value),
    updated_at = CURRENT_TIMESTAMP;

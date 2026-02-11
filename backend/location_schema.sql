-- Create Master Tables for Locations

-- 1. Districts (Zila)
CREATE TABLE IF NOT EXISTS districts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    state VARCHAR(50) DEFAULT 'Uttar Pradesh'
);

-- 2. Tehsils
CREATE TABLE IF NOT EXISTS tehsils (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_id INT NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
);

-- 3. Blocks
CREATE TABLE IF NOT EXISTS blocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    district_id INT NOT NULL,
    tehsil_id INT, -- Optional link to tehsil, though blocks are usually under districts
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE,
    FOREIGN KEY (tehsil_id) REFERENCES tehsils(id) ON DELETE SET NULL
);

-- 4. Villages (Gaon)
CREATE TABLE IF NOT EXISTS villages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    block_id INT NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    name_hi VARCHAR(100) NOT NULL,
    FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE
);

-- Insert Sample Data (5 records each)

-- Districts
INSERT INTO districts (name_en, name_hi) VALUES 
('Lucknow', 'लखनऊ'),
('Kanpur Nagar', 'कानपुर नगर'),
('Varanasi', 'वाराणसी'),
('Agra', 'आगरा'),
('Gorakhpur', 'गोरखपुर');

-- Tehsils (Mapping to Districts)
-- Lucknow (ID 1)
INSERT INTO tehsils (district_id, name_en, name_hi) VALUES 
(1, 'Lucknow Sadar', 'लखनऊ सदर'),
(1, 'Bakshi Ka Talab', 'बक्शी का तालाब');

-- Kanpur (ID 2)
INSERT INTO tehsils (district_id, name_en, name_hi) VALUES 
(2, 'Kanpur Sadar', 'कानपुर सदर');

-- Varanasi (ID 3)
INSERT INTO tehsils (district_id, name_en, name_hi) VALUES 
(3, 'Varanasi Sadar', 'वाराणसी सदर');

-- Gorakhpur (ID 5)
INSERT INTO tehsils (district_id, name_en, name_hi) VALUES 
(5, 'Gorakhpur Sadar', 'गोरखपुर सदर');

-- Blocks (Mapping to Districts & Tehsils)
-- Lucknow -> Lucknow Sadar
INSERT INTO blocks (district_id, tehsil_id, name_en, name_hi) VALUES 
(1, 1, 'Chinhat', 'चिनहट'),
(1, 1, 'Sarojini Nagar', 'सरोजिनी नगर');

-- Kanpur -> Kanpur Sadar
INSERT INTO blocks (district_id, tehsil_id, name_en, name_hi) VALUES 
(2, 3, 'Kalyanpur', 'कल्याणपुर');

-- Varanasi -> Varanasi Sadar
INSERT INTO blocks (district_id, tehsil_id, name_en, name_hi) VALUES 
(3, 4, 'Kashi Vidyapeeth', 'काशी विद्यापीठ');

-- Gorakhpur -> Gorakhpur Sadar
INSERT INTO blocks (district_id, tehsil_id, name_en, name_hi) VALUES 
(5, 5, 'Chargawan', 'चरगाँव');

-- Villages (Mapping to Blocks)
-- Chinhat (ID 1)
INSERT INTO villages (block_id, name_en, name_hi) VALUES 
(1, 'Chinhat Village', 'चिनहट गाँव'),
(1, 'Matiyari', 'मटियारी');

-- Sarojini Nagar (ID 2)
INSERT INTO villages (block_id, name_en, name_hi) VALUES 
(2, 'Amausi', 'अमौसी');

-- Kalyanpur (ID 3)
INSERT INTO villages (block_id, name_en, name_hi) VALUES 
(3, 'Bithoor', 'बिठूर');

-- Chargawan (ID 5)
INSERT INTO villages (block_id, name_en, name_hi) VALUES 
(5, 'Alexandra', 'अलेक्जेंड्रा');

-- Modify Farmer Info Table to use IDs
-- Note: This is a schema change. Existing data might need migration or truncation.
-- For now, we add the columns. 

ALTER TABLE farmer_info ADD COLUMN district_id INT;
ALTER TABLE farmer_info ADD COLUMN tehsil_id INT;
ALTER TABLE farmer_info ADD COLUMN block_id INT;
ALTER TABLE farmer_info ADD COLUMN village_id INT;

ALTER TABLE farmer_info ADD FOREIGN KEY (district_id) REFERENCES districts(id);
ALTER TABLE farmer_info ADD FOREIGN KEY (tehsil_id) REFERENCES tehsils(id);
ALTER TABLE farmer_info ADD FOREIGN KEY (block_id) REFERENCES blocks(id);
ALTER TABLE farmer_info ADD FOREIGN KEY (village_id) REFERENCES villages(id);

-- Optional: Drop old text columns if no longer needed, or keep for transition
-- ALTER TABLE farmer_info DROP COLUMN district;
-- ALTER TABLE farmer_info DROP COLUMN tehsil;
-- ALTER TABLE farmer_info DROP COLUMN block;
-- ALTER TABLE farmer_info DROP COLUMN village;

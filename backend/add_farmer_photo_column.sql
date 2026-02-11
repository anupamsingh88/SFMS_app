-- Add profile_photo column to farmer_info table
ALTER TABLE farmer_info ADD COLUMN profile_photo VARCHAR(255) DEFAULT NULL AFTER mobile;

-- Add index for faster lookups
CREATE INDEX idx_farmer_photo ON farmer_info(farmer_id, profile_photo);

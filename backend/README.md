# 🔧 SFMS Backend - PHP API

Backend API for the Smart Farming Management System (SFMS).

## 📁 Project Structure

```
backend/
├── *.php                           # API endpoints
├── *.sql                          # Database schemas
├── db_connect.php                 # Database connection
└── debug_log.txt                  # Development debug file (not committed)
```

## 🚀 Getting Started

### Prerequisites

- **XAMPP** or **WAMP** or **LAMP** (Apache + PHP + MySQL)
- PHP 7.4+ recommended
- MySQL 5.7+ or MariaDB

### Installation

1. **Copy backend folder to your web server:**
   ```bash
   # For XAMPP users
   Copy to: C:\xampp\htdocs\backend\
   
   # For WAMP users
   Copy to: C:\wamp64\www\backend\
   ```

2. **Start Apache and MySQL** from XAMPP/WAMP control panel

3. **Set up the database:**
   - Open phpMyAdmin: `http://localhost/phpmyadmin`
   - Create a new database: `sfms_db`
   - Import SQL files in this order:
     1. `schema.sql` - Basic tables
     2. `location_schema.sql` - Districts and blocks
     3. `seasonal_settings.sql` - Seasonal configurations
     4. `app_settings.sql` - Application settings
     5. `advisory_tips.sql` - Advisory tips
     6. `setup_superadmin_complete.sql` - Super admin setup
     7. `update_user_tables.sql` - User table updates

4. **Configure database connection:**
   - Edit `db_connect.php`
   - Update database credentials if needed:
     ```php
     $host = 'localhost';
     $dbname = 'sfms_db';
     $username = 'root';
     $password = '';  // Your MySQL password
     ```

5. **Update API URL in frontend:**
   - In frontend app, update the API base URL to point to your backend
   - Example: `http://YOUR_IP:80/backend/`

## 📡 API Endpoints

### Farmer APIs
- `POST /register_farmer.php` - Register new farmer
- `POST /approve_farmer.php` - Approve farmer registration (admin)
- `GET /get_pending_approvals.php` - Get pending farmer approvals

### Retailer APIs
- `POST /register_retailer.php` - Register new retailer
- `POST /login_retailer.php` - Retailer login

### Location APIs
- `GET /get_locations.php` - Get districts and blocks

### Settings APIs
- `GET /get_settings.php` - Get all settings
- `POST /update_setting.php` - Update global settings
- `POST /update_seasonal_setting.php` - Update seasonal settings

### Advisory APIs
- `POST /manage_advisory.php` - Create/update advisory tips

### User Management
- `POST /manage_users.php` - Manage users (super admin)

### Media Upload
- `POST /upload_media.php` - Upload media files

### Utilities
- `GET /check_database.php` - Check database connection

## 🗃️ Database Schema

### Main Tables
- `farmers` - Farmer registration data
- `retailers` - Retailer information
- `districts` - District master data
- `blocks` - Block master data
- `seasonal_settings` - Season-specific configurations
- `app_settings` - Global application settings
- `advisory_tips` - Advisory tips for farmers
- `users` - System users (super admin, etc.)

## 🔒 Security Notes

- Change default database credentials in production
- Enable HTTPS for production deployment
- Implement proper input validation and sanitization
- Use prepared statements (already implemented in most endpoints)
- Add rate limiting for production

## 🧪 Testing

Test the database connection:
```
http://localhost/backend/check_database.php
```

Test an API endpoint:
```
http://localhost/backend/get_locations.php
```

## 📝 Development

### Enable Debug Logging
Some endpoints write to `debug_log.txt` for debugging. This file is excluded from Git.

### Adding New Endpoints
1. Create new `.php` file
2. Include `db_connect.php` for database access
3. Use prepared statements for SQL queries
4. Return JSON response
5. Handle errors appropriately

## 🌐 CORS Configuration

If frontend and backend are on different domains, configure CORS headers in your PHP files:

```php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
```

## ⚙️ Configuration

### For Local Development
- Backend URL: `http://localhost/backend/`
- Database: `localhost:3306`

### For Network Access (LAN Testing)
- Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Backend URL: `http://YOUR_IP/backend/`
- Update firewall to allow port 80

## 📦 Dependencies

- PHP 7.4+
- MySQL 5.7+ or MariaDB
- Apache with mod_rewrite (optional)
- PHP extensions:
  - mysqli
  - json
  - fileinfo (for media uploads)

## 🐛 Troubleshooting

### Database Connection Failed
- Check MySQL is running
- Verify credentials in `db_connect.php`
- Ensure database `sfms_db` exists

### 404 Not Found
- Check backend folder is in correct location
- Verify Apache is running
- Check file permissions

### CORS Errors
- Add CORS headers to PHP files
- Check frontend API URL configuration

## 📚 Related Documentation

- Frontend README: `../New_SFMS_app/README.md`
- Super Admin Guide: `../New_SFMS_app/SUPERADMIN_README.md`

---

**Made with ❤️ for SFMS Project**

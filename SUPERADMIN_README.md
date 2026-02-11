# SuperAdmin Dashboard - Setup & Usage Guide

## 🚀 Quick Start

### Backend Setup

1. **Run Database Scripts** (in order):
   ```sql
   -- In phpMyAdmin or MySQL CLI
   source h:/htdocs/backend/app_settings.sql
   source h:/htdocs/backend/seasonal_settings.sql
   source h:/htdocs/backend/advisory_tips.sql
   source h:/htdocs/backend/update_user_tables.sql
   ```

2. **Create Upload Directories**:
   ```bash
   mkdir -p h:/htdocs/backend/uploads/logos
   mkdir -p h:/htdocs/backend/uploads/icons
   ```

3. **Verify API Endpoints** are accessible:
   - `http://192.168.29.97:8080/backend/get_settings.php`
   - `http://192.168.29.97:8080/backend/update_setting.php`
   - `http://192.168.29.97:8080/backend/manage_users.php`
   - `http://192.168.29.97:8080/backend/get_pending_approvals.php`

### Frontend Setup

The SuperAdmin Dashboard is already integrated into the app!

## 🔐 Access SuperAdmin Dashboard

### Login Credentials
- **Username**: `sadmin`
- **Password**: `weknowtech`

### Steps to Access:
1. Start the Expo app: `npx expo start`
2. Navigate to **Landing Screen**
3. Click on **दुकानदार (PACS)** card
4. Click **लॉगिन (Login)**
5. Enter credentials: `sadmin` / `weknowtech`
6. You'll be redirected to the **SuperAdmin Dashboard**!

## 📋 SuperAdmin Dashboard Features

### 1. **Hero Section**
- Real-time statistics dashboard
- Total Farmers & Retailers count
- Pending approvals count
- Active users count

### 2. **Tabs**
The dashboard has 5 main tabs:

#### 🎨 **Brand Settings** (ब्रांड)
- Upload application logo
- Change app heading
- Update tagline
- Manage app icon

#### 🌾 **Seasonal Settings** (सीजन)
- Configure Rabi/Kharif/Zaid seasons
- Set fertilizer allotments per hectare
- Enable/disable seasons

#### 💰 **Pricing** (मूल्य)
- Set Urea price per bag
- Set DAP price per bag
- Set NPK price per bag
- Set MOP price per bag

#### 💡 **Advisory** (सलाह)
- Add agricultural tips in Hindi
- Edit existing tips
- Delete tips
- Reorder tips

#### 👥 **User Management** (उपयोगकर्ता)
- View pending farmer approvals
- View pending retailer approvals
- Approve/Reject users
- Activate/Deactivate users

## 🎨 Design Features

- **Gradient Header** with animated title
- **Glass-morphism Cards** with shadows
- **Smooth Animations** on component load
- **Pull-to-Refresh** for real-time data updates
- **Tabbed Navigation** for organized sections
- **Responsive Design** adapts to screen size

## 🔧 Configuration

All settings are stored in the database and can be changed in real-time without code changes!

### Example: Change Logo
1. Go to **Brand Settings** tab
2. Click "Upload Logo"
3. Select image file
4. Logo updates immediately across the app

### Example: Approve a Farmer
1. Go to **User Management** tab
2. View pending farmers list
3. Click "Approve" button
4. Farmer can now login and book slots!

## 📱 App Integration

The app automatically loads settings from the SuperAdmin dashboard:
- Logo & heading on Landing Screen
- Fertilizer prices in booking flow
- Seasonal allotments for farmer quotas
- Advisory tips displayed to farmers

## 🛠 Troubleshooting

### Backend Issues
- Ensure XAMPP/Apache and MySQL are running
- Check API base URL in `src/config/config.ts`
- Verify database tables were created successfully

### Frontend Issues
- Run `npm install` to ensure all dependencies are installed
- Clear Expo cache: `npx expo start --clear`
- Check browser console for API errors

## 📚 Architecture

### Backend
- **PHP APIs** for CRUD operations
- **MySQL Database** for persistent storage
- **File Upload** for media management

### Frontend
- **React Context** for global state
- **Expo/React Native** for cross-platform UI
- **Linear Gradients** for modern aesthetics

## 🎯 Next Steps

Future enhancements:
1. Add rich text editor for advisory tips
2. Implement image cropping for logos
3. Add analytics dashboard
4. Create activity logs for admin actions
5. Add multi-language support

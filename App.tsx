import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import LandingScreen from './src/screens/LandingScreen';
import FarmerRegistrationScreen from './src/screens/Farmer/FarmerRegistrationScreen';
import FarmerLoginScreen from './src/screens/Farmer/FarmerLoginScreen';
import FarmerDashboard from './src/screens/Farmer/FarmerDashboard';
import RetailerSelectionScreen from './src/screens/Farmer/RetailerSelectionScreen';
import SlotBookingScreen from './src/screens/Farmer/SlotBookingScreen';
import TokenQRScreen from './src/screens/Farmer/TokenQRScreen';
import RetailerLoginScreen from './src/screens/Retailer/RetailerLoginScreen';
import RetailerRegistrationScreen from './src/screens/Retailer/RetailerRegistrationScreen';
import { SuperAdminDashboard, GlobalSettingsScreen, FarmerSettingsScreen, RetailerSettingsScreen } from './src/screens/SuperAdmin';
import { SettingsProvider } from './src/contexts/SettingsContext';
import { LoadingSpinner, Button } from './src/components';
import { Alert, View, Text } from 'react-native';

// Mock data (Replace with real API calls)
const MOCK_FERTILIZERS = [
  {
    id: 'f1',
    name: 'Urea',
    nameHindi: 'यूरिया',
    type: 'urea' as const,
    pricePerBag: 280,
    weightPerBag: 50,
    quota: {
      fertilizerId: 'f1',
      allowedQuantity: 10,
      usedQuantity: 2,
      remainingQuantity: 8,
      calculatedBasedOn: 'landArea' as const,
    },
  },
  {
    id: 'f2',
    name: 'DAP',
    nameHindi: 'डी.ए.पी.',
    type: 'dap' as const,
    pricePerBag: 1350,
    weightPerBag: 50,
    quota: {
      fertilizerId: 'f2',
      allowedQuantity: 5,
      usedQuantity: 0,
      remainingQuantity: 5,
      calculatedBasedOn: 'landArea' as const,
    },
  },
  {
    id: 'f3',
    name: 'NPK',
    nameHindi: 'एन.पी.के.',
    type: 'npk' as const,
    pricePerBag: 720,
    weightPerBag: 50,
    quota: {
      fertilizerId: 'f3',
      allowedQuantity: 8,
      usedQuantity: 8,
      remainingQuantity: 0,
      calculatedBasedOn: 'landArea' as const,
    },
  },
  {
    id: 'f4',
    name: 'MOP',
    nameHindi: 'एम.ओ.पी.',
    type: 'mop' as const,
    pricePerBag: 950,
    weightPerBag: 50,
    quota: {
      fertilizerId: 'f4',
      allowedQuantity: 6,
      usedQuantity: 1,
      remainingQuantity: 5,
      calculatedBasedOn: 'landArea' as const,
    },
  },
];

const MOCK_RETAILERS = [
  {
    id: 'r1',
    name: 'राम प्रसाद',
    shopName: 'ग्राम सेवा सहकारी समिति',
    mobileNumber: '9876543210',
    address: 'मुख्य मार्ग, बहादुरगंज, जिला - हापुड़',
    district: 'Hapur',
    role: 'retailer' as const,
    createdAt: '2024-01-01',
    licenseNumber: 'PACS123456',
  },
  {
    id: 'r2',
    name: 'मोहन लाल',
    shopName: 'किसान सहकारी भंडार',
    mobileNumber: '9876543211',
    address: 'बाज़ार रोड, पिलखुआ, जिला - हापुड़',
    district: 'Hapur',
    role: 'retailer' as const,
    createdAt: '2024-01-01',
    licenseNumber: 'PACS123457',
  },
];

const MOCK_TIME_SLOTS = [
  { id: 't1', startTime: '09:00', endTime: '10:00', availableSlots: 10, bookedSlots: 5, isAvailable: true },
  { id: 't2', startTime: '10:00', endTime: '11:00', availableSlots: 10, bookedSlots: 3, isAvailable: true },
  { id: 't3', startTime: '11:00', endTime: '12:00', availableSlots: 10, bookedSlots: 10, isAvailable: false },
  { id: 't4', startTime: '14:00', endTime: '15:00', availableSlots: 10, bookedSlots: 2, isAvailable: true },
  { id: 't5', startTime: '15:00', endTime: '16:00', availableSlots: 10, bookedSlots: 7, isAvailable: true },
];

type Screen =
  | 'Splash'
  | 'Landing'
  | 'Home'
  | 'FarmerRegistration'
  | 'FarmerLogin'
  | 'RetailerRegistration'
  | 'RetailerLogin'
  | 'SuperAdminDashboard'
  | 'GlobalSettings'
  | 'FarmerSettings'
  | 'RetailerSettings'
  | 'FarmerDashboard'
  | 'RetailerSelection'
  | 'SlotBooking'
  | 'TokenQR';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('Splash');
  const [farmerName, setFarmerName] = useState('राजेश कुमार');
  const [selectedFertilizer, setSelectedFertilizer] = useState<any>(null);
  const [selectedRetailer, setSelectedRetailer] = useState<any>(null);
  const [booking, setBooking] = useState<any>(null);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  const handleSplashFinish = () => {
    setCurrentScreen('Landing');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleFarmerRegistration = (data: any) => {
    setFarmerName(data.name);
    Alert.alert('सफलता', 'पंजीकरण सफल रहा!', [
      {
        text: 'ठीक है',
        onPress: () => setCurrentScreen('FarmerDashboard'),
      },
    ]);
  };

  const handleFarmerLogin = (mobile: string, password: string) => {
    // Mock login
    Alert.alert('सफलता', 'लॉगिन सफल रहा!', [
      {
        text: 'ठीक है',
        onPress: () => setCurrentScreen('FarmerDashboard'),
      },
    ]);
  };

  const handleRetailerLogin = (isSuperAdmin: boolean) => {
    if (isSuperAdmin) {
      setCurrentScreen('SuperAdminDashboard');
    } else {
      // Navigate to Retailer Dashboard when ready
      Alert.alert('सूचना', 'रिटेलर डैशबोर्ड जल्द ही उपलब्ध होगा।');
    }
  };

  const handleBookSlot = () => {
    // No specific fertilizer selected initially in new flow
    setSelectedFertilizer(null);
    setCurrentScreen('RetailerSelection');
  };

  const handleSelectRetailer = (retailerId: string) => {
    const retailer = MOCK_RETAILERS.find((r) => r.id === retailerId);
    setSelectedRetailer(retailer);
    setCurrentScreen('SlotBooking');
  };

  const handleConfirmBooking = (bookingData: any) => {
    // bookingData contains: { retailer, date, items, totalPrice, token }
    const newBooking = {
      id: 'b' + Date.now(),
      farmerId: 'farmer1',
      retailerId: bookingData.retailer.id,
      items: bookingData.items, // Array of { id, name, quantity, price }
      totalPrice: bookingData.totalPrice,
      bookingDate: bookingData.date,
      status: 'confirmed' as const,
      tokenNumber: 'TKN' + bookingData.token, // or just use the token from data
      qrCode: JSON.stringify({
        token: bookingData.token,
        farmer: farmerName,
        items: bookingData.items.map((i: any) => `${i.nameHindi}: ${i.quantity}`).join(', '),
        totalPrice: bookingData.totalPrice,
        date: bookingData.date,
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBooking(newBooking);
    setMyBookings(prev => [newBooking, ...prev]);
    setCurrentScreen('TokenQR');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Splash':
        return <SplashScreen onFinish={handleSplashFinish} />;

      case 'Landing':
        return <LandingScreen onNavigate={handleNavigate} />;

      case 'Home':
        return <HomeScreen onNavigate={handleNavigate} />;

      case 'FarmerRegistration':
        return (
          <FarmerRegistrationScreen
            onRegister={handleFarmerRegistration}
            onBack={() => setCurrentScreen('Landing')}
          />
        );

      case 'FarmerLogin':
        return (
          <FarmerLoginScreen
            onLogin={handleFarmerLogin}
            onBack={() => setCurrentScreen('Landing')}
          />
        );

      case 'FarmerDashboard':
        return (
          <FarmerDashboard
            farmerName={farmerName}
            fertilizers={MOCK_FERTILIZERS}
            myBookings={myBookings}
            onBookSlot={handleBookSlot}
            onLogout={() => setCurrentScreen('Landing')}
          />
        );

      case 'RetailerRegistration':
        return (
          <RetailerRegistrationScreen
            onBack={() => setCurrentScreen('Landing')}
            onRegisterSuccess={() => setCurrentScreen('RetailerLogin')}
          />
        );

      case 'RetailerLogin':
        return (
          <RetailerLoginScreen
            onBack={() => setCurrentScreen('Landing')}
            onLoginSuccess={handleRetailerLogin}
            onRegisterClick={() => setCurrentScreen('RetailerRegistration')}
          />
        );

      case 'SuperAdminDashboard':
        return (
          <SuperAdminDashboard
            onBack={() => setCurrentScreen('Landing')}
            onNavigateToGlobal={() => setCurrentScreen('GlobalSettings')}
            onNavigateToFarmers={() => setCurrentScreen('FarmerSettings')}
            onNavigateToRetailers={() => setCurrentScreen('RetailerSettings')}
          />
        );

      case 'GlobalSettings':
        return (
          <GlobalSettingsScreen
            onBack={() => setCurrentScreen('SuperAdminDashboard')}
          />
        );

      case 'FarmerSettings':
        return (
          <FarmerSettingsScreen
            onBack={() => setCurrentScreen('SuperAdminDashboard')}
          />
        );

      case 'RetailerSettings':
        return (
          <RetailerSettingsScreen
            onBack={() => setCurrentScreen('SuperAdminDashboard')}
          />
        );

      case 'RetailerSelection':
        return (
          <RetailerSelectionScreen
            retailers={MOCK_RETAILERS}
            onSelectRetailer={handleSelectRetailer}
            onBack={() => setCurrentScreen('FarmerDashboard')}
          />
        );

      case 'SlotBooking':
        return (
          <SlotBookingScreen
            retailer={selectedRetailer}
            farmerName={farmerName}
            onConfirmBooking={handleConfirmBooking}
            onBack={() => setCurrentScreen('RetailerSelection')}
          />
        );

      case 'TokenQR':
        return (
          <TokenQRScreen
            booking={booking}
            onBackToDashboard={() => setCurrentScreen('FarmerDashboard')}
          />
        );

      default:
        return <LoadingSpinner message="लोड हो रहा है..." />;
    }
  };

  return (
    <SettingsProvider>
      {renderScreen()}
      <StatusBar style="auto" />
    </SettingsProvider>
  );
}

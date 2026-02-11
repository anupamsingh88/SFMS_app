import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {
    BottomNavigation,
    FarmerHero,
    UsageStats,
    FertilizerCard,
} from '../../components';
import AdviceScreen from './AdviceScreen';
import RetailerSelectionScreen from './RetailerSelectionScreen';
import SlotBookingScreen from './SlotBookingScreen';
import TokenQRScreen from './TokenQRScreen';
import FarmerProfileScreen from './FarmerProfileScreen';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import { Booking } from '../../types';

interface Fertilizer {
    id: string;
    name: string;
    nameHindi: string;
    type: 'urea' | 'dap' | 'npk' | 'mop';
    pricePerBag: number;
    quota: {
        allowedQuantity: number;
        usedQuantity: number;
        remainingQuantity: number;
    };
}

interface FarmerDashboardProps {
    farmerName: string;
    fertilizers: Fertilizer[];
    myBookings: any[];
    onBookSlot: (fertilizerId: string) => void;
    onLogout: () => void;
}

export default function FarmerDashboard({
    farmerName,
    fertilizers,
    myBookings,
    onBookSlot,
    onLogout,
}: FarmerDashboardProps) {
    const [activeTab, setActiveTab] = useState<'home' | 'advice' | 'profile' | 'bookings' | 'request'>('home');
    const [selectedRetailer, setSelectedRetailer] = useState<any | null>(null);
    const [fertilizerPrices, setFertilizerPrices] = useState<any>({});
    const [pricesLoaded, setPricesLoaded] = useState(false);
    const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
    const [localBookings, setLocalBookings] = useState<Booking[]>([]);

    // Fetch fertilizer prices from database
    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.getFertilizerPrices);
                const data = await response.json();

                if (data.success && data.prices) {
                    // Convert array to object with type as key
                    const pricesMap: any = {};
                    data.prices.forEach((price: any) => {
                        pricesMap[price.type] = price.pricePerBag;
                    });
                    setFertilizerPrices(pricesMap);
                    setPricesLoaded(true);
                }
            } catch (error) {
                console.error('Error fetching fertilizer prices:', error);
                setPricesLoaded(true); // Still set to true to show default prices
            }
        };

        fetchPrices();
    }, []);

    // Update fertilizer prices with fetched data
    const fertilizersWithPrices = fertilizers.map(f => ({
        ...f,
        pricePerBag: fertilizerPrices[f.type] || f.pricePerBag
    }));

    // Calculate total usage stats
    const totalUsed = fertilizers.reduce((sum, f) => sum + f.quota.usedQuantity, 0);
    const totalRemaining = fertilizers.reduce((sum, f) => sum + f.quota.remainingQuantity, 0);
    const totalQuota = fertilizers.reduce((sum, f) => sum + f.quota.allowedQuantity, 0);

    // Render content based on active tab
    const renderContent = () => {
        if (activeTab === 'advice') {
            return <AdviceScreen farmerName={farmerName} />;
        }




        if (activeTab === 'request') {
            // Show Token/QR if booking just confirmed
            if (currentBooking) {
                return (
                    <TokenQRScreen
                        booking={currentBooking}
                        onBackToDashboard={() => {
                            setCurrentBooking(null);
                            setActiveTab('home');
                            setSelectedRetailer(null);
                        }}
                    />
                );
            }

            // If retailer is selected, show booking form
            if (selectedRetailer) {
                return (
                    <SlotBookingScreen
                        retailer={selectedRetailer}
                        farmerName={farmerName}
                        onConfirmBooking={(data) => {
                            // Create new booking object
                            const newBooking: Booking = {
                                id: Date.now().toString(),
                                farmerId: 'farmer-1', // Mock ID
                                retailerId: data.retailer.shopName,
                                items: data.items,
                                totalPrice: data.totalPrice,
                                bookingDate: data.date,
                                status: 'confirmed',
                                tokenNumber: data.token.toString(),
                                qrCode: JSON.stringify({
                                    id: Date.now().toString(),
                                    items: data.items,
                                    token: data.token
                                }),
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            };

                            setLocalBookings(prev => [newBooking, ...prev]);
                            setCurrentBooking(newBooking);
                            // Alert.alert('बुकिंग सफल', 'आपकी बुकिंग सफलतापूर्वक हो गई है!'); // Removed simple alert
                        }}
                        onBack={() => setSelectedRetailer(null)}
                    />
                );
            }

            // Otherwise show retailer selection
            return (
                <RetailerSelectionScreen
                    retailers={[
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
                    ]}
                    onSelectRetailer={(id) => {
                        // Find the selected retailer
                        const retailer = [
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
                        ].find(r => r.id === id);
                        setSelectedRetailer(retailer);
                    }}
                    onBack={() => setActiveTab('home')}
                    embedded={true}
                />
            );
        }


        if (activeTab === 'bookings') {
            const allBookings = [...localBookings, ...(myBookings || [])];

            return (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📅 मेरी बुकिंग (My Bookings)</Text>
                        {allBookings && allBookings.length > 0 ? (
                            allBookings.map((booking, index) => (
                                <View key={index} style={styles.bookingCard}>
                                    <View style={styles.bookingHeader}>
                                        <Text style={styles.bookingToken}>Token: {booking.tokenNumber}</Text>
                                        <View style={styles.bookingStatus}>
                                            <Text style={styles.bookingStatusText}>Confirmed</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.bookingDate}>
                                        📅 {new Date(booking.bookingDate).toLocaleDateString('hi-IN')}
                                    </Text>
                                    <View style={styles.bookingItems}>
                                        {booking.items.map((item: any, i: number) => (
                                            <Text key={i} style={styles.bookingItemText}>
                                                • {item.nameHindi} ({item.name}): {item.quantity} बोरी
                                            </Text>
                                        ))}
                                    </View>
                                    <Text style={styles.bookingPrice}>कुल राशि: ₹{booking.totalPrice}</Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyStateEmoji}>📭</Text>
                                <Text style={styles.emptyStateText}>कोई बुकिंग नहीं मिली</Text>
                            </View>
                        )}
                        <View style={{ height: SPACING.xxl }} />
                    </View>
                </ScrollView>
            );
        }

        if (activeTab === 'profile') {
            return <FarmerProfileScreen farmerName={farmerName} onLogout={onLogout} />;
        }

        // Home tab - default dashboard
        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Usage Stats Card */}
                <View style={[styles.section, styles.firstSection]}>
                    <Text style={styles.sectionTitle}>📊 उपयोग सारांश</Text>
                    <UsageStats
                        used={totalUsed}
                        remaining={totalRemaining}
                        total={totalQuota}
                        unit="बोरी"
                    />
                </View>

                {/* Fertilizers Grid */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>उर्वरक चुनें</Text>

                    <View style={styles.fertilizerGrid}>
                        {fertilizersWithPrices.map((fertilizer) => (
                            <FertilizerCard
                                key={fertilizer.id}
                                id={fertilizer.id}
                                name={fertilizer.name}
                                nameHindi={fertilizer.nameHindi}
                                type={fertilizer.type}
                                price={fertilizer.pricePerBag}
                                availableQuantity={fertilizer.quota.remainingQuantity}
                                onPress={() => {
                                    // Auto-add 1 bag and navigate to request form
                                    // onBookSlot(fertilizer.id); // Removed to prevent navigation away from Dashboard
                                    setActiveTab('request');
                                }}
                            />
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚡ त्वरित कार्य</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={[styles.actionCard, styles.primaryAction]}
                            onPress={() => setActiveTab('request')}
                        >
                            <Text style={styles.actionEmoji}>📝</Text>
                            <Text style={[styles.actionText, styles.primaryActionText]}>
                                खाद अनुरोध (नया)
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => setActiveTab('bookings')}
                        >
                            <View style={styles.calendarIcon}>
                                <Text style={styles.calendarMonth}>{new Date().toLocaleDateString('hi-IN', { month: 'short' }).toUpperCase()}</Text>
                                <Text style={styles.calendarDate}>{new Date().getDate()}</Text>
                            </View>
                            <Text style={styles.actionText}>मेरी बुकिंग</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => setActiveTab('advice')}
                        >
                            <Text style={styles.actionEmoji}>💡</Text>
                            <Text style={styles.actionText}>सलाह</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionCard}>
                            <Text style={styles.actionEmoji}>📞</Text>
                            <Text style={styles.actionText}>सहायता</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Spacing for bottom nav */}
                <View style={{ height: SPACING.xxl }} />
            </ScrollView>
        );
    };

    return (
        <View style={styles.container}>
            {/* Hero Header - Fixed across all tabs */}
            <FarmerHero name={farmerName} subtitle="अपनी उर्वरक कोटा प्रबंधित करें" />

            {/* Main Content */}
            {renderContent()}

            {/* Bottom Navigation */}
            <BottomNavigation
                activeTab={activeTab}
                onTabPress={(tab) => {
                    if (tab === 'request') {
                        setActiveTab('request');
                    } else {
                        setActiveTab(tab);
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: SPACING.xxl,
    },
    firstSection: {
        marginTop: SPACING.md,
    },
    section: {
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    logoutText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    fertilizerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        minHeight: 120,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    primaryAction: {
        backgroundColor: COLORS.primary,
    },
    primaryActionText: {
        color: COLORS.white,
    },
    actionEmoji: {
        fontSize: 36,
        marginBottom: SPACING.sm,
    },
    actionText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    calendarIcon: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 2,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    calendarMonth: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 0.5,
    },
    calendarDate: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: -4,
    },
    profileView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xxl,
    },
    comingSoonEmoji: {
        fontSize: 80,
        marginBottom: SPACING.lg,
    },
    comingSoonText: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    comingSoonSubtext: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    bookingCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    bookingToken: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    bookingStatus: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: SPACING.sm,
        paddingVertical: 4,
        borderRadius: 4,
    },
    bookingStatusText: {
        color: '#166534',
        fontSize: 12,
        fontWeight: 'bold',
    },
    bookingDate: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    bookingItems: {
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.background,
        padding: SPACING.sm,
        borderRadius: 4,
    },
    bookingItemText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    bookingPrice: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.primary,
        alignSelf: 'flex-end',
    },
    emptyState: {
        alignItems: 'center',
        padding: SPACING.xl,
        marginTop: SPACING.xl,
    },
    emptyStateEmoji: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    emptyStateText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
});

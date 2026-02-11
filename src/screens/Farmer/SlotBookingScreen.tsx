import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Button, Input, FarmerHero } from '../../components'; // Assuming Input is available for Date if needed, or we use a custom date picker
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
    BORDER_RADIUS,
    SHADOWS,
} from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
// import DateTimePicker from '@react-native-community/datetimepicker'; // If you have this installed, otherwise we'll use a simple mock date picker

interface Retailer {
    id: string;
    shopName: string;
    name: string;
    address: string;
}

interface FertilizerStock {
    id: string; // 'f1', 'f2' etc.
    name: string;
    nameHindi: string;
    price: number;
    availableStock: number;
    userQuota: number;
    userQuotaRemaining: number;
}

interface SlotBookingScreenProps {
    retailer: Retailer;
    farmerName: string;
    onConfirmBooking: (bookingData: any) => void;
    onBack: () => void;
}

// Mock Data for Stock (In real app, fetch from API based on retailer and date)
const MOCK_STOCKS: Record<string, FertilizerStock> = {
    'f1': { id: 'f1', name: 'Urea', nameHindi: 'यूरिया', price: 266.50, availableStock: 500, userQuota: 50, userQuotaRemaining: 10 },
    'f2': { id: 'f2', name: 'DAP', nameHindi: 'डीएपी', price: 1350, availableStock: 200, userQuota: 20, userQuotaRemaining: 5 },
    'f3': { id: 'f3', name: 'NPK', nameHindi: 'एनपीके', price: 1470, availableStock: 150, userQuota: 25, userQuotaRemaining: 25 },
    'f4': { id: 'f4', name: 'MOP', nameHindi: 'एमओपी', price: 1700, availableStock: 100, userQuota: 15, userQuotaRemaining: 15 },
};

export default function SlotBookingScreen({
    retailer,
    farmerName,
    onConfirmBooking,
    onBack,
}: SlotBookingScreenProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [stocks, setStocks] = useState<FertilizerStock[]>([]);

    useEffect(() => {
        // Fetch fertilizer prices from database and update stocks
        const fetchPricesAndStocks = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.getFertilizerPrices);
                const data = await response.json();

                if (data.success && data.prices) {
                    // Update MOCK_STOCKS with fetched prices
                    const updatedStocks = Object.values(MOCK_STOCKS).map(stock => {
                        const priceData = data.prices.find((p: any) => p.type === stock.id);
                        if (priceData) {
                            return { ...stock, price: priceData.pricePerBag };
                        }
                        return stock;
                    });
                    setStocks(updatedStocks);
                } else {
                    // Fallback to MOCK_STOCKS if API fails
                    setStocks(Object.values(MOCK_STOCKS));
                }
            } catch (error) {
                console.error('Error fetching prices:', error);
                // Fallback to MOCK_STOCKS if API fails
                setStocks(Object.values(MOCK_STOCKS));
            }
        };

        fetchPricesAndStocks();
    }, [selectedDate]); // Refetch when date changes


    const updateQuantity = (id: string, delta: number) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const newVal = Math.max(0, current + delta);

            // Validate against Stock and Quota
            const stock = stocks.find(s => s.id === id);
            if (!stock) return prev;

            if (newVal > stock.availableStock) {
                Alert.alert('स्टॉक उपलब्ध नहीं', `केवल ${stock.availableStock} बोरी उपलब्ध हैं।`);
                return prev;
            }
            if (newVal > stock.userQuotaRemaining) {
                Alert.alert('कोटा सीमा', `आपका शेष कोटा केवल ${stock.userQuotaRemaining} बोरी है।`);
                return prev;
            }

            return { ...prev, [id]: newVal };
        });
    };

    const totalBags = Object.values(quantities).reduce((a, b) => a + b, 0);
    const totalPrice = stocks.reduce((sum, stock) => sum + (stock.price * (quantities[stock.id] || 0)), 0);

    const handleBooking = () => {
        const items = stocks.filter(s => (quantities[s.id] || 0) > 0).map(s => ({
            ...s,
            quantity: quantities[s.id]
        }));

        if (items.length === 0) {
            Alert.alert('त्रुटि', 'कृपया कम से कम एक उर्वरक चुनें।');
            return;
        }

        Alert.alert(
            'पुष्टि करें',
            `कुल ${totalBags} बोरी\nकुल राशि: ₹${totalPrice}\n\nक्या आप बुकिंग कन्फर्म करना चाहते हैं?`,
            [
                { text: 'नहीं', style: 'cancel' },
                {
                    text: 'हाँ, कन्फर्म करें',
                    onPress: () => {
                        onConfirmBooking({
                            retailer,
                            date: selectedDate.toISOString(),
                            items,
                            totalPrice,
                            token: Math.floor(1000 + Math.random() * 9000) // Generate simple 4 digit token
                        });
                    }
                }
            ]
        );
    };

    // Simple Date Selector (Next 7 days)
    const renderDateSelector = () => {
        const dates = [];
        for (let i = 0; i < 5; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            dates.push(d);
        }

        return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                {dates.map((date, index) => {
                    const isSelected = date.toDateString() === selectedDate.toDateString();
                    return (
                        <TouchableOpacity
                            key={index}
                            style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                            onPress={() => setSelectedDate(date)}
                        >
                            <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                                {date.toLocaleDateString('hi-IN', { weekday: 'short' })}
                            </Text>
                            <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>
                                {date.getDate()}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        );
    };

    return (
        <LinearGradient
            colors={[COLORS.backgroundLight, COLORS.background]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Text style={styles.backIcon}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>खाद अनुरोध फॉर्म</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>

                    {/* Retailer Info */}
                    <Card style={styles.retailerCard}>
                        <Text style={styles.retailerName}>{retailer.shopName}</Text>
                        <Text style={styles.retailerAddress}>{retailer.address}</Text>
                    </Card>

                    {/* Date Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>दिनांक चुनें</Text>
                        {renderDateSelector()}
                    </View>

                    {/* Stock & Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>उर्वरक चुनें</Text>
                        {stocks.map(stock => (
                            <Card key={stock.id} style={styles.stockCard}>
                                <View style={styles.stockInfo}>
                                    <Text style={styles.stockName}>{stock.nameHindi} ({stock.name})</Text>
                                    <Text style={styles.stockPrice}>₹{stock.price} / बोरी</Text>
                                    <Text style={{ fontSize: 12, color: COLORS.warning, fontWeight: 'bold', marginTop: 4 }}>
                                        कोटा शेष: {stock.userQuotaRemaining} बोरी
                                    </Text>
                                </View>

                                <View style={styles.counter}>
                                    <TouchableOpacity
                                        style={[styles.countBtn, styles.minusBtn]}
                                        onPress={() => updateQuantity(stock.id, -1)}
                                    >
                                        <Text style={styles.countBtnText}>-</Text>
                                    </TouchableOpacity>

                                    <View style={styles.countDisplay}>
                                        <Text style={styles.countText}>{quantities[stock.id] || 0}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.countBtn, styles.plusBtn]}
                                        onPress={() => updateQuantity(stock.id, 1)}
                                    >
                                        <Text style={styles.countBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </Card>
                        ))}
                    </View>

                </ScrollView>

                {/* Footer Bar */}
                {totalBags > 0 && (
                    <View style={styles.footer}>
                        <View>
                            <Text style={styles.footerLabel}>कुल ({totalBags} बोरी)</Text>
                            <Text style={styles.footerPrice}>₹{totalPrice}</Text>
                        </View>
                        <Button
                            title="बुकिंग कन्फर्म करें"
                            onPress={handleBooking}
                            size="large"
                            style={styles.bookBtn}
                            textStyle={{ fontSize: FONT_SIZES.xl }}
                        />
                    </View>
                )}
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    safeArea: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingBottom: SPACING.sm,
        backgroundColor: COLORS.background, // Match background
    },
    backButton: {
        marginRight: SPACING.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    backIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: -2,
    },
    headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
    content: { padding: SPACING.lg, paddingBottom: 120 }, // Increased padding bottom to avoid footer overlap

    retailerCard: { marginBottom: SPACING.lg, padding: SPACING.md },
    retailerName: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.textPrimary },
    retailerAddress: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 4 },

    section: { marginBottom: SPACING.xl },
    sectionTitle: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.md, color: COLORS.textPrimary },

    dateScroll: { flexDirection: 'row' },
    dateCard: {
        width: 60,
        height: 70,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    dateCardSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    dateText: { fontSize: FONT_SIZES.xs, color: COLORS.textSecondary },
    dateTextSelected: { color: COLORS.white },
    dayText: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.textPrimary },
    dayTextSelected: { color: COLORS.white },

    stockCard: {
        marginBottom: SPACING.md,
        padding: SPACING.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    stockInfo: { flex: 1 },
    stockName: { fontSize: FONT_SIZES.md, fontWeight: 'bold', color: COLORS.textPrimary },
    stockPrice: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary, marginTop: 2 },
    stockAvail: { fontSize: 10, color: COLORS.info, marginTop: 4, fontWeight: '600' },

    counter: { flexDirection: 'row', alignItems: 'center' },
    countBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
    minusBtn: { borderColor: COLORS.gray, backgroundColor: COLORS.grayLight },
    plusBtn: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
    countBtnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary },
    countDisplay: { width: 40, alignItems: 'center' },
    countText: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
        paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.lg, // Extra padding for iOS home indicator
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.grayLight,
        ...SHADOWS.medium
    },
    footerLabel: { fontSize: FONT_SIZES.sm, color: COLORS.textSecondary },
    footerPrice: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.primary },
    bookBtn: { width: 220 }
});

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS, BORDER_RADIUS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import BackButton from '../../components/BackButton';
import RetailerManagementCard from './RetailerManagementCard';

interface RetailerSettingsScreenProps {
    onBack: () => void;
}

interface Stats {
    totalRetailers: number;
    pendingRetailers: number;
    activeRetailers: number;
}

type SettingsView = 'main' | 'management';

const HEADER_HEIGHT = 140;

export default function RetailerSettingsScreen({ onBack }: RetailerSettingsScreenProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<Stats>({ totalRetailers: 0, pendingRetailers: 0, activeRetailers: 0 });
    const [currentView, setCurrentView] = useState<SettingsView>('main');
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT / 2, HEADER_HEIGHT],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.getUsersPendingApproval);
            const result = await response.json();
            if (result.success) {
                setStats({
                    totalRetailers: result.data.stats?.retailers?.total || 0,
                    pendingRetailers: result.data.stats?.retailers?.pending || 0,
                    activeRetailers: result.data.stats?.retailers?.active || 0,
                });
            }
        } catch (error) {
            console.error('Stats fetch error:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStats();
        setRefreshing(false);
    };

    const handleBackToMain = () => {
        setCurrentView('main');
    };

    const renderStatsCards = () => (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalRetailers}</Text>
                <Text style={styles.statLabel}>कुल विक्रेता</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.pendingNumber]}>{stats.pendingRetailers}</Text>
                <Text style={styles.statLabel}>लंबित</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.activeNumber]}>{stats.activeRetailers}</Text>
                <Text style={styles.statLabel}>सक्रिय</Text>
            </View>
        </View>
    );

    const renderMainNavigation = () => (
        <View>
            {renderStatsCards()}

            <View style={styles.navigationContainer}>
                {/* Retailer Management */}
                <TouchableOpacity
                    style={styles.navCard}
                    onPress={() => setCurrentView('management')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#8B5CF6', '#7C3AED']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.navCardGradient}
                    >
                        <View style={styles.navCardIcon}>
                            <MaterialCommunityIcons name="account-group" size={48} color={COLORS.white} />
                        </View>
                        <View style={styles.navCardContent}>
                            <Text style={styles.navCardTitle}>👥 Retailer Management</Text>
                            <Text style={styles.navCardSubtitle}>खुदरा विक्रेता प्रबंधन</Text>
                            <Text style={styles.navCardDescription}>
                                विक्रेताओं की सूची और approval status manage करें
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Coming Soon Card */}
                <View style={styles.comingSoonCard}>
                    <Text style={styles.comingSoonIcon}>🚧</Text>
                    <Text style={styles.comingSoonText}>More Settings Coming Soon</Text>
                    <Text style={styles.comingSoonSubtext}>अधिक सुविधाएँ जल्द ही आ रही हैं</Text>
                </View>
            </View>
        </View>
    );

    const renderDetailView = () => {
        switch (currentView) {
            case 'management':
                return (
                    <View>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                            <Text style={styles.backButtonText}>Back to Settings</Text>
                        </TouchableOpacity>
                        <RetailerManagementCard />
                    </View>
                );
            default:
                return renderMainNavigation();
        }
    };

    return (
        <View style={styles.container}>
            <BackButton onPress={onBack} />

            {/* Collapsible Header */}
            <Animated.View
                style={[
                    styles.headerContainer,
                    {
                        transform: [{ translateY: headerTranslateY }],
                        opacity: headerOpacity
                    }
                ]}
            >
                <LinearGradient
                    colors={['#F59E0B', '#D97706'] as unknown as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerIcon}>🏪</Text>
                            <View>
                                <Text style={styles.headerTitle}>Retailer Settings</Text>
                                <Text style={styles.headerSubtitle}>खुदरा विक्रेता सेटिंग्स</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </Animated.View>

            {/* Content */}
            <Animated.ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={{ paddingTop: HEADER_HEIGHT + 20 }}>
                    {renderDetailView()}
                </View>
            </Animated.ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    headerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    header: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.md,
        paddingHorizontal: SPACING.lg,
        ...SHADOWS.large,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
    },
    headerIcon: {
        fontSize: 48,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 15,
        color: COLORS.white,
        opacity: 0.95,
        marginTop: 4,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: 100,
        paddingTop: SPACING.lg,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    statNumber: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    pendingNumber: {
        color: COLORS.warning,
    },
    activeNumber: {
        color: COLORS.success,
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    navigationContainer: {
        gap: SPACING.lg,
    },
    navCard: {
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.large,
        marginBottom: SPACING.sm,
    },
    navCardGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        gap: SPACING.md,
    },
    navCardIcon: {
        width: 72,
        height: 72,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    navCardContent: {
        flex: 1,
    },
    navCardTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: 4,
    },
    navCardSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: 4,
    },
    navCardDescription: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        opacity: 0.8,
        lineHeight: 18,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xs,
        marginBottom: SPACING.lg,
        padding: SPACING.sm,
    },
    backButtonText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    comingSoonCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.xl,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    comingSoonIcon: {
        fontSize: 48,
        marginBottom: SPACING.md,
    },
    comingSoonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    comingSoonSubtext: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
});

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS, BORDER_RADIUS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import BackButton from '../../components/BackButton';
import SeasonalSettingsCard from './SeasonalSettingsCard';
import AdvisoryTipsCard from './AdvisoryTipsCard';

interface FarmerSettingsScreenProps {
    onBack: () => void;
}

interface Stats {
    totalFarmers: number;
    pendingFarmers: number;
    activeFarmers: number;
}

type SettingsView = 'main' | 'seasonal' | 'advisory';

const HEADER_HEIGHT = 150;

export default function FarmerSettingsScreen({ onBack }: FarmerSettingsScreenProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<Stats>({ totalFarmers: 0, pendingFarmers: 0, activeFarmers: 0 });
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
            if (result.success && result.data && result.data.stats && result.data.stats.farmers) {
                setStats({
                    totalFarmers: result.data.stats.farmers.total || 0,
                    pendingFarmers: result.data.stats.farmers.pending || 0,
                    activeFarmers: result.data.stats.farmers.active || 0,
                });
            } else {
                // Set default stats if data structure is unexpected
                setStats({
                    totalFarmers: 0,
                    pendingFarmers: 0,
                    activeFarmers: 0,
                });
            }
        } catch (error) {
            console.error('Failed to fetch farmer stats:', error);
            // Set default stats on error
            setStats({
                totalFarmers: 0,
                pendingFarmers: 0,
                activeFarmers: 0,
            });
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
                <Text style={[styles.statNumber, styles.totalNumber]}>{stats.totalFarmers}</Text>
                <Text style={styles.statLabel}>कुल किसान</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.pendingNumber]}>{stats.pendingFarmers}</Text>
                <Text style={styles.statLabel}>लंबित</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={[styles.statNumber, styles.activeNumber]}>{stats.activeFarmers}</Text>
                <Text style={styles.statLabel}>सक्रिय</Text>
            </View>
        </View>
    );

    const renderMainNavigation = () => (
        <View>
            {renderStatsCards()}

            <View style={styles.navigationContainer}>
                {/* Seasonal Settings */}
                <TouchableOpacity
                    style={styles.navCard}
                    onPress={() => setCurrentView('seasonal')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#F59E0B', '#D97706']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.navCardGradient}
                    >
                        <View style={styles.navCardIcon}>
                            <MaterialCommunityIcons name="weather-sunny" size={48} color={COLORS.white} />
                        </View>
                        <View style={styles.navCardContent}>
                            <Text style={styles.navCardTitle}>🌾 Seasonal Settings</Text>
                            <Text style={styles.navCardSubtitle}>मौसमी सेटिंग्स</Text>
                            <Text style={styles.navCardDescription}>
                                खरीफ और रबी के लिए fertilizer limits सेट करें
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                    </LinearGradient>
                </TouchableOpacity>

                {/* Advisory Tips */}
                <TouchableOpacity
                    style={styles.navCard}
                    onPress={() => setCurrentView('advisory')}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.navCardGradient}
                    >
                        <View style={styles.navCardIcon}>
                            <MaterialCommunityIcons name="lightbulb-on" size={48} color={COLORS.white} />
                        </View>
                        <View style={styles.navCardContent}>
                            <Text style={styles.navCardTitle}>💡 Advisory Tips</Text>
                            <Text style={styles.navCardSubtitle}>किसान सलाह</Text>
                            <Text style={styles.navCardDescription}>
                                किसानों के लिए महत्वपूर्ण सुझाव manage करें
                            </Text>
                        </View>
                        <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderDetailView = () => {
        try {
            switch (currentView) {
                case 'seasonal':
                    return (
                        <View>
                            <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                                <Text style={styles.backButtonText}>Back to Settings</Text>
                            </TouchableOpacity>
                            <SeasonalSettingsCard />
                        </View>
                    );
                case 'advisory':
                    return (
                        <View>
                            <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                                <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                                <Text style={styles.backButtonText}>Back to Settings</Text>
                            </TouchableOpacity>
                            <AdvisoryTipsCard />
                        </View>
                    );
                default:
                    return renderMainNavigation();
            }
        } catch (error) {
            console.error('Render error in FarmerSettings:', error);
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠️ Error loading settings</Text>
                    <TouchableOpacity onPress={handleBackToMain} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            );
        }
    };

    return (
        <View style={styles.container}>
            <BackButton onPress={onBack} />

            {/* Collapsible Header */}
            <Animated.View
                style={[
                    styles.headerContainer,
                    { transform: [{ translateY: headerTranslateY }], opacity: headerOpacity }
                ]}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <View>
                                <Text style={styles.headerTitle}>Farmer Settings</Text>
                                <Text style={styles.headerSubtitle}>किसान सेटिंग्स</Text>
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
        paddingTop: SPACING.xxl,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        ...SHADOWS.large,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING.sm,
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
        marginBottom: SPACING.xs,
    },
    totalNumber: {
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
    },
    navigationContainer: {
        gap: SPACING.md,
        marginTop: SPACING.md,
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    errorText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.error,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
    },
});

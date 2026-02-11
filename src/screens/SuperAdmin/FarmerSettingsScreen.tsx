import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import BackButton from '../../components/BackButton';
import SeasonalSettingsCard from './SeasonalSettingsCard';

interface FarmerSettingsScreenProps {
    onBack: () => void;
}

interface Stats {
    totalFarmers: number;
    pendingFarmers: number;
    activeFarmers: number;
}

const HEADER_HEIGHT = 80;

export default function FarmerSettingsScreen({ onBack }: FarmerSettingsScreenProps) {
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<Stats>({ totalFarmers: 0, pendingFarmers: 0, activeFarmers: 0 });
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
            const response = await fetch(API_ENDPOINTS.getPendingApprovals);
            const result = await response.json();
            if (result.success) {
                setStats({
                    totalFarmers: result.data.totalFarmers || 0,
                    pendingFarmers: result.data.pendingFarmers?.length || 0,
                    activeFarmers: result.data.activeFarmers || 0,
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
                    colors={['#10B981', '#059669'] as unknown as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerIcon}>👨‍🌾</Text>
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
                <View style={styles.contentWrapper}>
                    {/* Stats Cards - Separate from header */}
                    <View style={styles.statsContainer}>
                        <View style={styles.statCard}>
                            <Text style={styles.statNumber}>{stats.totalFarmers}</Text>
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

                    {/* Settings Cards */}
                    <SeasonalSettingsCard />
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
        fontSize: 32,
    },
    headerTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        opacity: 0.9,
    },
    scrollContent: {
        paddingTop: HEADER_HEIGHT,
    },
    contentWrapper: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.xxl,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    statCard: {
        flex: 1,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: SPACING.md,
        alignItems: 'center',
        ...SHADOWS.medium,
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
});

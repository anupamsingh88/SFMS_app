import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Animated,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    GRADIENTS,
    SHADOWS
} from '../../constants';
import { useSettings } from '../../contexts/SettingsContext';
import { API_ENDPOINTS } from '../../config/config';
import BackButton from '../../components/BackButton';

interface SuperAdminDashboardProps {
    onBack: () => void;
    onNavigateToGlobal: () => void;
    onNavigateToFarmers: () => void;
    onNavigateToRetailers: () => void;
}

interface UserStats {
    farmers: {
        total: number;
        pending: number;
        approved: number;
        active: number;
    };
    retailers: {
        total: number;
        pending: number;
        approved: number;
        active: number;
    };
}

export default function SuperAdminDashboard({ onBack, onNavigateToGlobal, onNavigateToFarmers, onNavigateToRetailers }: SuperAdminDashboardProps) {
    const { refreshSettings } = useSettings();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.98))[0];
    const slideAnim = useState(new Animated.Value(10))[0];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 10,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.getPendingApprovals);
            const result = await response.json();
            if (result.success) {
                setStats(result.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await Promise.all([refreshSettings(), fetchStats()]);
        setRefreshing(false);
    };

    return (
        <View style={styles.container}>
            {/* Visible Back Button */}
            <View style={styles.backButtonContainer}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← वापस</Text>
                </TouchableOpacity>
            </View>

            {/* Compact Gradient Header */}
            <LinearGradient
                colors={[...GRADIENTS.purple, COLORS.primary] as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView>
                    <Animated.View style={{ opacity: fadeAnim, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.headerIcon}>⚡</Text>
                        <View>
                            <Text style={styles.headerTitle}>SuperAdmin Control Panel</Text>
                            <Text style={styles.headerSubtitle}>Choose a category to manage</Text>
                        </View>
                    </Animated.View>
                </SafeAreaView>
            </LinearGradient>

            {/* Main Content */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [
                            { scale: scaleAnim },
                            { translateY: slideAnim }
                        ]
                    }}
                >
                    {/* Welcome Message */}
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeTitle}>Welcome Back! 👋</Text>
                        <Text style={styles.welcomeText}>
                            Choose a category below to manage settings
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <StatsCard
                            title="किसान"
                            icon="👨‍🌾"
                            total={stats?.farmers.total || 0}
                            pending={stats?.farmers.pending || 0}
                            active={stats?.farmers.active || 0}
                            gradient={['#10B981', '#059669']}
                        />
                        <StatsCard
                            title="दुकानदार"
                            icon="🏪"
                            total={stats?.retailers.total || 0}
                            pending={stats?.retailers.pending || 0}
                            active={stats?.retailers.active || 0}
                            gradient={['#F59E0B', '#D97706']}
                        />
                    </View>

                    {/* Category Cards */}
                    <Text style={styles.sectionTitle}>Settings Categories</Text>

                    <CategoryCard
                        icon={<MaterialCommunityIcons name="earth" size={32} color={COLORS.white} />}
                        title="Global Settings"
                        subtitle="वेबसाइट सेटिंग्स"
                        description="Brand, Pricing, Advisory Tips"
                        gradient={['#3B82F6', '#2563EB']}
                        onPress={onNavigateToGlobal}
                    />

                    <CategoryCard
                        icon="👨‍🌾"
                        title="Farmer Settings"
                        subtitle="किसान सेटिंग्स"
                        description="Seasonal Allotments, Approvals"
                        gradient={['#10B981', '#059669']}
                        onPress={onNavigateToFarmers}
                        badge={stats?.farmers.pending}
                    />

                    <CategoryCard
                        icon="🏪"
                        title="Retailer Settings"
                        subtitle="दुकानदार सेटिंग्स"
                        description="Retailer Approvals, Management"
                        gradient={['#F59E0B', '#D97706']}
                        onPress={onNavigateToRetailers}
                        badge={stats?.retailers.pending}
                    />
                </Animated.View>
            </ScrollView>
        </View>
    );
}

// Stats Card Component
interface StatsCardProps {
    title: string;
    icon: string;
    total: number;
    pending: number;
    active: number;
    gradient: string[];
}

const StatsCard: React.FC<StatsCardProps> = ({ title, icon, total, pending, active, gradient }) => (
    <View style={styles.statsCardWrapper}>
        <LinearGradient
            colors={gradient as [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsCard}
        >
            <Text style={styles.statsIcon}>{icon}</Text>
            <Text style={styles.statsTitle}>{title}</Text>
            <Text style={styles.statsTotal}>{total}</Text>
            <View style={styles.statsDetails}>
                <Text style={styles.statsDetailText}>⏳ {pending}</Text>
                <Text style={styles.statsDetailText}>✅ {active}</Text>
            </View>
        </LinearGradient>
    </View>
);

// Category Card Component
interface CategoryCardProps {
    icon: string | React.ReactNode;
    title: string;
    subtitle: string;
    description: string;
    gradient: string[];
    onPress: () => void;
    badge?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, subtitle, description, gradient, onPress, badge }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <View style={styles.categoryCard}>
            <LinearGradient
                colors={gradient as unknown as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.categoryGradient}
            >
                <View style={styles.categoryIconContainer}>
                    {typeof icon === 'string' ? (
                        <Text style={styles.categoryIcon}>{icon}</Text>
                    ) : (
                        icon
                    )}
                </View>
                <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>{title}</Text>
                    <Text style={styles.categorySubtitle}>{subtitle}</Text>
                    <Text style={styles.categoryDescription}>{description}</Text>
                </View>
                <View style={styles.categoryArrow}>
                    <MaterialIcons name="arrow-forward" size={24} color={COLORS.white} />
                </View>
                {badge !== undefined && badge > 0 && (
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>{badge}</Text>
                    </View>
                )}
            </LinearGradient>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    backButtonContainer: {
        position: 'absolute',
        top: SPACING.xl,
        left: SPACING.md,
        zIndex: 10,
    },
    backButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: 20,
        ...SHADOWS.medium,
    },
    backButtonText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.primary,
    },
    header: {
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        ...SHADOWS.large,
    },
    headerIcon: {
        fontSize: 40,
        marginRight: SPACING.md,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    welcomeCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.medium,
    },
    welcomeTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    welcomeText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
        gap: SPACING.md,
    },
    statsCardWrapper: {
        flex: 1,
    },
    statsCard: {
        borderRadius: 16,
        padding: SPACING.lg,
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    statsIcon: {
        fontSize: 40,
        marginBottom: SPACING.xs,
    },
    statsTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.white,
        marginBottom: SPACING.xs,
    },
    statsTotal: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: SPACING.sm,
    },
    statsDetails: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    statsDetailText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.medium,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    categoryCard: {
        marginBottom: SPACING.md,
        borderRadius: 16,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    categoryGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        position: 'relative',
    },
    categoryIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    categoryIcon: {
        fontSize: 32,
    },
    categoryContent: {
        flex: 1,
        paddingRight: SPACING.md,
    },
    categoryTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
        marginBottom: 2,
    },
    categorySubtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
        marginBottom: SPACING.xs,
    },
    categoryDescription: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        opacity: 0.8,
    },
    categoryArrow: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
        textAlign: 'center',
        textAlignVertical: 'center',
        includeFontPadding: false,
        lineHeight: 22,
    },
    categoryBadge: {
        position: 'absolute',
        top: SPACING.sm,
        right: SPACING.sm,
        backgroundColor: COLORS.danger,
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xs,
        ...SHADOWS.small,
    },
    categoryBadgeText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.bold,
    },
});

import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS, BORDER_RADIUS } from '../../constants';
import { useSettings } from '../../contexts/SettingsContext';
import BackButton from '../../components/BackButton';
import AppContentCard from './AppContentCard';
import BrandSettingsCard from './BrandSettingsCard';
import PricingCard from './PricingCard';

interface GlobalSettingsScreenProps {
    onBack: () => void;
}

type SettingsView = 'main' | 'app-content' | 'brand' | 'pricing';

const HEADER_HEIGHT = 140;

export default function GlobalSettingsScreen({ onBack }: GlobalSettingsScreenProps) {
    const { refreshSettings } = useSettings();
    const [refreshing, setRefreshing] = useState(false);
    const [currentView, setCurrentView] = useState<SettingsView>('main');
    const scrollY = useRef(new Animated.Value(0)).current;

    const headerTranslateY = scrollY.interpolate({
        inputRange: [0, HEADER_HEIGHT],
        outputRange: [0, -HEADER_HEIGHT],
        extrapolate: 'clamp',
    });

    const onRefresh = async () => {
        setRefreshing(true);
        await refreshSettings();
        setRefreshing(false);
    };

    const handleBackToMain = () => {
        setCurrentView('main');
    };

    const renderMainNavigation = () => (
        <View style={styles.navigationContainer}>
            {/* App Content Management */}
            <TouchableOpacity
                style={styles.navCard}
                onPress={() => setCurrentView('app-content')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#8B5CF6', '#7C3AED']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.navCardGradient}
                >
                    <View style={styles.navCardIcon}>
                        <MaterialCommunityIcons name="file-document-edit" size={48} color={COLORS.white} />
                    </View>
                    <View style={styles.navCardContent}>
                        <Text style={styles.navCardTitle}>📄 App Content Management</Text>
                        <Text style={styles.navCardSubtitle}>ऐप विषय-सामग्री प्रबंधन</Text>
                        <Text style={styles.navCardDescription}>
                            Headers, labels, helpline, और notices manage करें
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                </LinearGradient>
            </TouchableOpacity>

            {/* Brand Settings */}
            <TouchableOpacity
                style={styles.navCard}
                onPress={() => setCurrentView('brand')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#3B82F6', '#2563EB']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.navCardGradient}
                >
                    <View style={styles.navCardIcon}>
                        <MaterialCommunityIcons name="palette" size={48} color={COLORS.white} />
                    </View>
                    <View style={styles.navCardContent}>
                        <Text style={styles.navCardTitle}>🎨 Brand Settings</Text>
                        <Text style={styles.navCardSubtitle}>ब्रांड सेटिंग्स</Text>
                        <Text style={styles.navCardDescription}>
                            App name, logo, और branding customize करें
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                </LinearGradient>
            </TouchableOpacity>

            {/* Pricing Settings */}
            <TouchableOpacity
                style={styles.navCard}
                onPress={() => setCurrentView('pricing')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#10B981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.navCardGradient}
                >
                    <View style={styles.navCardIcon}>
                        <MaterialCommunityIcons name="currency-inr" size={48} color={COLORS.white} />
                    </View>
                    <View style={styles.navCardContent}>
                        <Text style={styles.navCardTitle}>💰 मूल्य Settings</Text>
                        <Text style={styles.navCardSubtitle}>Pricing Settings</Text>
                        <Text style={styles.navCardDescription}>
                            खाद की कीमतें manage करें
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={32} color={COLORS.white} />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderDetailView = () => {
        switch (currentView) {
            case 'app-content':
                return (
                    <View>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                            <Text style={styles.backButtonText}>Back to Settings</Text>
                        </TouchableOpacity>
                        <AppContentCard />
                    </View>
                );
            case 'brand':
                return (
                    <View>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                            <Text style={styles.backButtonText}>Back to Settings</Text>
                        </TouchableOpacity>
                        <BrandSettingsCard />
                    </View>
                );
            case 'pricing':
                return (
                    <View>
                        <TouchableOpacity style={styles.backButton} onPress={handleBackToMain}>
                            <MaterialCommunityIcons name="arrow-left" size={24} color={COLORS.primary} />
                            <Text style={styles.backButtonText}>Back to Settings</Text>
                        </TouchableOpacity>
                        <PricingCard />
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
                    { transform: [{ translateY: headerTranslateY }] }
                ]}
            >
                <LinearGradient
                    colors={GRADIENTS.blue as unknown as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <SafeAreaView>
                        <View style={styles.headerContent}>
                            <MaterialCommunityIcons name="earth" size={32} color={COLORS.white} />
                            <View>
                                <Text style={styles.headerTitle}>Global Settings</Text>
                                <Text style={styles.headerSubtitle}>वैश्विक सेटिंग्स</Text>
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
                <View style={{ paddingTop: HEADER_HEIGHT }}>
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
});

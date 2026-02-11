import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, RefreshControl, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS } from '../../constants';
import { useSettings } from '../../contexts/SettingsContext';
import BackButton from '../../components/BackButton';
import BrandSettingsCard from './BrandSettingsCard';
import PricingCard from './PricingCard';
import AdvisoryCard from './AdvisoryCard';

interface GlobalSettingsScreenProps {
    onBack: () => void;
}

const HEADER_HEIGHT = 100;

export default function GlobalSettingsScreen({ onBack }: GlobalSettingsScreenProps) {
    const { refreshSettings } = useSettings();
    const [refreshing, setRefreshing] = useState(false);
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
                    <BrandSettingsCard />
                    <PricingCard />
                    <AdvisoryCard />
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
        color: COLORS.white,
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
        paddingHorizontal: SPACING.lg,
        paddingBottom: 100, // Extra padding for scrolling
    },
});

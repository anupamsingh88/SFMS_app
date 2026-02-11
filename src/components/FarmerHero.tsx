import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '../constants';

const { width } = Dimensions.get('window');

interface FarmerHeroProps {
    name: string;
    subtitle?: string;
}

export default function FarmerHero({ name, subtitle }: FarmerHeroProps) {
    return (
        <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                {/* Farmer Avatar */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={[COLORS.white, COLORS.backgroundLight] as readonly [string, string, ...string[]]}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarEmoji}>👨‍🌾</Text>
                    </LinearGradient>
                </View>

                {/* Greeting Text */}
                <View style={styles.textContainer}>
                    <Text style={styles.greeting}>नमस्ते 🙏</Text>
                    <Text style={styles.name}>{name}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>

                {/* Decorative Farm Elements */}
                <View style={styles.decorContainer}>
                    <Text style={styles.decorEmoji}>🌾</Text>
                </View>
            </View>

            {/* Background Pattern */}
            <View style={styles.pattern}>
                <View style={[styles.circle, styles.circle1]} />
                <View style={[styles.circle, styles.circle2]} />
                <View style={[styles.circle, styles.circle3]} />
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        borderBottomLeftRadius: BORDER_RADIUS.xl,
        borderBottomRightRadius: BORDER_RADIUS.xl,
        overflow: 'hidden',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    avatarContainer: {
        marginRight: SPACING.md,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarEmoji: {
        fontSize: 36,
    },
    textContainer: {
        flex: 1,
    },
    greeting: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.9,
        fontWeight: FONT_WEIGHTS.medium,
    },
    name: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
        marginTop: 2,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.white,
        opacity: 0.85,
        marginTop: 2,
    },
    decorContainer: {
        marginLeft: SPACING.sm,
    },
    decorEmoji: {
        fontSize: 32,
        opacity: 0.6,
    },
    // Background pattern
    pattern: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    circle: {
        position: 'absolute',
        borderRadius: 999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 120,
        height: 120,
        top: -40,
        right: -20,
    },
    circle2: {
        width: 80,
        height: 80,
        bottom: -30,
        left: 40,
    },
    circle3: {
        width: 60,
        height: 60,
        top: 60,
        right: width * 0.3,
    },
});

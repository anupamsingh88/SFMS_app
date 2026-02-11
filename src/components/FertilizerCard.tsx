import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface FertilizerCardProps {
    id: string;
    name: string;
    nameHindi: string;
    type: 'urea' | 'dap' | 'npk' | 'mop';
    price: number;
    availableQuantity: number;
    onPress: () => void;
}

const FERTILIZER_COLORS = {
    urea: { bg: COLORS.ureaBlue, light: '#DBEAFE', emoji: '(N)' },
    dap: { bg: COLORS.dapRed, light: '#FEE2E2', emoji: '(P)' },
    npk: { bg: COLORS.npkYellow, light: '#FEF3C7', emoji: '' },
    mop: { bg: COLORS.mopBrown, light: '#FED7AA', emoji: '(K)' },
};

export default function FertilizerCard({
    name,
    nameHindi,
    type,
    price,
    availableQuantity,
    onPress,
}: FertilizerCardProps) {
    const colors = FERTILIZER_COLORS[type];
    const isAvailable = availableQuantity > 0;

    return (
        <TouchableOpacity
            style={[styles.container, !isAvailable && styles.disabledContainer]}
            onPress={isAvailable ? onPress : undefined}
            activeOpacity={0.7}
            disabled={!isAvailable}
        >
            <LinearGradient
                colors={[colors.light, COLORS.white] as readonly [string, string, ...string[]]}
                style={styles.gradient}
            >
                {/* Header with Badge */}
                <View style={styles.header}>
                    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
                        <Text style={styles.badgeText}>{name}</Text>
                        {colors.emoji && <Text style={styles.badgeEmoji}>{colors.emoji}</Text>}
                    </View>
                </View>

                {/* Hindi Name */}
                <Text style={styles.hindiName}>{nameHindi}</Text>

                {/* Price */}
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>कीमत:</Text>
                    <Text style={styles.price}>₹{price}</Text>
                    <Text style={styles.perBag}>/बोरी</Text>
                </View>

                {/* Availability */}
                <View style={styles.footer}>
                    {isAvailable ? (
                        <>
                            <Text style={styles.availabilityText}>
                                ✅ {availableQuantity} बोरी उपलब्ध
                            </Text>
                            <View style={styles.arrow}>
                                <Text style={styles.arrowText}>›</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.unavailableText}>❌ कोटा समाप्त</Text>
                    )}
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '48%',
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        overflow: 'hidden',
        ...SHADOWS.medium,
    },
    disabledContainer: {
        opacity: 0.6,
    },
    gradient: {
        padding: SPACING.md,
    },
    header: {
        marginBottom: SPACING.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
        gap: 4,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
        textTransform: 'uppercase',
    },
    badgeEmoji: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
    },
    hindiName: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textPrimary,
        fontWeight: FONT_WEIGHTS.bold,
        marginBottom: SPACING.sm,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: SPACING.md,
    },
    priceLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginRight: 4,
    },
    price: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.bold,
    },
    perBag: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginLeft: 2,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    availabilityText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.success,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    unavailableText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.error,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    arrow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 20,
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
    },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';

interface UsageStatsProps {
    used: number;
    remaining: number;
    total: number;
    unit?: string;
}

export default function UsageStats({ used, remaining, total, unit = 'kg' }: UsageStatsProps) {
    const usedPercentage = total > 0 ? Math.round((used / total) * 100) : 0;
    const remainingPercentage = total > 0 ? Math.round((remaining / total) * 100) : 0;

    return (
        <View style={styles.container}>
            {/* Progress Bar with Percentage */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>📊 उपयोग प्रगति</Text>
                    <Text style={styles.progressPercentage}>{usedPercentage}%</Text>
                </View>
                <View style={styles.progressTrack}>
                    <LinearGradient
                        colors={[COLORS.success, '#34D399'] as readonly [string, string, ...string[]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${usedPercentage}%` }]}
                    />
                </View>
                <View style={styles.progressFooter}>
                    <Text style={styles.progressSubtext}>उपयोग: {used} / {total} {unit}</Text>
                    <Text style={styles.progressSubtext}>शेष: {remaining} {unit}</Text>
                </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsRow}>
                {/* Used */}
                <View style={[styles.statCard, styles.usedCard]}>
                    <Text style={styles.statLabel}>📊 उपयोग</Text>
                    <Text style={styles.statValue}>{used}</Text>
                    <Text style={styles.statUnit}>{unit}</Text>
                </View>

                {/* Remaining */}
                <View style={[styles.statCard, styles.remainingCard]}>
                    <Text style={styles.statLabel}>✅ शेष</Text>
                    <Text style={[styles.statValue, styles.remainingValue]}>{remaining}</Text>
                    <Text style={styles.statUnit}>{unit}</Text>
                </View>

                {/* Total */}
                <View style={[styles.statCard, styles.totalCard]}>
                    <Text style={styles.statLabel}>📦 कुल</Text>
                    <Text style={styles.statValue}>{total}</Text>
                    <Text style={styles.statUnit}>{unit}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    progressContainer: {
        marginBottom: SPACING.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    progressLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    progressPercentage: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.success,
        fontWeight: FONT_WEIGHTS.bold,
    },
    progressTrack: {
        height: 16,
        backgroundColor: COLORS.grayLight,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: BORDER_RADIUS.md,
    },
    progressFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xs,
    },
    progressSubtext: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        fontWeight: FONT_WEIGHTS.medium,
    },
    statsRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    statCard: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 2,
        alignItems: 'center',
    },
    usedCard: {
        backgroundColor: '#FEF3C7',
        borderColor: '#FCD34D',
    },
    remainingCard: {
        backgroundColor: '#D1FAE5',
        borderColor: '#34D399',
    },
    totalCard: {
        backgroundColor: '#E0E7FF',
        borderColor: '#A5B4FC',
    },
    statLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginBottom: 4,
        fontWeight: FONT_WEIGHTS.medium,
    },
    statValue: {
        fontSize: FONT_SIZES.xl,
        color: COLORS.textPrimary,
        fontWeight: FONT_WEIGHTS.bold,
    },
    statUnit: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
        fontWeight: FONT_WEIGHTS.medium,
    },
    remainingValue: {
        color: COLORS.success,
    },
});


import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';

export default function MarketScreen() {
    const fertilizerRates = [
        {
            id: '1',
            name: 'Urea',
            nameHindi: 'यूरिया',
            type: 'urea' as const,
            color: '#3B82F6',
            emoji: '(N)',
            todayPrice: 280,
            yesterdayPrice: 285,
            trend: 'down',
            stock: 'उपलब्ध',
        },
        {
            id: '2',
            name: 'DAP',
            nameHindi: 'डी.ए.पी.',
            type: 'dap' as const,
            color: '#DC2626',
            emoji: '(P)',
            todayPrice: 1350,
            yesterdayPrice: 1340,
            trend: 'up',
            stock: 'उपलब्ध',
        },
        {
            id: '3',
            name: 'NPK',
            nameHindi: 'एन.पी.के.',
            type: 'npk' as const,
            color: '#FBBF24',
            emoji: '',
            todayPrice: 720,
            yesterdayPrice: 720,
            trend: 'stable',
            stock: 'सीमित',
        },
        {
            id: '4',
            name: 'MOP',
            nameHindi: 'एम.ओ.पी.',
            type: 'mop' as const,
            color: '#92400E',
            emoji: '(K)',
            todayPrice: 950,
            yesterdayPrice: 960,
            trend: 'down',
            stock: 'उपलब्ध',
        },
    ];

    const getTrendIcon = (trend: string) => {
        if (trend === 'up') return '📈';
        if (trend === 'down') return '📉';
        return '➡️';
    };

    const getTrendColor = (trend: string) => {
        if (trend === 'up') return COLORS.error;
        if (trend === 'down') return COLORS.success;
        return COLORS.textSecondary;
    };

    const getPriceChange = (today: number, yesterday: number) => {
        const change = today - yesterday;
        if (change === 0) return 'कोई बदलाव नहीं';
        const sign = change > 0 ? '+' : '';
        return `${sign}₹${change}`;
    };

    return (
        <View style={styles.container}>
            {/* Content */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Update Notice */}
                <View style={styles.noticeCard}>
                    <Text style={styles.noticeIcon}>🕒</Text>
                    <View style={styles.noticeContent}>
                        <Text style={styles.noticeText}>आज का अपडेट: सुबह 9:00 बजे</Text>
                        <Text style={styles.noticeSubtext}>
                            दरें दिन में 2 बार अपडेट होती हैं
                        </Text>
                    </View>
                </View>

                {/* Market Rates */}
                {fertilizerRates.map((fertilizer) => (
                    <View key={fertilizer.id} style={styles.rateCard}>
                        <View style={styles.rateHeader}>
                            <View style={[styles.badge, { backgroundColor: fertilizer.color }]}>
                                <Text style={styles.badgeText}>
                                    {fertilizer.name} {fertilizer.emoji}
                                </Text>
                            </View>
                            <View style={[styles.stockBadge, {
                                backgroundColor: fertilizer.stock === 'उपलब्ध' ? '#D1FAE5' : '#FEF3C7'
                            }]}>
                                <Text style={[styles.stockText, {
                                    color: fertilizer.stock === 'उपलब्ध' ? '#059669' : '#F59E0B'
                                }]}>
                                    {fertilizer.stock}
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.fertilizerName}>{fertilizer.nameHindi}</Text>

                        <View style={styles.priceRow}>
                            <View style={styles.priceMain}>
                                <Text style={styles.priceLabel}>आज की कीमत</Text>
                                <Text style={styles.priceValue}>₹{fertilizer.todayPrice}</Text>
                            </View>

                            <View style={styles.trendContainer}>
                                <Text style={styles.trendIcon}>
                                    {getTrendIcon(fertilizer.trend)}
                                </Text>
                                <Text style={[styles.trendText, { color: getTrendColor(fertilizer.trend) }]}>
                                    {getPriceChange(fertilizer.todayPrice, fertilizer.yesterdayPrice)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.yesterdayPrice}>
                            <Text style={styles.yesterdayLabel}>कल की कीमत:</Text>
                            <Text style={styles.yesterdayValue}>₹{fertilizer.yesterdayPrice}</Text>
                        </View>
                    </View>
                ))}

                {/* Tips Card */}
                <View style={styles.tipsCard}>
                    <Text style={styles.tipsTitle}>💡 बाज़ार सलाह</Text>
                    <View style={styles.tipsList}>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                सीजन शुरू होने से पहले खरीदें
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                सरकारी दुकान से ही खरीदें
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                नकली उर्वरक से सावधान रहें
                            </Text>
                        </View>
                        <View style={styles.tipItem}>
                            <Text style={styles.tipBullet}>•</Text>
                            <Text style={styles.tipText}>
                                बिल जरूर लें और सुरक्षित रखें
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingTop: SPACING.md,
    },
    noticeCard: {
        flexDirection: 'row',
        backgroundColor: '#E0F2FE',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.lg,
        alignItems: 'center',
        gap: SPACING.md,
    },
    noticeIcon: {
        fontSize: 24,
    },
    noticeContent: {
        flex: 1,
    },
    noticeText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: '#0369A1',
        marginBottom: 2,
    },
    noticeSubtext: {
        fontSize: FONT_SIZES.sm,
        color: '#0284C7',
    },
    rateCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.medium,
    },
    rateHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    badgeText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    stockBadge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs / 2,
        borderRadius: BORDER_RADIUS.sm,
    },
    stockText: {
        fontSize: FONT_SIZES.xs,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    fertilizerName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    priceMain: {},
    priceLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    trendContainer: {
        alignItems: 'center',
    },
    trendIcon: {
        fontSize: 24,
        marginBottom: 2,
    },
    trendText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    yesterdayPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    yesterdayLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    yesterdayValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textSecondary,
    },
    tipsCard: {
        backgroundColor: '#FFF9E6',
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginTop: SPACING.md,
        marginBottom: SPACING.lg,
        borderWidth: 2,
        borderColor: '#FCD34D',
    },
    tipsTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    tipsList: {
        gap: SPACING.sm,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: SPACING.sm,
    },
    tipBullet: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    tipText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        lineHeight: 24,
    },
});

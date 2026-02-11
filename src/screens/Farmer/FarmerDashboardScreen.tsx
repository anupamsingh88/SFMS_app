import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card, Button } from '../../components';
import LogoPlaceholder from '../../components/LogoPlaceholder';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
    BORDER_RADIUS,
    SHADOWS,
} from '../../constants';
import { Fertilizer, FertilizerQuota } from '../../types';

interface FarmerDashboardScreenProps {
    farmerName: string;
    fertilizers: (Fertilizer & { quota: FertilizerQuota })[];
    onBookSlot: (fertilizerId: string) => void;
    onLogout: () => void;
}

export default function FarmerDashboardScreen({
    farmerName,
    fertilizers,
    onBookSlot,
    onLogout,
}: FarmerDashboardScreenProps) {
    return (
        <LinearGradient
            colors={[COLORS.backgroundLight, COLORS.background]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <LogoPlaceholder size={50} />
                        <View>
                            <Text style={styles.greeting}>नमस्ते 🙏</Text>
                            <Text style={styles.userName}>{farmerName}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={onLogout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>लॉगआउट</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.sectionTitle}>
                        🌾 उपलब्ध उर्वरक
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        अपनी जरूरत का उर्वरक चुनें और स्लॉट बुक करें
                    </Text>

                    {fertilizers.map((fertilizer) => (
                        <Card key={fertilizer.id} style={styles.fertilizerCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardIcon}>
                                    <Text style={styles.iconText}>🌱</Text>
                                </View>
                                <View style={styles.cardTitle}>
                                    <Text style={styles.fertilizerName}>
                                        {fertilizer.nameHindi}
                                    </Text>
                                    <Text style={styles.fertilizerNameEn}>
                                        {fertilizer.name}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{HINDI_TEXT.pricePerBag}:</Text>
                                <Text style={styles.infoValue}>
                                    {HINDI_TEXT.rupees}{fertilizer.pricePerBag}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{HINDI_TEXT.allowedQuantity}:</Text>
                                <Text style={styles.infoValue}>
                                    {fertilizer.quota.allowedQuantity} {HINDI_TEXT.bags}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>{HINDI_TEXT.remainingQuota}:</Text>
                                <Text style={[styles.infoValue, styles.quotaValue]}>
                                    {fertilizer.quota.remainingQuantity} {HINDI_TEXT.bags}
                                </Text>
                            </View>

                            {fertilizer.quota.remainingQuantity > 0 ? (
                                <Button
                                    title={HINDI_TEXT.bookSlot}
                                    onPress={() => onBookSlot(fertilizer.id)}
                                    size="medium"
                                    style={styles.bookButton}
                                />
                            ) : (
                                <View style={styles.quotaExhaustedContainer}>
                                    <Text style={styles.quotaExhaustedText}>
                                        ❌ कोटा समाप्त
                                    </Text>
                                </View>
                            )}
                        </Card>
                    ))}

                    {fertilizers.length === 0 && (
                        <Card style={styles.emptyCard}>
                            <Text style={styles.emptyText}>
                                ℹ️ फिलहाल कोई उर्वरक उपलब्ध नहीं है
                            </Text>
                        </Card>
                    )}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
        ...SHADOWS.small,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    greeting: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    userName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    logoutButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        backgroundColor: COLORS.danger,
        borderRadius: BORDER_RADIUS.md,
    },
    logoutText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.white,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    sectionSubtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
    },
    fertilizerCard: {
        marginBottom: SPACING.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    iconText: {
        fontSize: 32,
    },
    cardTitle: {
        flex: 1,
    },
    fertilizerName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    fertilizerNameEn: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.grayLight,
        marginVertical: SPACING.md,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.sm,
    },
    infoLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    infoValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
    },
    quotaValue: {
        color: COLORS.success,
    },
    bookButton: {
        marginTop: SPACING.lg,
    },
    quotaExhaustedContainer: {
        marginTop: SPACING.lg,
        padding: SPACING.md,
        backgroundColor: COLORS.danger + '20',
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    quotaExhaustedText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.danger,
    },
    emptyCard: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
});

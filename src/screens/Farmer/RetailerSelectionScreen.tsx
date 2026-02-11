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
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
    BORDER_RADIUS,
    SHADOWS,
} from '../../constants';
import { Retailer } from '../../types';

interface RetailerSelectionScreenProps {
    retailers: Retailer[];
    onSelectRetailer: (retailerId: string) => void;
    onBack: () => void;
    embedded?: boolean; // New prop
}

export default function RetailerSelectionScreen({
    retailers,
    onSelectRetailer,
    onBack,
    embedded = false,
}: RetailerSelectionScreenProps) {
    return (
        <View style={styles.container}>
            {/* Header - Always show but conditionally show back button */}
            <View style={embedded ? styles.embeddedHeader : styles.header}>
                {!embedded ? (
                    <TouchableOpacity onPress={onBack} style={styles.headerBackButton}>
                        <Text style={styles.headerBackIcon}>{'<'}</Text>
                    </TouchableOpacity>
                ) : null}
                <View>
                    <Text style={styles.title}>🏪 {HINDI_TEXT.selectRetailer}</Text>
                    <Text style={styles.subtitle}>अपने नजदीकी दुकान को चुनें</Text>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Retailer List */}
                {retailers.map((retailer) => (
                    <TouchableOpacity
                        key={retailer.id}
                        onPress={() => onSelectRetailer(retailer.id)}
                        activeOpacity={0.7}
                    >
                        <Card style={styles.retailerCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.icon}>🏪</Text>
                                </View>
                                <View style={styles.cardContent}>
                                    <Text style={styles.shopName}>{retailer.shopName}</Text>
                                    <Text style={styles.ownerName}>
                                        दुकानदार: {retailer.name}
                                    </Text>
                                    <Text style={styles.address}>📍 {retailer.address}</Text>
                                    {retailer.location && (
                                        <Text style={styles.distance}>
                                            📏 लगभग 2 किमी दूर
                                        </Text>
                                    )}
                                </View>
                                <View style={styles.arrow}>
                                    <Text style={styles.arrowText}>›</Text>
                                </View>
                            </View>
                        </Card>
                    </TouchableOpacity>
                ))}

                {retailers.length === 0 && (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>
                            ℹ️ आपके क्षेत्र में कोई दुकान उपलब्ध नहीं है
                        </Text>
                        <Text style={styles.emptySubtext}>
                            कृपया बाद में पुनः प्रयास करें
                        </Text>
                    </Card>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Fallback background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingBottom: SPACING.sm,
    },
    headerBackButton: {
        marginRight: SPACING.md,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.small,
    },
    embeddedHeader: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.md,
        backgroundColor: COLORS.white,
    },
    headerBackIcon: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginTop: -2, // Optical alignment
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    scrollContent: {
        padding: SPACING.lg,
    },
    retailerCard: {
        marginBottom: SPACING.lg,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.secondaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    icon: {
        fontSize: 32,
    },
    cardContent: {
        flex: 1,
    },
    shopName: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    ownerName: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    address: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    distance: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.info,
    },
    arrow: {
        marginLeft: SPACING.md,
    },
    arrowText: {
        fontSize: 32,
        color: COLORS.primary,
    },
    emptyCard: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    emptySubtext: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    backButton: {
        marginTop: SPACING.lg,
    },
});

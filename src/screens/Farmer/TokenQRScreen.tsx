import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
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
import { Booking } from '../../types';

interface TokenQRScreenProps {
    booking: Booking;
    onBackToDashboard: () => void;
    onSaveQR?: () => void;
}

export default function TokenQRScreen({
    booking,
    onBackToDashboard,
    onSaveQR,
}: TokenQRScreenProps) {
    const qrRef = useRef<any>();

    const handleShare = () => {
        // In a real app, implement share functionality
        Alert.alert(
            'शेयर करें',
            'QR कोड शेयर करने की सुविधा जल्द ही उपलब्ध होगी',
            [{ text: 'ठीक है', style: 'default' }]
        );
    };

    const handleSave = () => {
        if (onSaveQR) {
            onSaveQR();
        } else {
            Alert.alert(
                'सफलता',
                'QR कोड आपकी डिवाइस में सेव हो गया है',
                [{ text: 'ठीक है', style: 'default' }]
            );
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('hi-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const formatTime = (time: string) => {
        return time;
    };

    return (
        <LinearGradient
            colors={[COLORS.backgroundLight, COLORS.background]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Success Header */}
                    <View style={styles.header}>
                        <View style={styles.successIcon}>
                            <Text style={styles.successEmoji}>✅</Text>
                        </View>
                        <Text style={styles.title}>{HINDI_TEXT.bookingConfirmed}</Text>
                        <Text style={styles.subtitle}>
                            आपकी बुकिंग सफलतापूर्वक पूर्ण हो गई है
                        </Text>
                    </View>

                    {/* Token Number */}
                    <Card style={styles.tokenCard}>
                        <Text style={styles.tokenLabel}>आपका टोकन नंबर</Text>
                        <Text style={styles.tokenNumber}>{booking.tokenNumber}</Text>
                        <Text style={styles.tokenHint}>
                            यह नंबर दुकानदार को दिखाएं
                        </Text>
                    </Card>

                    {/* QR Code */}
                    <Card style={styles.qrCard}>
                        <Text style={styles.qrLabel}>QR कोड</Text>
                        <View style={styles.qrContainer}>
                            <QRCode
                                value={booking.qrCode}
                                size={220}
                                color={COLORS.primary}
                                backgroundColor={COLORS.white}
                            />
                        </View>
                        <Text style={styles.qrHint}>
                            दुकान पर यह QR कोड स्कैन करवाएं
                        </Text>
                    </Card>

                    {/* Booking Details */}
                    <Card style={styles.detailsCard}>
                        <Text style={styles.detailsTitle}>बुकिंग का विवरण</Text>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>📅 तारीख:</Text>
                            <Text style={styles.detailValue}>
                                {formatDate(booking.bookingDate)}
                            </Text>
                        </View>

                        {booking.timeSlot ? (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>⏰ समय:</Text>
                                <Text style={styles.detailValue}>
                                    {formatTime(booking.timeSlot.startTime)} -{' '}
                                    {formatTime(booking.timeSlot.endTime)}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>⏰ स्लॉट:</Text>
                                <Text style={styles.detailValue}>
                                    पूरा दिन (Open Slot)
                                </Text>
                            </View>
                        )}

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>🌱 उर्वरक & मात्रा:</Text>
                            <View style={{ flex: 1 }}>
                                {booking.items.map((item, index) => (
                                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 }}>
                                        <Text style={styles.detailValue}>
                                            {item.nameHindi} ({item.quantity} बोरी)
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>💰 कुल मूल्य:</Text>
                            <Text style={[styles.detailValue, { color: COLORS.primary }]}>
                                ₹{booking.totalPrice}
                            </Text>
                        </View>

                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>🏪 दुकान:</Text>
                            <Text style={styles.detailValue}>
                                {booking.retailerId}
                            </Text>
                        </View>
                    </Card>

                    {/* Important Instructions */}
                    <Card style={[styles.instructionCard, styles.warningCard]}>
                        <Text style={styles.instructionTitle}>⚠️ महत्वपूर्ण निर्देश</Text>
                        <Text style={styles.instructionText}>
                            • निर्धारित समय पर ही दुकान पर पहुंचें
                        </Text>
                        <Text style={styles.instructionText}>
                            • अपना टोकन नंबर या QR कोड साथ रखें
                        </Text>
                        <Text style={styles.instructionText}>
                            • आधार कार्ड साथ लेकर आएं
                        </Text>
                        <Text style={styles.instructionText}>
                            • उर्वरक की रसीद जरूर लें
                        </Text>
                    </Card>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <Button
                            title={HINDI_TEXT.saveQR}
                            onPress={handleSave}
                            size="large"
                            variant="secondary"
                            style={styles.button}
                        />

                        <Button
                            title="शेयर करें 📤"
                            onPress={handleShare}
                            size="medium"
                            variant="outline"
                            style={styles.button}
                        />

                        <Button
                            title="डैशबोर्ड पर जाएं"
                            onPress={onBackToDashboard}
                            size="medium"
                            variant="outline"
                        />
                    </View>
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
    scrollContent: {
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    successIcon: {
        width: 100,
        height: 100,
        borderRadius: BORDER_RADIUS.round,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    successEmoji: {
        fontSize: 60,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.success,
        marginBottom: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    tokenCard: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
        backgroundColor: '#FFF3E0',
    },
    tokenLabel: {
        fontSize: FONT_SIZES.md,
        color: '#E65100',
        marginBottom: SPACING.sm,
    },
    tokenNumber: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: '#E65100',
        marginBottom: SPACING.sm,
        letterSpacing: 4,
    },
    tokenHint: {
        fontSize: FONT_SIZES.sm,
        color: '#F57C00',
        fontStyle: 'italic',
    },
    qrCard: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    qrLabel: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
    },
    qrContainer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.medium,
    },
    qrHint: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: SPACING.lg,
        fontStyle: 'italic',
        textAlign: 'center',
    },
    detailsCard: {
        marginBottom: SPACING.lg,
    },
    detailsTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
        paddingBottom: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
    },
    detailLabel: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        flex: 1,
    },
    detailValue: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        flex: 1,
        textAlign: 'right',
    },
    instructionCard: {
        marginBottom: SPACING.xl,
    },
    warningCard: {
        backgroundColor: '#FEF3C7',
    },
    instructionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    instructionText: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
        lineHeight: 24,
    },
    buttonContainer: {
        gap: SPACING.md,
    },
    button: {
        marginBottom: SPACING.sm,
    },
});

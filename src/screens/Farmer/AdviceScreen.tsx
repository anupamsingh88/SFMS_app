import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';

interface AdviceScreenProps {
    farmerName: string;
}

export default function AdviceScreen({ farmerName }: AdviceScreenProps) {

    const handleCallHelpline = () => {
        Linking.openURL('tel:18001801551'); // Kisan Call Center Number
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>💡 ऐप निर्देश और सहायता</Text>
                    <Text style={styles.headerSubtitle}>
                        ऐप का उपयोग कैसे करें
                    </Text>
                </View>

                {/* Instructions Steps */}
                <View style={styles.section}>
                    <View style={styles.stepCard}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>खाद अनुरोध (Retailer Selection)</Text>
                            <Text style={styles.stepResult}>
                                डैशबोर्ड पर "खाद अनुरोध" बटन पर क्लिक करें। अपने नजदीकी दुकानदार का चयन करें।
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>दिनांक और मात्रा चुनें</Text>
                            <Text style={styles.stepResult}>
                                अपनी सुविधानुसार तारीख चुनें और उपलब्ध स्टॉक में से खाद की मात्रा चुनें।
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>बुकिंग कन्फर्म करें</Text>
                            <Text style={styles.stepResult}>
                                विवरण की जाँच करें और "बुकिंग कन्फर्म करें" बटन दबाएं।
                            </Text>
                        </View>
                    </View>

                    <View style={styles.stepCard}>
                        <View style={styles.stepNumberContainer}>
                            <Text style={styles.stepNumber}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>टोकन और QR कोड प्राप्त करें</Text>
                            <Text style={styles.stepResult}>
                                आपको एक टोकन नंबर और QR कोड मिलेगा। इसे दुकानदार को दिखाएं और खाद प्राप्त करें।
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Helpline Section */}
                <TouchableOpacity onPress={handleCallHelpline} activeOpacity={0.9}>
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.helplineCard}
                    >
                        <View style={styles.helplineContent}>
                            <Text style={styles.helplineEmoji}>📞</Text>
                            <View>
                                <Text style={styles.helplineTitle}>किसान सहायता केंद्र</Text>
                                <Text style={styles.helplineNumber}>1800-180-1551</Text>
                                <Text style={styles.helplineSubtext}>
                                    किसी भी सहायता के लिए कॉल करें
                                </Text>
                            </View>
                        </View>
                        <View style={styles.callButton}>
                            <Text style={styles.callButtonText}>कॉल करें</Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Additional Info */}
                <View style={[styles.infoCard, { marginTop: SPACING.lg }]}>
                    <Text style={styles.infoTitle}>📢 महत्वपूर्ण सूचना</Text>
                    <Text style={styles.infoText}>
                        • खाद लेते समय अपना आधार कार्ड साथ रखें।
                    </Text>
                    <Text style={styles.infoText}>
                        • रसीद अवश्य लें।
                    </Text>
                    <Text style={styles.infoText}>
                        • टोकन केवल चयनित तिथि के लिए मान्य है।
                    </Text>
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
    },
    header: {
        marginBottom: SPACING.xl,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.xs,
    },
    headerSubtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: SPACING.xl,
    },
    stepCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        ...SHADOWS.small,
        alignItems: 'flex-start',
    },
    stepNumberContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
        marginTop: 2,
    },
    stepNumber: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    stepContent: {
        flex: 1,
    },
    stepTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    stepResult: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    helplineCard: {
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    helplineContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
    },
    helplineEmoji: {
        fontSize: 32,
    },
    helplineTitle: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: COLORS.white,
        opacity: 0.9,
    },
    helplineNumber: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.white,
    },
    helplineSubtext: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.white,
        opacity: 0.8,
    },
    callButton: {
        backgroundColor: COLORS.white,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.round,
    },
    callButtonText: {
        fontSize: FONT_SIZES.sm,
        fontWeight: 'bold',
        color: '#059669',
    },
    infoCard: {
        backgroundColor: '#FFF7ED', // Orange/Yellowish tint
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        borderWidth: 1,
        borderColor: '#FFEDD5',
    },
    infoTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: 'bold',
        color: '#C2410C',
        marginBottom: SPACING.sm,
    },
    infoText: {
        fontSize: FONT_SIZES.sm,
        color: '#9A3412',
        marginBottom: 4,
        lineHeight: 20,
    },
});

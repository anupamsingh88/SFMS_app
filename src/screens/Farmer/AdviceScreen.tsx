import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface AdviceScreenProps {
    farmerName: string;
}

interface AdvisoryTip {
    id: number;
    title: string;
    description: string;
}

interface AppContent {
    id: number;
    contentKey: string;
    contentValue: string;
    category: string;
    displayOrder: number;
}

interface AppInstructions {
    title: string;
    description: string;
}

export default function AdviceScreen({ farmerName }: AdviceScreenProps) {
    const [tips, setTips] = useState<AdvisoryTip[]>([]);
    const [content, setContent] = useState<Record<string, string>>({});
    const [instructions, setInstructions] = useState<AppInstructions[]>([]);
    const [notices, setNotices] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllContent();
    }, []);

    const fetchAllContent = async () => {
        try {
            setLoading(true);

            // Fetch app content
            const contentResponse = await fetch(API_ENDPOINTS.getAppContent);
            const contentResult = await contentResponse.json();

            // Fetch advisory tips
            const tipsResponse = await fetch(API_ENDPOINTS.getAdvisoryTips);
            const tipsResult = await tipsResponse.json();

            if (contentResult.success) {
                // Parse content into usable structure
                const contentMap: Record<string, string> = {};
                const noticesList: string[] = [];

                contentResult.data.forEach((item: AppContent) => {
                    contentMap[item.contentKey] = item.contentValue;

                    // Build notices
                    if (item.category === 'notices') {
                        noticesList.push(item.contentValue);
                    }
                });

                // Build instructions properly
                const finalInstructions: AppInstructions[] = [];
                for (let i = 1; i <= 4; i++) {
                    const title = contentMap[`app_step_${i}_title`];
                    const description = contentMap[`app_step_${i}_description`];
                    if (title && description) {
                        finalInstructions.push({ title, description });
                    }
                }

                setContent(contentMap);
                setInstructions(finalInstructions);
                setNotices(noticesList);
            }

            if (tipsResult.success) {
                setTips(tipsResult.data);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCallHelpline = () => {
        const number = content.helpline_number || '1800-180-1551';
        Linking.openURL(`tel:${number}`);
    };

    if (loading) {
        return (
            <View style={styles.loadingScreen}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>विषय-सामग्री लोड हो रही है...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header - Dynamic */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        {content.advice_screen_title || '💡 ऐप निर्देश और सहायता'}
                    </Text>
                    <Text style={styles.headerSubtitle}>
                        {content.advice_screen_subtitle || 'ऐप का उपयोग कैसे करें'}
                    </Text>
                </View>

                {/* Instructions - Dynamic */}
                <View style={styles.section}>
                    {instructions.map((instruction, index) => (
                        <View key={index} style={styles.stepCard}>
                            <View style={styles.stepNumberContainer}>
                                <Text style={styles.stepNumber}>{index + 1}</Text>
                            </View>
                            <View style={styles.stepContent}>
                                <Text style={styles.stepTitle}>{instruction.title}</Text>
                                <Text style={styles.stepResult}>{instruction.description}</Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Advisory Tips - Dynamic */}
                {tips.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            {content.farmer_advice_title || '🌾 किसान सलाह'}
                        </Text>
                        {tips.map((tip) => (
                            <View key={tip.id} style={styles.tipCard}>
                                <View style={styles.tipHeader}>
                                    <Text style={styles.tipEmoji}>💡</Text>
                                    <View style={styles.tipTextContainer}>
                                        <Text style={styles.tipTitle}>{tip.title}</Text>
                                        <Text style={styles.tipDescription}>{tip.description}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Helpline - Dynamic */}
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
                                <Text style={styles.helplineTitle}>
                                    {content.helpline_title || 'किसान सहायता केंद्र'}
                                </Text>
                                <Text style={styles.helplineNumber}>
                                    {content.helpline_number || '1800-180-1551'}
                                </Text>
                                <Text style={styles.helplineSubtext}>
                                    {content.helpline_description || 'किसी भी सहायता के लिए कॉल करें'}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.callButton}>
                            <Text style={styles.callButtonText}>
                                {content.helpline_button_text || 'कॉल करें'}
                            </Text>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Important Notices - Dynamic */}
                {notices.length > 0 && (
                    <View style={[styles.infoCard, { marginTop: SPACING.lg }]}>
                        <Text style={styles.infoTitle}>
                            {content.notices_title || '📢 महत्वपूर्ण सूचना'}
                        </Text>
                        {notices.map((notice, index) => (
                            <Text key={index} style={styles.infoText}>• {notice}</Text>
                        ))}
                    </View>
                )}

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingScreen: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
    },
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
    sectionTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: SPACING.xl,
    },
    tipCard: {
        backgroundColor: '#F0F9FF',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        ...SHADOWS.small,
    },
    tipHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    tipEmoji: {
        fontSize: 24,
        marginRight: SPACING.sm,
    },
    tipTextContainer: {
        flex: 1,
    },
    tipTitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    tipDescription: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        lineHeight: 20,
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
        backgroundColor: '#FFF7ED',
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

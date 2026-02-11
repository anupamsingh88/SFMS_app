import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../constants';
import ParticleBackground from '../components/ParticleBackground';
import LogoPlaceholder from '../components/LogoPlaceholder';

const { width } = Dimensions.get('window');

interface LandingScreenProps {
    onNavigate: (screen: 'FarmerRegistration' | 'FarmerLogin' | 'RetailerRegistration' | 'RetailerLogin') => void;
}

export default function LandingScreen({ onNavigate }: LandingScreenProps) {

    // Handler for Farmer Section
    const handleFarmerPress = () => {
        // For now, let's navigate to Registration as main action, 
        // or we could show a modal to choose login/register.
        // Based on user request "kissan ke liye pehle click kare fir click kare panjikarn",
        // it implies a sub-menu or a drill down.
        // Let's toggle a state or just navigate to an intermediate "FarmerHome" if we had one.
        // For simplicity and meeting the "click" requirement, let's assume this opens the specifics.
        // But since I need to hook into the existing onNavigate which takes specific screen names...
        // I will stick to the previous pattern but style it as a big "Farmer" block that expands or offers choices.

        // Actually, the user said "click wala krte like kissan ke liye pehle click kare fir click kare panjikarn".
        // This suggests: Landing -> [Farmer / PACS] -> [Register / Login]
        // Since I don't have a "FarmerHome" intermediate screen in the specific navigation types yet, 
        // I'll create a simple local state to show options OR just show them directly under the header.
    };

    const [role, setRole] = React.useState<'farmer' | 'retailer' | null>(null);

    return (
        <ParticleBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>

                    <View style={styles.header}>
                        <LogoPlaceholder size={150} />
                        <Text style={styles.title}>उत्तर प्रदेश राज्य उर्वरक प्रबंधन</Text>
                    </View>

                    <View style={styles.cardsContainer}>
                        {/* Farmer Card */}
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'farmer' && styles.activeCard,
                                { borderColor: COLORS.success }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setRole(role === 'farmer' ? null : 'farmer')}
                        >
                            <Text style={styles.roleEmoji}>👨‍🌾</Text>
                            <Text style={styles.roleTitle}>किसान (Farmer)</Text>

                            {role === 'farmer' && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: COLORS.success }]}
                                        onPress={() => onNavigate('FarmerRegistration')}
                                    >
                                        <Text style={styles.actionButtonText}>पंजीकरण (Register)</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
                                        // Assuming FarmerLogin exists or will be added. If not, maybe disable or alert.
                                        // onNavigate('FarmerLogin') 
                                        onPress={() => onNavigate('FarmerLogin')}
                                    >
                                        <Text style={styles.actionButtonText}>लॉगिन (Login)</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Retailer Card */}
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'retailer' && styles.activeCard,
                                { borderColor: COLORS.secondary }
                            ]}
                            activeOpacity={0.8}
                            onPress={() => setRole(role === 'retailer' ? null : 'retailer')}
                        >
                            <Text style={styles.roleEmoji}>🏪</Text>
                            <Text style={styles.roleTitle}>दुकानदार (PACS)</Text>

                            {role === 'retailer' && (
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
                                        onPress={() => onNavigate('RetailerRegistration')}
                                    >
                                        <Text style={styles.actionButtonText}>पंजीकरण (Register)</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
                                        onPress={() => onNavigate('RetailerLogin')}
                                    >
                                        <Text style={styles.actionButtonText}>लॉगिन (Login)</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>डिजिटल कृषि, समृद्ध किसान</Text>
                    </View>

                </View>
            </SafeAreaView>
        </ParticleBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: SPACING.lg,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
        color: COLORS.textPrimary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    sahkaritaText: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginTop: SPACING.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    cardsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: SPACING.lg,
    },
    roleCard: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        ...SHADOWS.medium,
    },
    activeCard: {
        backgroundColor: COLORS.backgroundLight,
        transform: [{ scale: 1.02 }],
        ...SHADOWS.large,
    },
    roleEmoji: {
        fontSize: 48,
        marginBottom: SPACING.sm,
    },
    roleTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    actionButtons: {
        width: '100%',
        marginTop: SPACING.md,
        gap: SPACING.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: SPACING.xs,
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.md,
    },
    footer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontStyle: 'italic',
    },
});

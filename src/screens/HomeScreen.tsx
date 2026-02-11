import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components';
import LogoPlaceholder from '../components/LogoPlaceholder';
import {
    COLORS,
    GRADIENTS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
} from '../constants';

interface HomeScreenProps {
    onNavigate: (screen: 'FarmerRegistration' | 'FarmerLogin' | 'RetailerRegistration' | 'RetailerLogin') => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
    return (
        <LinearGradient
            colors={[COLORS.backgroundLight, COLORS.background, COLORS.white]}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo and Header */}
                    <View style={styles.header}>
                        <LogoPlaceholder size={120} />
                        <Text style={styles.title}>उर्वरक वितरण प्रणाली</Text>
                        <Text style={styles.subtitle}>सहकारिता विभाग, उत्तर प्रदेश</Text>
                    </View>

                    {/* Main Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <Text style={styles.sectionTitle}>👨‍🌾 किसान के लिए</Text>

                        <Button
                            title={HINDI_TEXT.farmerRegistration}
                            onPress={() => onNavigate('FarmerRegistration')}
                            size="large"
                            variant="primary"
                            style={styles.button}
                        />

                        <Button
                            title={HINDI_TEXT.farmerLogin}
                            onPress={() => onNavigate('FarmerLogin')}
                            size="large"
                            variant="primary"
                            style={styles.button}
                        />

                        <View style={styles.divider} />

                        <Text style={styles.sectionTitle}>🏪 दुकानदार (PACS) के लिए</Text>

                        <Button
                            title={HINDI_TEXT.retailerRegistration}
                            onPress={() => onNavigate('RetailerRegistration')}
                            size="large"
                            variant="secondary"
                            style={styles.button}
                        />

                        <Button
                            title={HINDI_TEXT.retailerLogin}
                            onPress={() => onNavigate('RetailerLogin')}
                            size="large"
                            variant="secondary"
                            style={styles.button}
                        />
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            किसान सम्मान, समय बचाव, सुविधा प्रथम
                        </Text>
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
        flexGrow: 1,
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.medium,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    buttonContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        marginTop: SPACING.md,
    },
    button: {
        marginBottom: SPACING.lg,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.grayLight,
        marginVertical: SPACING.xl,
    },
    footer: {
        alignItems: 'center',
        marginTop: SPACING.xl,
        paddingTop: SPACING.lg,
    },
    footerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

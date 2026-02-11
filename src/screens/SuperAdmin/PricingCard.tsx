import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import { useSettings } from '../../contexts/SettingsContext';

const FERTILIZERS = [
    { key: 'urea_price', label: 'Urea', hindi: 'यूरिया', icon: '💧' },
    { key: 'dap_price', label: 'DAP', hindi: 'डीएपी', icon: '🔴' },
    { key: 'npk_price', label: 'NPK', hindi: 'एनपीके', icon: '🟡' },
    { key: 'mop_price', label: 'MOP', hindi: 'एमओपी', icon: '🟤' },
];

export default function PricingCard() {
    const { settings, refreshSettings } = useSettings();
    const [prices, setPrices] = useState({
        urea_price: settings?.urea_price || '280',
        dap_price: settings?.dap_price || '1350',
        npk_price: settings?.npk_price || '1200',
        mop_price: settings?.mop_price || '850',
    });
    const [loadingKey, setLoadingKey] = useState<string | null>(null);

    const updatePrice = async (key: string) => {
        const value = prices[key as keyof typeof prices];
        if (!value || isNaN(Number(value))) {
            Alert.alert('❌ त्रुटि', 'कृपया सही मूल्य दर्ज करें');
            return;
        }

        setLoadingKey(key);
        try {
            const payload = {
                setting_key: key,
                setting_value: value
            };

            const response = await fetch(API_ENDPOINTS.updateSetting, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                await refreshSettings();
                Alert.alert('✅ सफल', 'मूल्य अपडेट हो गया!');
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('❌ त्रुटि', 'मूल्य अपडेट नहीं हो सका। कृपया पुनः प्रयास करें।');
        } finally {
            setLoadingKey(null);
        }
    };

    const handlePriceChange = (key: string, value: string) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setPrices(prev => ({ ...prev, [key]: numericValue }));
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>💰 मूल्य सेटिंग्स</Text>
                <Text style={styles.subtitle}>प्रति बोरी मूल्य (50 किलो)</Text>
            </View>

            <View style={styles.pricesGrid}>
                {FERTILIZERS.map((fertilizer) => (
                    <View key={fertilizer.key} style={styles.priceItem}>
                        <View style={styles.priceHeader}>
                            <View style={styles.priceLabel}>
                                <Text style={styles.icon}>{fertilizer.icon}</Text>
                                <Text style={styles.fertilizerName}>{fertilizer.hindi}</Text>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.priceInput}
                                value={String(prices[fertilizer.key as keyof typeof prices] || '')}
                                onChangeText={(value) => handlePriceChange(fertilizer.key, value)}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                            <Text style={styles.perBagText}>/बोरी</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => updatePrice(fertilizer.key)}
                            disabled={loadingKey !== null}
                        >
                            <LinearGradient
                                colors={GRADIENTS.purple as unknown as [string, string, ...string[]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={[styles.saveButton, loadingKey !== null && styles.saveButtonDisabled]}
                            >
                                {loadingKey === fertilizer.key ? (
                                    <ActivityIndicator color={COLORS.white} size="small" />
                                ) : (
                                    <Text style={styles.saveButtonText}>💾 सेव करें</Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        ...SHADOWS.medium,
    },
    header: {
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    pricesGrid: {
        gap: SPACING.md,
    },
    priceItem: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    priceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    priceLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    icon: {
        fontSize: 20,
    },
    fertilizerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
        marginBottom: SPACING.sm,
    },
    currencySymbol: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginRight: SPACING.xs,
    },
    priceInput: {
        flex: 1,
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        padding: 0,
    },
    perBagText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginLeft: SPACING.xs,
    },
    saveButton: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: 8,
        alignItems: 'center',
        ...SHADOWS.small,
    },
    saveButtonDisabled: {
        opacity: 0.5,
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
    },
});

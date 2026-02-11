import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import { useSettings } from '../../contexts/SettingsContext';

export default function BrandSettingsCard() {
    const { settings, refreshSettings } = useSettings();
    const [heading, setHeading] = useState(settings?.app_heading || 'स्वागत है');
    const [tagline, setTagline] = useState(settings?.app_tagline || 'किसानों की सेवा में');
    const [loading, setLoading] = useState(false);

    const updateSetting = async (key: string, value: string) => {
        setLoading(true);
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
                Alert.alert('✅ सफल', `${key === 'app_heading' ? 'हेडिंग' : 'टैगलाइन'} अपडेट हो गई!`);
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('❌ त्रुटि', 'अपडेट नहीं हो सका। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>🎨 ब्रांड सेटिंग्स</Text>
                <Text style={styles.subtitle}>ऐप की हेडिंग और टैगलाइन बदलें</Text>
            </View>

            {/* App Heading */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>ऐप हेडिंग</Text>
                <TextInput
                    style={styles.input}
                    value={heading}
                    onChangeText={setHeading}
                    placeholder="मुख्य हेडिंग लिखें"
                    placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity
                    onPress={() => updateSetting('app_heading', heading)}
                    disabled={loading || heading === settings?.app_heading}
                >
                    <LinearGradient
                        colors={GRADIENTS.purple as unknown as [string, string, ...string[]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.saveButton,
                            (loading || heading === settings?.app_heading) && styles.saveButtonDisabled
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <Text style={styles.saveButtonText}>💾 सेव करें</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* App Tagline */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>ऐप टैगलाइन</Text>
                <TextInput
                    style={styles.input}
                    value={tagline}
                    onChangeText={setTagline}
                    placeholder="टैगलाइन लिखें"
                    placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity
                    onPress={() => updateSetting('app_tagline', tagline)}
                    disabled={loading || tagline === settings?.app_tagline}
                >
                    <LinearGradient
                        colors={GRADIENTS.purple as unknown as [string, string, ...string[]]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                            styles.saveButton,
                            (loading || tagline === settings?.app_tagline) && styles.saveButtonDisabled
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <Text style={styles.saveButtonText}>💾 सेव करें</Text>
                        )}
                    </LinearGradient>
                </TouchableOpacity>
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
    inputGroup: {
        marginBottom: SPACING.lg,
    },
    label: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.sm,
    },
    input: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 8,
        padding: SPACING.md,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
        marginBottom: SPACING.sm,
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
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
    },
});

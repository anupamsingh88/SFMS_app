import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, GRADIENTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';
import { useSettings } from '../../contexts/SettingsContext';

interface SeasonalData {
    season_name: string;
    fertilizer_type: string;
    allotment_per_hectare: number;
}

export default function SeasonalSettingsCard() {
    const { settings, refreshSettings } = useSettings();
    const [seasonalData, setSeasonalData] = useState<SeasonalData[]>([]);
    const [loading, setLoading] = useState(false);
    const [editValues, setEditValues] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        fetchSeasonalSettings();
    }, []);

    const fetchSeasonalSettings = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.getSettings);
            const result = await response.json();

            if (result.success && result.data.seasonal_settings) {
                const data: SeasonalData[] = [];
                Object.entries(result.data.seasonal_settings).forEach(([season, fertilizers]: [string, any]) => {
                    Object.entries(fertilizers).forEach(([fertilizer, value]) => {
                        data.push({
                            season_name: season,
                            fertilizer_type: fertilizer,
                            allotment_per_hectare: Number(value)
                        });
                        // Initialize edit values
                        setEditValues(prev => ({
                            ...prev,
                            [`${season}_${fertilizer}`]: value.toString()
                        }));
                    });
                });
                setSeasonalData(data);
            } else {
                setSeasonalData([]);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setSeasonalData([]);
        }
    };

    const updateAllotment = async (season: string, fertilizer: string, value: string) => {
        if (!value || isNaN(Number(value))) {
            Alert.alert('❌ त्रुटि', 'कृपया सही मात्रा दर्ज करें');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                season: season,
                fertilizer_type: fertilizer,
                allotment: value
            };

            const response = await fetch(API_ENDPOINTS.updateSeasonalSetting, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                await fetchSeasonalSettings();
                await refreshSettings();
                Alert.alert('✅ सफल', `${season} - ${fertilizer} अपडेट हो गया!`);
            } else {
                throw new Error(result.message || 'Update failed');
            }
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('❌ त्रुटि', 'अपडेट नहीं हो सका।');
        } finally {
            setLoading(false);
        }
    };

    const SeasonSection = ({ season }: { season: string }) => {
        const seasonIcon = season === 'Rabi' ? '❄️' : '🌧️';
        const seasonColor = season === 'Rabi' ? '#3B82F6' : '#10B981';

        const seasonData = seasonalData.filter(d => d.season_name === season);

        return (
            <View style={styles.seasonSection}>
                <View style={[styles.seasonHeader, { backgroundColor: seasonColor + '20' }]}>
                    <Text style={styles.seasonTitle}>{seasonIcon} {season} सीजन</Text>
                </View>

                {seasonData.map((item) => (
                    <View key={`${item.season_name}_${item.fertilizer_type}`} style={styles.allotmentRow}>
                        <View style={styles.fertilizerlInfo}>
                            <Text style={styles.fertilizerName}>{item.fertilizer_type}</Text>
                        </View>

                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.allotmentInput}
                                value={editValues[`${item.season_name}_${item.fertilizer_type}`]}
                                onChangeText={(text) => {
                                    setEditValues(prev => ({
                                        ...prev,
                                        [`${item.season_name}_${item.fertilizer_type}`]: text
                                    }));
                                }}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor={COLORS.textSecondary}
                            />
                            <Text style={styles.unit}>kg/hectare</Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => updateAllotment(
                                item.season_name,
                                item.fertilizer_type,
                                editValues[`${item.season_name}_${item.fertilizer_type}`]
                            )}
                            disabled={loading}
                        >
                            <View style={[styles.saveBtn, loading && styles.saveBtnDisabled]}>
                                {loading ? (
                                    <ActivityIndicator color={COLORS.white} size="small" />
                                ) : (
                                    <Text style={styles.saveBtnText}>💾</Text>
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>🌾 सीजनल सेटिंग्स</Text>
                <Text style={styles.subtitle}>प्रति हेक्टेयर खाद आवंटन</Text>
            </View>

            <SeasonSection season="Rabi" />
            <SeasonSection season="Kharif" />
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
    seasonSection: {
        marginBottom: SPACING.lg,
    },
    seasonHeader: {
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.md,
    },
    seasonTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    allotmentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
    },
    fertilizerlInfo: {
        flex: 1,
    },
    fertilizerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    allotmentInput: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 8,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        width: 80,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
        textAlign: 'center',
    },
    unit: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginLeft: SPACING.xs,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.small,
    },
    saveBtnDisabled: {
        opacity: 0.5,
    },
    saveBtnText: {
        fontSize: FONT_SIZES.lg,
    },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface PendingFarmer {
    id: number;
    name: string;
    mobile: string;
    district: string;
}

export default function FarmerManagementCard() {
    const [pendingFarmers, setPendingFarmers] = useState<PendingFarmer[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    React.useEffect(() => {
        fetchPendingFarmers();
    }, []);

    const fetchPendingFarmers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.getUsersPendingApproval);
            const result = await response.json();

            if (result.success) {
                setPendingFarmers(result.data.pendingFarmers || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (farmerId: number, action: 'approve' | 'reject') => {
        setActionLoading(`${farmerId}_${action}`);
        try {
            const formData = new FormData();
            formData.append('user_id', farmerId.toString());
            formData.append('action', action);
            formData.append('user_type', 'farmer');

            const response = await fetch(API_ENDPOINTS.manageUsers, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(
                    '✅ सफल',
                    `किसान को ${action === 'approve' ? 'मंजूरी दे दी' : 'अस्वीकार कर दिया'} गई!`
                );
                await fetchPendingFarmers();
            } else {
                throw new Error(result.message || 'Action failed');
            }
        } catch (error) {
            console.error('Action error:', error);
            Alert.alert('❌ त्रुटि', 'कार्रवाई नहीं हो सकी।');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>किसान मंजूरी</Text>
                <Text style={styles.subtitle}>
                    {pendingFarmers.length} किसान मंजूरी के लिए इंतजार में
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
            ) : pendingFarmers.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✅</Text>
                    <Text style={styles.emptyText}>सभी किसान मंजूर हो चुके हैं!</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {pendingFarmers.map((item) => (
                        <View key={item.id} style={styles.farmerCard}>
                            <View style={styles.farmerInfo}>
                                <View style={styles.farmerDetails}>
                                    <Text style={styles.farmerName}>{item.name}</Text>
                                    <Text style={styles.farmerMobile}>📱 {item.mobile}</Text>
                                    <Text style={styles.farmerDistrict}>📍 {item.district}</Text>
                                </View>
                            </View>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    onPress={() => handleAction(item.id, 'approve')}
                                    disabled={actionLoading !== null}
                                >
                                    <LinearGradient
                                        colors={['#10B981', '#059669']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.approveButton}
                                    >
                                        {actionLoading === `${item.id}_approve` ? (
                                            <ActivityIndicator color={COLORS.white} size="small" />
                                        ) : (
                                            <Text style={styles.buttonText}>✓</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleAction(item.id, 'reject')}
                                    disabled={actionLoading !== null}
                                >
                                    <LinearGradient
                                        colors={['#EF4444', '#DC2626']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.rejectButton}
                                    >
                                        {actionLoading === `${item.id}_reject` ? (
                                            <ActivityIndicator color={COLORS.white} size="small" />
                                        ) : (
                                            <Text style={styles.buttonText}>✕</Text>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </View>
            )}
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
    list: {
        maxHeight: 350,
    },
    loader: {
        marginVertical: SPACING.xl,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: SPACING.xxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: SPACING.md,
    },
    emptyText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.textSecondary,
    },
    farmerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        marginBottom: SPACING.md,
        ...SHADOWS.small,
    },
    farmerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    farmerDetails: {
        flex: 1,
    },
    farmerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    farmerMobile: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    farmerDistrict: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.primary,
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    approveButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.small,
    },
    rejectButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.small,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
    },
});

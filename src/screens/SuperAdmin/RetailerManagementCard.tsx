import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface PendingRetailer {
    id: number;
    name: string;
    mobile: string;
    shop_name: string;
}

export default function RetailerManagementCard() {
    const [pendingRetailers, setPendingRetailers] = useState<PendingRetailer[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    React.useEffect(() => {
        fetchPendingRetailers();
    }, []);

    const fetchPendingRetailers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.getUsersPendingApproval);
            const result = await response.json();

            if (result.success) {
                setPendingRetailers(result.data.pendingRetailers || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (retailerId: number, action: 'approve' | 'reject') => {
        setActionLoading(`${retailerId}_${action}`);
        try {
            const formData = new FormData();
            formData.append('user_id', retailerId.toString());
            formData.append('action', action);
            formData.append('user_type', 'retailer');

            const response = await fetch(API_ENDPOINTS.manageUsers, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(
                    '✅ सफल',
                    `दुकानदार को ${action === 'approve' ? 'मंजूरी दे दी' : 'अस्वीकार कर दिया'} गई!`
                );
                await fetchPendingRetailers();
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
                <Text style={styles.title}>🏪 दुकानदार मंजूरी</Text>
                <Text style={styles.subtitle}>
                    {pendingRetailers.length} दुकानदार मंजूरी के लिए इंतजार में
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
            ) : pendingRetailers.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✅</Text>
                    <Text style={styles.emptyText}>सभी दुकानदार मंजूर हो चुके हैं!</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {pendingRetailers.map((item) => (
                        <View key={item.id.toString()} style={styles.retailerCard}>
                            <View style={styles.retailerInfo}>
                                <Text style={styles.retailerIcon}>🏪</Text>
                                <View style={styles.retailerDetails}>
                                    <Text style={styles.retailerName}>{item.name}</Text>
                                    <Text style={styles.shopName}>🏬 {item.shop_name}</Text>
                                    <Text style={styles.retailerMobile}>📱 {item.mobile}</Text>
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
        // maxHeight removed to allow full expansion
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
    retailerCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        marginBottom: SPACING.md,
        ...SHADOWS.small,
    },
    retailerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    retailerIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    retailerDetails: {
        flex: 1,
    },
    retailerName: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    shopName: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    retailerMobile: {
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface PendingUser {
    id: number;
    name: string;
    mobile: string;
    userType: 'farmer' | 'retailer';
}

interface UserManagementCardProps {
    stats: any;
    onRefresh: () => void;
}

export default function UserManagementCard({ stats, onRefresh }: UserManagementCardProps) {
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_ENDPOINTS.getPendingApprovals);
            const result = await response.json();

            if (result.success) {
                const users: PendingUser[] = [
                    ...result.data.pendingFarmers.map((f: any) => ({ ...f, userType: 'farmer' as const })),
                    ...result.data.pendingRetailers.map((r: any) => ({ ...r, userType: 'retailer' as const })),
                ];
                setPendingUsers(users);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId: number, action: 'approve' | 'reject', userType: 'farmer' | 'retailer') => {
        setActionLoading(`${userId}_${action}`);
        try {
            const payload = {
                user_id: userId,
                action: action,
                user_type: userType
            };

            const response = await fetch(API_ENDPOINTS.manageUsers, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                Alert.alert(
                    '✅ सफल',
                    `${userType === 'farmer' ? 'किसान' : 'दुकानदार'} को ${action === 'approve' ? 'मंजूरी दे दी' : 'अस्वीकार कर दिया'} गई!`
                );
                await fetchPendingUsers();
                onRefresh();
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

    const renderUser = ({ item }: { item: PendingUser }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userIcon}>{item.userType === 'farmer' ? '👨‍🌾' : '🏪'}</Text>
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userMobile}>📱 {item.mobile}</Text>
                    <Text style={styles.userType}>
                        {item.userType === 'farmer' ? 'किसान' : 'दुकानदार'}
                    </Text>
                </View>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    onPress={() => handleUserAction(item.id, 'approve', item.userType)}
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
                    onPress={() => handleUserAction(item.id, 'reject', item.userType)}
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
    );

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>👥 उपयोगकर्ता प्रबंधन</Text>
                <Text style={styles.subtitle}>
                    {pendingUsers.length} मंजूरी बाकी है
                </Text>
            </View>

            {loading ? (
                <ActivityIndicator color={COLORS.primary} size="large" style={styles.loader} />
            ) : pendingUsers.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>✅</Text>
                    <Text style={styles.emptyText}>सभी मंजूरी हो चुकी हैं!</Text>
                </View>
            ) : (
                <FlatList
                    data={pendingUsers}
                    renderItem={renderUser}
                    keyExtractor={(item) => `${item.userType}_${item.id}`}
                    style={styles.list}
                    showsVerticalScrollIndicator={false}
                />
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
        maxHeight: 500,
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
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.backgroundLight,
        borderRadius: 12,
        marginBottom: SPACING.md,
        ...SHADOWS.small,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    userIcon: {
        fontSize: 32,
        marginRight: SPACING.md,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    userMobile: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    userType: {
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

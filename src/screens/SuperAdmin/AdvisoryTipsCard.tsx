import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface AdvisoryTip {
    id: number;
    title: string;
    description: string;
    tipType: 'general' | 'seasonal' | 'fertilizer' | 'crop';
    season: 'Rabi' | 'Kharif' | 'Zaid' | 'All';
    displayOrder: number;
    isActive: boolean;
}

export default function AdvisoryTipsCard() {
    const [tips, setTips] = useState<AdvisoryTip[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<number | null>(null);
    const [adding, setAdding] = useState(false);
    const [formData, setFormData] = useState<Partial<AdvisoryTip>>({
        title: '',
        description: '',
        tipType: 'general',
        season: 'All',
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        fetchTips();
    }, []);

    const fetchTips = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.manageAdvisoryTips);
            const result = await response.json();
            if (result.success && result.data) {
                setTips(Array.isArray(result.data) ? result.data : []);
            } else {
                setTips([]);
            }
        } catch (error) {
            console.error('Error fetching tips:', error);
            setTips([]);
            Alert.alert('Error', 'Failed to load advisory tips');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.description) {
            Alert.alert('Error', 'Title and description are required');
            return;
        }

        try {
            const url = API_ENDPOINTS.manageAdvisoryTips;
            const method = editing ? 'PUT' : 'POST';
            const body = editing ? { ...formData, id: editing } : formData;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const result = await response.json();
            if (result.success) {
                Alert.alert('Success', result.message);
                setEditing(null);
                setAdding(false);
                setFormData({
                    title: '',
                    description: '',
                    tipType: 'general',
                    season: 'All',
                    displayOrder: 0,
                    isActive: true,
                });
                fetchTips();
            }
        } catch (error) {
            console.error('Error saving tip:', error);
            Alert.alert('Error', 'Failed to save advisory tip');
        }
    };

    const handleDelete = async (id: number) => {
        Alert.alert('Delete Tip', 'Are you sure you want to delete this tip?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await fetch(API_ENDPOINTS.manageAdvisoryTips, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id }),
                        });

                        const result = await response.json();
                        if (result.success) {
                            Alert.alert('Success', result.message);
                            fetchTips();
                        }
                    } catch (error) {
                        console.error('Error deleting tip:', error);
                        Alert.alert('Error', 'Failed to delete advisory tip');
                    }
                },
            },
        ]);
    };

    const handleEdit = (tip: AdvisoryTip) => {
        setFormData(tip);
        setEditing(tip.id);
        setAdding(false);
    };

    const handleCancel = () => {
        setEditing(null);
        setAdding(false);
        setFormData({
            title: '',
            description: '',
            tipType: 'general',
            season: 'All',
            displayOrder: 0,
            isActive: true,
        });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>💡 Advisory Tips</Text>
                    <Text style={styles.subtitle}>सलाह और सुझाव प्रबंधन</Text>
                </View>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        setAdding(true);
                        setEditing(null);
                    }}
                >
                    <Text style={styles.addButtonText}>+ Add New</Text>
                </TouchableOpacity>
            </View>

            {(adding || editing) && (
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>{editing ? 'Edit Tip' : 'Add New Tip'}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Title (Hindi)"
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Description (Hindi)"
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <ScrollView style={styles.tipsScroll} showsVerticalScrollIndicator={false}>
                {tips.map((tip, index) => (
                    <View key={tip.id} style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                            <View style={styles.tipNumber}>
                                <Text style={styles.tipNumberText}>{index + 1}</Text>
                            </View>
                            <View style={styles.tipContent}>
                                <Text style={styles.tipTitle}>{tip.title}</Text>
                                <Text style={styles.tipDescription}>{tip.description}</Text>
                                <View style={styles.tipMeta}>
                                    <Text style={styles.metaText}>📋 {tip.tipType}</Text>
                                    <Text style={styles.metaText}>🌾 {tip.season}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={styles.tipActions}>
                            <TouchableOpacity
                                style={styles.editActionButton}
                                onPress={() => handleEdit(tip)}
                            >
                                <Text style={styles.editActionText}>✏️ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.deleteActionButton}
                                onPress={() => handleDelete(tip.id)}
                            >
                                <Text style={styles.deleteActionText}>🗑️ Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.lg,
        ...SHADOWS.medium,
    },
    loadingContainer: {
        padding: SPACING.xxl,
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    title: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    addButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    addButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    formCard: {
        backgroundColor: COLORS.backgroundLight,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    formTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
        borderRadius: BORDER_RADIUS.sm,
        padding: SPACING.sm,
        marginBottom: SPACING.sm,
        fontSize: FONT_SIZES.md,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    saveButton: {
        flex: 1,
        backgroundColor: COLORS.success,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: COLORS.grayLight,
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    tipsScroll: {
        maxHeight: 600,
    },
    tipCard: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    tipHeader: {
        flexDirection: 'row',
        marginBottom: SPACING.sm,
    },
    tipNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    tipNumberText: {
        fontSize: FONT_SIZES.md,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
    },
    tipContent: {
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
        marginBottom: SPACING.xs,
    },
    tipMeta: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    metaText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
    },
    tipActions: {
        flexDirection: 'row',
        gap: SPACING.sm,
        marginTop: SPACING.sm,
    },
    editActionButton: {
        flex: 1,
        backgroundColor: COLORS.info,
        padding: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    editActionText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
    },
    deleteActionButton: {
        flex: 1,
        backgroundColor: COLORS.error,
        padding: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
        alignItems: 'center',
    },
    deleteActionText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
    },
});

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
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface AppContentItem {
    id: number;
    contentKey: string;
    contentValue: string;
    contentType: string;
    category: string;
    displayOrder: number;
    isActive: boolean;
}

interface GroupedContent {
    [category: string]: AppContentItem[];
}

export default function AppContentCard() {
    const [content, setContent] = useState<AppContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_ENDPOINTS.manageAppContent);
            const result = await response.json();
            if (result.success && result.data) {
                setContent(Array.isArray(result.data) ? result.data : []);
            } else {
                setContent([]);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            setContent([]);
            Alert.alert('Error', 'Failed to load app content');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: AppContentItem) => {
        setEditingId(item.id);
        setEditValue(item.contentValue);
    };

    const handleSave = async (id: number) => {
        try {
            const response = await fetch(API_ENDPOINTS.manageAppContent, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, contentValue: editValue }),
            });

            const result = await response.json();
            if (result.success) {
                Alert.alert('Success', 'Content updated successfully');
                setEditingId(null);
                fetchContent();
            }
        } catch (error) {
            console.error('Error saving content:', error);
            Alert.alert('Error', 'Failed to save content');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValue('');
    };

    const groupByCategory = (): GroupedContent => {
        const grouped: GroupedContent = {};
        content.forEach((item) => {
            if (!grouped[item.category]) {
                grouped[item.category] = [];
            }
            grouped[item.category].push(item);
        });
        return grouped;
    };

    const getCategoryTitle = (category: string): string => {
        const titles: Record<string, string> = {
            instructions: '📝 App Instructions',
            helpline: '📞 Helpline Information',
            notices: '📢 Important Notices',
            headers: '🏷️ Headers & Labels',
        };
        return titles[category] || category;
    };

    const getFieldLabel = (key: string): string => {
        return key
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    const groupedContent = groupByCategory();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>📄 App Content Management</Text>
                    <Text style={styles.subtitle}>ऐप विषय-सामग्री प्रबंधन</Text>
                </View>
            </View>

            <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
                {Object.entries(groupedContent).map(([category, items]) => (
                    <View key={category} style={styles.categorySection}>
                        <Text style={styles.categoryTitle}>{getCategoryTitle(category)}</Text>

                        {items.map((item) => (
                            <View key={item.id} style={styles.contentItem}>
                                <Text style={styles.fieldLabel}>{getFieldLabel(item.contentKey)}</Text>

                                {editingId === item.id ? (
                                    <View>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                item.contentValue.length > 50 && styles.textArea,
                                            ]}
                                            value={editValue}
                                            onChangeText={setEditValue}
                                            multiline={item.contentValue.length > 50}
                                            numberOfLines={item.contentValue.length > 50 ? 3 : 1}
                                        />
                                        <View style={styles.buttonRow}>
                                            <TouchableOpacity
                                                style={styles.saveButton}
                                                onPress={() => handleSave(item.id)}
                                            >
                                                <Text style={styles.saveButtonText}>💾 Save</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.cancelButton}
                                                onPress={handleCancel}
                                            >
                                                <Text style={styles.cancelButtonText}>✖️ Cancel</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.valueContainer}>
                                        <Text style={styles.valueText}>{item.contentValue}</Text>
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => handleEdit(item)}
                                        >
                                            <Text style={styles.editButtonText}>✏️ Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))}
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
        marginBottom: SPACING.lg,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.grayLight,
        paddingBottom: SPACING.md,
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
    contentScroll: {
        maxHeight: 600,
    },
    categorySection: {
        marginBottom: SPACING.lg,
    },
    categoryTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.md,
        paddingBottom: SPACING.xs,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.primaryLight,
    },
    contentItem: {
        backgroundColor: COLORS.backgroundLight,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.grayLight,
    },
    fieldLabel: {
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'capitalize',
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: SPACING.sm,
    },
    valueText: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        lineHeight: 22,
    },
    editButton: {
        backgroundColor: COLORS.info,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.sm,
    },
    editButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: FONT_WEIGHTS.semibold,
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
        height: 80,
        textAlignVertical: 'top',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
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
});

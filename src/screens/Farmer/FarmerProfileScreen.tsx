import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    Platform
} from 'react-native';
import { Card, Input, Button } from '../../components';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '../../constants';

interface FarmerProfileScreenProps {
    farmerName: string;
    onLogout?: () => void;
}

export default function FarmerProfileScreen({ farmerName, onLogout }: FarmerProfileScreenProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Initial Mock Data
    const [profile, setProfile] = useState({
        name: farmerName || 'राजेश कुमार',
        mobile: '9876543210',
        fatherName: 'राम किशन',
        village: 'रामपुर',
        block: 'बहादुरगंज',
        tehsil: 'बहादुरगंज',
        district: 'हापुड़',
        khasraNumber: '124/A',
        landArea: '2.5', // Hectares
    });

    const [editedProfile, setEditedProfile] = useState(profile);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancel editing
            setEditedProfile(profile);
            setIsEditing(false);
        } else {
            // Start editing
            setEditedProfile(profile);
            setIsEditing(true);
        }
    };

    const handleSave = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setProfile(editedProfile);
            setLoading(false);
            setIsEditing(false);
            if (Platform.OS === 'web') {
                alert('प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
            } else {
                Alert.alert('✅ सफल', 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!');
            }
        }, 1500);
    };

    const handleChange = (field: string, value: string) => {
        setEditedProfile(prev => ({ ...prev, [field]: value }));
    };

    const renderField = (label: string, value: string, fieldKey: string, icon: string, editable: boolean = true) => {
        if (isEditing && editable) {
            return (
                <View style={styles.fieldContainer}>
                    <Text style={styles.inputLabel}>{icon} {label}</Text>
                    <Input
                        placeholder={label}
                        value={editedProfile[fieldKey as keyof typeof editedProfile]}
                        onChangeText={(text) => handleChange(fieldKey, text)}
                        style={styles.input}
                    />
                </View>
            );
        }
        return (
            <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>{icon} {label}</Text>
                <Text style={styles.fieldValue}>{value}</Text>
            </View>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Header Profile Section */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{profile.name}</Text>
                    <Text style={styles.headerSub}>👨‍🌾 पंजीकृत किसान</Text>
                </View>
                <TouchableOpacity onPress={handleEditToggle} style={styles.editButton}>
                    <Text style={styles.editButtonText}>{isEditing ? '❌ रद्द करें' : '✏️ संपादित करें'}</Text>
                </TouchableOpacity>
            </View>

            {/* Personal Details Card */}
            <Card style={styles.card}>
                <Text style={styles.cardTitle}>👤 व्यक्तिगत विवरण</Text>
                {renderField('नाम', profile.name, 'name', '')}
                {renderField('पिता/पति का नाम', profile.fatherName, 'fatherName', '')}
                {renderField('मोबाइल नंबर', profile.mobile, 'mobile', '📱', false)}
            </Card>

            {/* Address Details Card */}
            <Card style={styles.card}>
                <Text style={styles.cardTitle}>📍 पता और स्थान</Text>
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        {renderField('गाँव', profile.village, 'village', '')}
                    </View>
                    <View style={styles.halfWidth}>
                        {renderField('ब्लॉक', profile.block, 'block', '')}
                    </View>
                </View>
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        {renderField('तहसील', profile.tehsil, 'tehsil', '')}
                    </View>
                    <View style={styles.halfWidth}>
                        {renderField('जिला', profile.district, 'district', '')}
                    </View>
                </View>
            </Card>

            {/* Land Details Card */}
            <Card style={styles.card}>
                <Text style={styles.cardTitle}>🌾 जमीन का विवरण</Text>
                <View style={styles.row}>
                    <View style={styles.halfWidth}>
                        {renderField('ख़सरा नंबर', profile.khasraNumber, 'khasraNumber', '#️⃣')}
                    </View>
                    <View style={styles.halfWidth}>
                        {renderField('क्षेत्रफल (हेक्टेयर)', profile.landArea, 'landArea', '📐')}
                    </View>
                </View>
            </Card>

            {/* Save Button (Only in Edit Mode) */}
            {isEditing && (
                <View style={styles.actionContainer}>
                    <Button
                        title={loading ? "सहेज रहा है..." : "सुरक्षित करें (Save)"}
                        onPress={handleSave}
                        disabled={loading}
                        size="large"
                    />
                </View>
            )}

            {/* Logout Button */}
            {onLogout && !isEditing && (
                <View style={styles.logoutContainer}>
                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={onLogout}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.logoutIcon}>🚪</Text>
                        <Text style={styles.logoutButtonText}>लॉगआउट (Logout)</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background, // Should match dashboard background
    },
    contentContainer: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        backgroundColor: COLORS.white,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.small,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        backgroundColor: COLORS.primaryLight,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    avatarText: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontSize: FONT_SIZES.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    headerSub: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    editButton: {
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        backgroundColor: COLORS.grayLight,
        borderRadius: BORDER_RADIUS.md,
    },
    editButtonText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textPrimary,
    },
    card: {
        marginBottom: SPACING.md,
        padding: SPACING.lg,
        backgroundColor: COLORS.white,
        borderRadius: BORDER_RADIUS.md,
        ...SHADOWS.small,
    },
    cardTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.md,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.grayLight,
        paddingBottom: SPACING.xs,
    },
    fieldContainer: {
        marginBottom: SPACING.md,
    },
    fieldLabel: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textSecondary,
        marginBottom: 2,
    },
    fieldValue: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textPrimary,
        fontWeight: '500',
    },
    inputLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
    },
    input: {
        marginBottom: 0, // Override default margin if needed
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    halfWidth: {
        width: '48%',
    },
    actionContainer: {
        marginTop: SPACING.md,
        marginBottom: SPACING.xxl,
    },
    logoutContainer: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 2,
        borderColor: COLORS.error,
        borderRadius: BORDER_RADIUS.lg,
        padding: SPACING.lg,
        ...SHADOWS.small,
    },
    logoutIcon: {
        fontSize: 24,
        marginRight: SPACING.sm,
    },
    logoutButtonText: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.error,
    },
});

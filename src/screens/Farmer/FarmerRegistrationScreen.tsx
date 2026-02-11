import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert, // Import Alert
    ImageBackground,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, Input, Dropdown } from '../../components';
import BackButton from '../../components/BackButton';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
} from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface LocationOption {
    label: string;
    value: string;
}

// API URLs from centralized config
const API_URL = API_ENDPOINTS.registerFarmer;
const LOCATION_API_URL = API_ENDPOINTS.getLocations;

interface FarmerRegistrationScreenProps {
    onRegister?: (data: any) => void;
    onBack: () => void;
}

export default function FarmerRegistrationScreen({
    onRegister,
    onBack,
}: FarmerRegistrationScreenProps) {
    const [formData, setFormData] = useState({
        name: '',
        mobileNumber: '',
        aadhaarNumber: '',
        village: '',
        district: '',
        tehsil: '',
        block: '',
        khasraNumber: '',
        landArea: '',
        waNotification: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    // Location Data States
    const [districts, setDistricts] = useState<LocationOption[]>([]);
    const [tehsils, setTehsils] = useState<LocationOption[]>([]);
    const [blocks, setBlocks] = useState<LocationOption[]>([]);
    const [villages, setVillages] = useState<LocationOption[]>([]);

    useEffect(() => {
        fetchLocations('districts');
    }, []);

    const fetchLocations = async (type: string, parentId?: string) => {
        try {
            let url = `${LOCATION_API_URL}?type=${type}`;
            if (parentId) {
                url += `&parent_id=${parentId}`;
            }

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                const options = result.data.map((item: any) => ({
                    label: `${item.name_en} (${item.name_hi})`,
                    value: item.id
                }));

                switch (type) {
                    case 'districts': setDistricts(options); break;
                    case 'tehsils': setTehsils(options); break;
                    case 'blocks': setBlocks(options); break; // Blocks logic might need adjustment based on Schema
                    case 'villages': setVillages(options); break;
                }
            } else {
                console.error(`Failed to fetch ${type}:`, result.message);
            }
        } catch (error) {
            console.error(`Error fetching ${type}:`, error);
        }
    };

    const handleDistrictChange = (value: string | number) => {
        const val = String(value);
        updateField('district', val);
        updateField('tehsil', '');
        updateField('block', '');
        updateField('village', '');
        setTehsils([]);
        setBlocks([]);
        setVillages([]);

        // Fetch dependent data
        fetchLocations('tehsils', val);
        fetchLocations('blocks', val); // Assuming blocks are mapped to district
    };

    const handleTehsilChange = (value: string | number) => {
        updateField('tehsil', String(value));
        // If blocks were dependent on tehsil, we would fetch here
    };

    const handleBlockChange = (value: string | number) => {
        const val = String(value);
        updateField('block', val);
        updateField('village', '');
        setVillages([]);
        fetchLocations('villages', val);
    };

    const updateField = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) newErrors.name = 'नाम आवश्यक है';
        if (!formData.mobileNumber.trim()) newErrors.mobileNumber = 'मोबाइल नंबर आवश्यक है';
        else if (!/^[0-9]{10}$/.test(formData.mobileNumber)) newErrors.mobileNumber = 'मोबाइल नंबर 10 अंकों का होना चाहिए';

        if (!formData.aadhaarNumber.trim()) newErrors.aadhaarNumber = 'आधार नंबर आवश्यक है';
        else if (!/^[0-9]{12}$/.test(formData.aadhaarNumber)) newErrors.aadhaarNumber = 'आधार नंबर 12 अंकों का होना चाहिए';

        if (!formData.district.trim()) newErrors.district = 'जिला आवश्यक है';
        if (!formData.block.trim()) newErrors.block = 'ब्लॉक आवश्यक है';
        if (!formData.tehsil.trim()) newErrors.tehsil = 'तहसील आवश्यक है';
        if (!formData.village.trim()) newErrors.village = 'गाँव आवश्यक है';
        if (!formData.khasraNumber.trim()) newErrors.khasraNumber = 'खसरा नंबर आवश्यक है';
        if (!formData.landArea.trim()) newErrors.landArea = 'जमीन का क्षेत्रफल आवश्यक है';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                mobile: formData.mobileNumber,
                aadhaar: formData.aadhaarNumber,
                district_id: formData.district,
                village_id: formData.village,
                tehsil_id: formData.tehsil,
                block_id: formData.block,
                khasra_number: formData.khasraNumber,
                khasra_rukba: formData.landArea,
                wa_notification: formData.waNotification,
            };

            // Create a timeout promise that rejects after 10 seconds
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timed out')), 10000);
            });

            // Race fetch against timeout
            const response = await Promise.race([
                fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }),
                timeoutPromise
            ]) as Response;

            const result = await response.json();

            if (result.success) {
                if (Platform.OS === 'web') {
                    alert(result.message || 'पंजीकरण सफल रहा। आपका आवेदन अनुमोदन के लिए भेज दिया गया है।');
                } else {
                    Alert.alert('सफल', result.message || 'पंजीकरण सफल रहा। आपका आवेदन अनुमोदन के लिए भेज दिया गया है।', [
                        {
                            text: 'OK', onPress: () => {
                                if (onRegister) onRegister(result);
                                onBack();
                            }
                        }
                    ]);
                }
            } else {
                if (Platform.OS === 'web') alert(result.message || 'पंजीकरण विफल रहा');
                else Alert.alert('त्रुटि', result.message || 'पंजीकरण विफल रहा');
            }
        } catch (error: any) {
            console.error('Registration Error:', error);
            const errorMessage = error.message === 'Request timed out'
                ? 'सर्वर से संपर्क नहीं हो पा रहा है। कृपया इंटरनेट कनेक्शन जांचें या बाद में प्रयास करें।'
                : 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।';

            if (Platform.OS === 'web') alert(errorMessage);
            else Alert.alert('नेटवर्क त्रुटि', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageBackground
            source={require('../../../assets/green-field-with-sun.jpg')}
            style={styles.container}
            blurRadius={3}
        >
            <LinearGradient
                colors={['rgba(255,243,224,0.85)', 'rgba(255,224,178,0.90)', 'rgba(255,204,128,0.85)']}
                style={styles.overlay}
            >
                <BackButton onPress={onBack} />
                <SafeAreaView style={styles.safeArea}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        <ScrollView
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {/* Header */}
                            <View style={styles.header}>
                                <Image
                                    source={require('../../../assets/tanrica-farmer-9911436_1920.png')}
                                    style={styles.farmerImage}
                                    resizeMode="cover"
                                />
                                <Text style={styles.title}>किसान पंजीकरण</Text>
                            </View>

                            {/* Registration Form */}
                            <Card style={styles.formCard}>
                                <Text style={styles.formTitle}>
                                    अपनी जानकारी भरें और पंजीकरण पूरा करें
                                </Text>

                                <Input
                                    label={HINDI_TEXT.name}
                                    placeholder="अपना पूरा नाम लिखें"
                                    value={formData.name}
                                    onChangeText={(value) => updateField('name', value)}
                                    error={errors.name}
                                    required
                                />

                                <Input
                                    label={HINDI_TEXT.mobileNumber}
                                    placeholder="10 अंक का मोबाइल नंबर"
                                    value={formData.mobileNumber}
                                    onChangeText={(value) => updateField('mobileNumber', value)}
                                    keyboardType="phone-pad"
                                    maxLength={10}
                                    error={errors.mobileNumber}
                                    required
                                />

                                <Input
                                    label={HINDI_TEXT.aadhaarNumber}
                                    placeholder="12 अंक का आधार नंबर"
                                    value={formData.aadhaarNumber}
                                    onChangeText={(value) => updateField('aadhaarNumber', value)}
                                    keyboardType="number-pad"
                                    maxLength={12}
                                    error={errors.aadhaarNumber}
                                    required
                                />

                                <Dropdown
                                    label="जिला"
                                    placeholder="जिला चुनें"
                                    options={districts}
                                    value={formData.district}
                                    onSelect={handleDistrictChange}
                                    error={errors.district}
                                    required
                                />

                                <Dropdown
                                    label="तहसील"
                                    placeholder="तहसील चुनें"
                                    options={tehsils}
                                    value={formData.tehsil}
                                    onSelect={handleTehsilChange}
                                    error={errors.tehsil}
                                    required
                                    disabled={!formData.district}
                                />

                                <Dropdown
                                    label="ब्लॉक"
                                    placeholder="ब्लॉक चुनें"
                                    options={blocks}
                                    value={formData.block}
                                    onSelect={handleBlockChange}
                                    error={errors.block}
                                    required
                                    disabled={!formData.district}
                                />

                                <Dropdown
                                    label="गाँव"
                                    placeholder="गाँव चुनें"
                                    options={villages}
                                    value={formData.village}
                                    onSelect={(val) => updateField('village', String(val))}
                                    error={errors.village}
                                    required
                                    disabled={!formData.block}
                                />

                                <Input
                                    label="खसरा नंबर"
                                    placeholder="खसरा नंबर"
                                    value={formData.khasraNumber}
                                    onChangeText={(value) => updateField('khasraNumber', value)}
                                    error={errors.khasraNumber}
                                    required
                                />

                                <Input
                                    label={HINDI_TEXT.landArea + ' (हेक्टेयर में)'}
                                    placeholder="जमीन का क्षेत्रफल"
                                    value={formData.landArea}
                                    onChangeText={(value) => updateField('landArea', value)}
                                    keyboardType="decimal-pad"
                                    error={errors.landArea}
                                    required
                                />

                                {/* WhatsApp Notification Checkbox - Simplified as a button/row since Checkbox component might not exist */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                                    <Text style={{ marginRight: 10 }}>WhatsApp नोटिफिकेशन प्राप्त करें?</Text>
                                    <Button
                                        title={formData.waNotification ? "हाँ" : "नहीं"}
                                        onPress={() => updateField('waNotification', !formData.waNotification)}
                                        size="small"
                                        variant={formData.waNotification ? "primary" : "outline"}
                                    />
                                </View>

                            </Card>

                            {/* Action Buttons */}
                            <View style={styles.buttonContainer}>
                                <Button
                                    title={loading ? "पंजीकरण हो रहा है..." : HINDI_TEXT.register}
                                    onPress={handleRegister}
                                    size="large"
                                    style={styles.button}
                                    disabled={loading}
                                />

                            </View>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex: 1,
    },
    farmerImage: {
        width: 100,
        height: 100,
        borderRadius: 50, // Make it circular
        alignSelf: 'center',
        marginBottom: SPACING.md,
        backgroundColor: COLORS.white, // White background
        borderWidth: 3,
        borderColor: COLORS.primary,
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: SPACING.xl, // Increased top margin for BackButton clearance
        marginBottom: SPACING.lg,
        paddingHorizontal: SPACING.sm,
    },
    headerTextContainer: {
        flex: 1,
        paddingRight: SPACING.md,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        textAlign: 'left', // Align left
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'left',
    },
    formCard: {
        marginBottom: SPACING.xl,
    },
    formTitle: {
        fontSize: FONT_SIZES.md, // Slightly smaller for long text
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        textAlign: 'center', // Center the instruction
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.grayLight,
        marginVertical: SPACING.lg,
    },
    optionalLabel: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        fontStyle: 'italic',
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    buttonContainer: {
        gap: SPACING.md,
    },
    button: {
        marginBottom: SPACING.sm,
    },
});

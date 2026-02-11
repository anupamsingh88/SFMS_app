import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import BackButton from '../../components/BackButton';
import ParticleBackground from '../../components/ParticleBackground';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    GRADIENTS,
    SHADOWS
} from '../../constants';
import { API_ENDPOINTS } from '../../config/config';

interface RetailerRegistrationScreenProps {
    onBack: () => void;
    onRegisterSuccess: () => void;
}

export default function RetailerRegistrationScreen({
    onBack,
    onRegisterSuccess
}: RetailerRegistrationScreenProps) {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        shop_name: '',
        license_number: '',
        password: '',
        confirm_password: '',
        address: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) newErrors.name = 'नाम आवश्यक है';
        if (!formData.shop_name.trim()) newErrors.shop_name = 'दुकान का नाम आवश्यक है';

        if (!formData.mobile.trim()) {
            newErrors.mobile = 'मोबाइल नंबर आवश्यक है';
        } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
            newErrors.mobile = 'मान्य 10 अंकों का मोबाइल नंबर दर्ज करें';
        }

        if (!formData.license_number.trim()) newErrors.license_number = 'लाइसेंस नंबर आवश्यक है';
        if (!formData.address.trim()) newErrors.address = 'पता आवश्यक है';

        if (!formData.password) {
            newErrors.password = 'पासवर्ड आवश्यक है';
        } else if (formData.password.length < 6) {
            newErrors.password = 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए';
        }

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = 'पासवर्ड मेल नहीं खाते';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                mobile: formData.mobile,
                shop_name: formData.shop_name,
                license_number: formData.license_number,
                password: formData.password,
                address: formData.address
            };

            const response = await fetch(API_ENDPOINTS.registerRetailer, {
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
                    'प्रक्रिया सफल रही! एडमिन की मंजूरी के बाद आप लॉगिन कर सकेंगे।',
                    [{ text: 'OK', onPress: onRegisterSuccess }]
                );
            } else {
                Alert.alert('❌ त्रुटि', result.message || 'पंजीकरण विफल रहा');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('❌ त्रुटि', 'नेटवर्क समस्या। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParticleBackground>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton onPress={onBack} />
                    <Text style={styles.headerTitle}>दुकानदार पंजीकरण</Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                    >
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <View style={styles.card}>
                                <Text style={styles.sectionTitle}>व्यक्तिगत और दुकान विवरण</Text>

                                <Input
                                    label="पूरा नाम"
                                    placeholder="अपना नाम दर्ज करें"
                                    value={formData.name}
                                    onChangeText={(text) => handleChange('name', text)}
                                    error={errors.name}
                                    required
                                />

                                <Input
                                    label="दुकान का नाम"
                                    placeholder="अपनी दुकान का नाम दर्ज करें"
                                    value={formData.shop_name}
                                    onChangeText={(text) => handleChange('shop_name', text)}
                                    error={errors.shop_name}
                                    required
                                />

                                <Input
                                    label="मोबाइल नंबर"
                                    placeholder="10 अंकों का मोबाइल नंबर"
                                    value={formData.mobile}
                                    onChangeText={(text) => handleChange('mobile', text.replace(/[^0-9]/g, '').slice(0, 10))}
                                    keyboardType="phone-pad"
                                    error={errors.mobile}
                                    required
                                />

                                <Input
                                    label="लाइसेंस नंबर"
                                    placeholder="उर्वरक बिक्री लाइसेंस नंबर"
                                    value={formData.license_number}
                                    onChangeText={(text) => handleChange('license_number', text)}
                                    error={errors.license_number}
                                    required
                                />

                                <Input
                                    label="पता"
                                    placeholder="दुकान का पूरा पता"
                                    value={formData.address}
                                    onChangeText={(text) => handleChange('address', text)}
                                    error={errors.address}
                                    multiline
                                    numberOfLines={3}
                                    required
                                />

                                <Text style={[styles.sectionTitle, { marginTop: SPACING.lg }]}>सुरक्षा</Text>

                                <Input
                                    label="पासवर्ड"
                                    placeholder="नया पासवर्ड बनाएं"
                                    value={formData.password}
                                    onChangeText={(text) => handleChange('password', text)}
                                    error={errors.password}
                                    secureTextEntry
                                    required
                                />

                                <Input
                                    label="पासवर्ड की पुष्टि करें"
                                    placeholder="पासवर्ड दोबारा दर्ज करें"
                                    value={formData.confirm_password}
                                    onChangeText={(text) => handleChange('confirm_password', text)}
                                    error={errors.confirm_password}
                                    secureTextEntry
                                    required
                                />

                                <Button
                                    title={loading ? 'प्रक्रिया चल रही है...' : 'पंजीकरण करें'}
                                    onPress={handleRegister}
                                    size="large"
                                    disabled={loading}
                                    style={styles.registerButton}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ParticleBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    inner: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        paddingTop: Platform.OS === 'android' ? SPACING.xl : SPACING.lg,
    },
    headerTitle: {
        fontSize: FONT_SIZES.xl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginLeft: SPACING.md,
    },
    scrollContent: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl * 2,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: SPACING.lg,
        ...SHADOWS.medium,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },
    registerButton: {
        marginTop: SPACING.xl,
    }
});

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Input } from '../../components';
import LogoPlaceholder from '../../components/LogoPlaceholder';
import ParticleBackground from '../../components/ParticleBackground';
import BackButton from '../../components/BackButton';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    GRADIENTS
} from '../../constants';
import { SUPERADMIN_CREDENTIALS, API_ENDPOINTS } from '../../config/config';

interface RetailerLoginScreenProps {
    onBack: () => void;
    onLoginSuccess: (isSuperAdmin: boolean) => void;
    onRegisterClick: () => void;
}

export default function RetailerLoginScreen({
    onBack,
    onLoginSuccess,
    onRegisterClick
}: RetailerLoginScreenProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

    const fadeAnim = useState(new Animated.Value(0))[0];
    const scaleAnim = useState(new Animated.Value(0.98))[0];
    const slideAnim = useState(new Animated.Value(10))[0];

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 10,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const validate = () => {
        const newErrors: { username?: string; password?: string } = {};

        if (!username.trim()) newErrors.username = 'उपयोगकर्ता नाम आवश्यक है';
        if (!password.trim()) newErrors.password = 'पासवर्ड आवश्यक है';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch(API_ENDPOINTS.loginRetailer, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                if (result.data.user_type === 'superadmin') {
                    // SuperAdmin login
                    Alert.alert('सफल', 'SuperAdmin लॉगिन सफल!');
                    onLoginSuccess(true);
                } else {
                    // Retailer login
                    Alert.alert('सफल', `स्वागत है, ${result.data.name}!`);
                    // Here you would typically store the user data in context/storage
                    // For now, we just proceed
                    // onLoginSuccess(false); // To be implemented when Retailer Dashboard is ready
                    Alert.alert('Info', 'Retailer Dashboard is under construction');
                }
            } else {
                Alert.alert('विफल', result.message || 'लॉगिन विफल रहा');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('त्रुटि', 'नेटवर्क समस्या। कृपया पुनः प्रयास करें।');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ParticleBackground>
            <BackButton onPress={onBack} />
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Animated.View
                        style={[
                            styles.container,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { scale: scaleAnim },
                                    { translateY: slideAnim }
                                ]
                            }
                        ]}
                    >
                        {/* Logo and Header */}
                        <View style={styles.header}>
                            <LogoPlaceholder size={100} />
                            <Text style={styles.title}>दुकानदार लॉगिन</Text>
                            <Text style={styles.subtitle}>
                                अपने खाते में प्रवेश करें
                            </Text>
                        </View>

                        {/* Login Card with Gradient Border */}
                        <View style={styles.cardWrapper}>
                            <LinearGradient
                                colors={GRADIENTS.purple}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.gradientBorder}
                            >
                                <View style={styles.card}>
                                    <Text style={styles.cardTitle}>
                                        लॉगिन विवरण दर्ज करें
                                    </Text>

                                    <Input
                                        label="मोबाइल नंबर / यूजर आईडी"
                                        placeholder="अपना मोबाइल नंबर दर्ज करें"
                                        value={username}
                                        onChangeText={(text) => {
                                            setUsername(text);
                                            if (errors.username) setErrors({ ...errors, username: undefined });
                                        }}
                                        error={errors.username}
                                        required
                                        autoCapitalize="none"
                                    />

                                    <Input
                                        label="पासवर्ड"
                                        placeholder="अपना पासवर्ड दर्ज करें"
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (errors.password) setErrors({ ...errors, password: undefined });
                                        }}
                                        error={errors.password}
                                        required
                                        secureTextEntry
                                    />

                                    <Button
                                        title={loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
                                        onPress={handleLogin}
                                        size="large"
                                        style={styles.loginButton}
                                        disabled={loading}
                                    />

                                    <View style={styles.registerContainer}>
                                        <Text style={styles.registerText}>नया खाता बनाना चाहते हैं? </Text>
                                        <Text
                                            style={styles.registerLink}
                                            onPress={onRegisterClick}
                                        >
                                            यहाँ रजिस्टर करें
                                        </Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ParticleBackground>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        marginTop: SPACING.md,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
        textAlign: 'center',
    },
    cardWrapper: {
        marginBottom: SPACING.xl,
    },
    gradientBorder: {
        borderRadius: 16,
        padding: 3, // Border width
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 13,
        padding: SPACING.xl,
    },
    cardTitle: {
        fontSize: FONT_SIZES.lg,
        fontWeight: FONT_WEIGHTS.semibold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.lg,
        textAlign: 'center',
    },
    loginButton: {
        marginTop: SPACING.md,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.lg,
    },
    registerText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
    },
    registerLink: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.bold,
        textDecorationLine: 'underline',
    },
});

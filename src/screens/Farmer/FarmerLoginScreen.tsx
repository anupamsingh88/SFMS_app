import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Image,
} from 'react-native';
import ParticleBackground from '../../components/ParticleBackground';
import { Button, Card, Input } from '../../components';
import BackButton from '../../components/BackButton';
import {
    COLORS,
    SPACING,
    FONT_SIZES,
    FONT_WEIGHTS,
    HINDI_TEXT,
} from '../../constants';

interface FarmerLoginScreenProps {
    onLogin: (mobileNumber: string, password: string) => void;
    onBack: () => void;
    onForgotPassword?: () => void;
}

export default function FarmerLoginScreen({
    onLogin,
    onBack,
    onForgotPassword,
}: FarmerLoginScreenProps) {
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!mobileNumber.trim()) {
            newErrors.mobileNumber = 'मोबाइल नंबर आवश्यक है';
        } else if (!/^[0-9]{10}$/.test(mobileNumber)) {
            newErrors.mobileNumber = 'मोबाइल नंबर 10 अंकों का होना चाहिए';
        }

        if (!password.trim()) {
            newErrors.password = 'पासवर्ड आवश्यक है';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = () => {
        if (validate()) {
            onLogin(mobileNumber, password);
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
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.farmerImageContainer}>
                                <Image
                                    source={require('../../../assets/tanrica-farmer-9911436_1920.png')}
                                    style={styles.farmerImage}
                                    resizeMode="contain"
                                />
                            </View>
                            <Text style={styles.title}>किसान लॉगिन</Text>
                            <Text style={styles.subtitle}>
                                अपने मोबाइल नंबर और पासवर्ड से लॉगिन करें
                            </Text>
                        </View>

                        {/* Login Form */}
                        <Card style={styles.formCard}>
                            <Input
                                label={HINDI_TEXT.mobileNumber}
                                placeholder="10 अंक का मोबाइल नंबर"
                                value={mobileNumber}
                                onChangeText={(value) => {
                                    setMobileNumber(value);
                                    if (errors.mobileNumber) {
                                        setErrors((prev) => ({ ...prev, mobileNumber: '' }));
                                    }
                                }}
                                keyboardType="phone-pad"
                                maxLength={10}
                                error={errors.mobileNumber}
                                required
                                icon={<Text style={styles.inputIcon}>📱</Text>}
                            />

                            <Input
                                label={HINDI_TEXT.password}
                                placeholder="पासवर्ड दर्ज करें"
                                value={password}
                                onChangeText={(value) => {
                                    setPassword(value);
                                    if (errors.password) {
                                        setErrors((prev) => ({ ...prev, password: '' }));
                                    }
                                }}
                                secureTextEntry
                                error={errors.password}
                                required
                                icon={<Text style={styles.inputIcon}>🔒</Text>}
                            />

                            {onForgotPassword && (
                                <TouchableOpacity
                                    onPress={onForgotPassword}
                                    style={styles.forgotPassword}
                                >
                                    <Text style={styles.forgotPasswordText}>
                                        पासवर्ड भूल गए?
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <Button
                                title={HINDI_TEXT.login}
                                onPress={handleLogin}
                                size="large"
                                style={styles.loginButton}
                            />
                        </Card>

                        {/* Helper Text */}
                        <View style={styles.helperContainer}>
                            <Text style={styles.helperText}>
                                💡 पहली बार उपयोग कर रहे हैं?
                            </Text>
                            <Text style={styles.helperText}>
                                कृपया पहले पंजीकरण करें
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </ParticleBackground>
    );
}

const styles = StyleSheet.create({
    farmerImageContainer: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: COLORS.white,
        borderWidth: 4,
        borderColor: COLORS.primary,
        marginBottom: SPACING.md,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    farmerImage: {
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: SPACING.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.primary,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    subtitle: {
        fontSize: FONT_SIZES.md,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    formCard: {
        marginBottom: SPACING.xl,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: -SPACING.sm,
        marginBottom: SPACING.lg,
    },
    forgotPasswordText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        textDecorationLine: 'underline',
    },
    loginButton: {
        marginTop: SPACING.md,
    },
    helperContainer: {
        marginTop: SPACING.xl,
        alignItems: 'center',
    },
    helperText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xs,
    },
    inputIcon: {
        fontSize: 20,
    },
});

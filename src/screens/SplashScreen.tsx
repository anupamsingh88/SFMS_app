import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LogoPlaceholder from '../components/LogoPlaceholder';
import { COLORS, GRADIENTS } from '../constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps { // existing interface
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Animation Sequence
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Hold for a moment then finish
            setTimeout(() => {
                onFinish();
            }, 2500); // Increased duration slightly to read text
        });
    }, [onFinish, scaleAnim, opacityAnim]);

    return (
        <LinearGradient
            colors={GRADIENTS.purple as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }], alignItems: 'center', width: '90%' }}>
                    <LogoPlaceholder size={250} />

                    <Text style={styles.mainTitle}>Uttar Pradesh State Fertilizer Management</Text>
                    <Text style={styles.subTitle}>Government of Uttar Pradesh</Text>

                    <View style={styles.spacer} />

                    <Text style={styles.welcomeText}>Welcome to Fertilizer Distribution System</Text>
                </Animated.View>

                <Animated.View style={{ position: 'absolute', bottom: 50, opacity: opacityAnim }}>
                    <Text style={styles.footerText}>Sanghe Shakti Sarvada</Text>
                </Animated.View>
            </View>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    mainTitle: {
        fontSize: 30,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 8,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 20,
    },
    spacer: {
        height: 40,
    },
    welcomeText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        letterSpacing: 1,
    },
});

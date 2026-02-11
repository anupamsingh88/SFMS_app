import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LogoPlaceholder from '../components/LogoPlaceholder';
import { COLORS, GRADIENTS } from '../constants';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
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
            }, 1500);
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
                <Animated.View style={{ opacity: opacityAnim, transform: [{ scale: scaleAnim }] }}>
                    <LogoPlaceholder size={250} />
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
    },
});

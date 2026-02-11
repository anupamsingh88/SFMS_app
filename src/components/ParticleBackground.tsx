import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');
const PARTICLE_COUNT = 20;

// Generate random particles starting from bottom
const particles = Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
    id: i,
    x: Math.random() * width,
    y: height + Math.random() * 100, // Start from bottom, slightly below screen
    radius: Math.random() * 4 + 2,
    opacity: Math.random() * 0.5 + 0.1,
    duration: Math.random() * 5000 + 8000, // Slightly longer for smoother feel
}));

interface ParticleBackgroundProps {
    children?: React.ReactNode;
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ children }) => {
    const animations = useRef(particles.map(() => new Animated.Value(0))).current;

    useEffect(() => {
        const createAnimation = (index: number) => {
            return Animated.loop(
                Animated.timing(animations[index], {
                    toValue: 1,
                    duration: particles[index].duration,
                    easing: Easing.inOut(Easing.ease), // Smooth easing instead of linear
                    useNativeDriver: true,
                })
            );
        };

        animations.forEach((anim, index) => {
            createAnimation(index).start();
        });
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#FFF3E0', '#FFE0B2', '#FFCC80']} // Original warm/golden gradient
                style={styles.background}
            >
                <Svg height={height} width={width} style={styles.svg}>
                    {particles.map((p, i) => {
                        const translateY = animations[i].interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -(height + 200)], // Move from bottom to top of screen
                        });

                        const translateX = animations[i].interpolate({
                            inputRange: [0, 0.5, 1],
                            outputRange: [0, Math.sin(i) * 30, 0], // Gentle wiggle
                        });

                        const opacity = animations[i].interpolate({
                            inputRange: [0, 0.1, 0.9, 1],
                            outputRange: [p.opacity, p.opacity, p.opacity, 0], // Fade out at end
                        });

                        const AnimatedG = Animated.createAnimatedComponent(require('react-native-svg').G);
                        const AnimatedCircle = Animated.createAnimatedComponent(Circle);

                        return (
                            <AnimatedG
                                key={p.id}
                                style={{
                                    transform: [
                                        { translateY },
                                        { translateX }
                                    ]
                                }}
                            >
                                <AnimatedCircle
                                    cx={p.x}
                                    cy={p.y}
                                    r={p.radius}
                                    fill={COLORS.primary}
                                    opacity={opacity}
                                />
                            </AnimatedG>
                        );
                    })}
                </Svg>
            </LinearGradient>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    svg: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default ParticleBackground;

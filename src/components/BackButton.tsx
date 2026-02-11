import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, SHADOWS, SPACING } from '../constants';

interface BackButtonProps {
    onPress: () => void;
}

const BackButton = ({ onPress }: BackButtonProps) => {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <Path
                    d="M15 18L9 12L15 6"
                    stroke={COLORS.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </Svg>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: SPACING.lg,
        left: SPACING.md,
        width: 44,
        height: 44,
        backgroundColor: COLORS.white,
        borderRadius: 22, // Circle
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it's on top
        ...SHADOWS.medium,
    },
});

export default BackButton;

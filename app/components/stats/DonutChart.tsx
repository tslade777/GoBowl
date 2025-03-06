import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
  useDerivedValue,
} from "react-native-reanimated";

interface DonutChartProps {
  percentage: number; // Percentage (0 - 100)
  size?: number; // Adjustable chart size
  strokeWidthFactor?: number; // Stroke width as a fraction of size
  color?: string; // Progress color
  backgroundColor?: string; // Background ring color
  duration?: number; // Animation duration in milliseconds
  title?: string; // Custom text above the circle
  titleColor?: string; // Custom color for the title
}

// Wrap Circle with an Animated version for animation
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

const DonutChart: React.FC<DonutChartProps> = ({
  percentage,
  size = 200,
  strokeWidthFactor = 0.1,
  color = "#57FFFF",
  backgroundColor = "#161622",
  duration = 1000,
  title = "", // Default to empty if no title is provided
  titleColor = "#57FFFF", // Default title color
}) => {
  const strokeWidth = size * strokeWidthFactor;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Animated shared value
  const animatedPercentage = useSharedValue(0);

  // Animate progress bar
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      circumference - (animatedPercentage.value / 100) * circumference,
  }));

  // Derived value for text animation (avoids direct `value` access in render)
  const animatedText = useDerivedValue(() => {
    return `${Math.round(animatedPercentage.value)}%`;
  });

  // Start animation when percentage changes
  useEffect(() => {
    animatedPercentage.value = withTiming(percentage, {
      duration: duration,
      easing: Easing.out(Easing.exp),
    });
  }, [percentage]);

  return (
    <View className="relative flex items-center mt-10  justify-center">
      {/* Title Above Circle */}
      {title ? (
        <Text
          style={{
            position: "absolute",
            top: -size * 0.24, // Adjusts the position above the circle
            fontSize: size * 0.15, // Scales with size
            fontWeight: "600",
            color: titleColor,
          }}
        >
          {title}
        </Text>
      ) : null}

      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          animatedProps={animatedProps} // Apply animation
          transform={`rotate(-90, ${size / 2}, ${size / 2})`} // Starts from the top
        />
      </Svg>
      {/* Animated Percentage Text */}
      <AnimatedText
        style={{
          position: "absolute",
          fontSize: size * 0.2,
          fontWeight: "bold",
          color: color,
        }}
      >
        {isNaN(Math.round(percentage)) ? '--' : Math.round(percentage)+''}%
      </AnimatedText>
    </View>
  );
};

export default DonutChart;

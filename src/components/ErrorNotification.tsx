import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

interface ErrorNotificationProps {
  message: string | null;
}

export const ErrorNotification = ({ message }: ErrorNotificationProps) => {
  const [activeMessage, setActiveMessage] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (message && message !== activeMessage) {
      setActiveMessage(message);
      setShowNotification(true);

      Animated.timing(animationValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animationValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShowNotification(false);
        }
      });
    }
  }, [message]);

  if (!showNotification) return null;

  return (
    <Animated.View
      style={[
        styles.errorContainer,
        {
          opacity: animationValue,
        },
      ]}
    >
      <Text style={styles.errorText}>{activeMessage}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    backgroundColor: '#ff4d4f',
    padding: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
  },
});

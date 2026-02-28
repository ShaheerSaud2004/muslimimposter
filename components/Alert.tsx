import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  ViewStyle,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './Card';
import { Button } from './Button';
import { typography, spacing } from '../theme';
import * as Haptics from 'expo-haptics';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  title: string;
  message: string;
  buttons?: AlertButton[];
};

let alertQueue: AlertOptions[] = [];
let currentAlert: AlertOptions | null = null;
let setAlertState: ((alert: AlertOptions | null) => void) | null = null;

export const showAlert = (options: AlertOptions) => {
  if (setAlertState) {
    setAlertState(options);
  } else {
    alertQueue.push(options);
  }
};

export const Alert: React.FC = () => {
  const { colors } = useTheme();
  const [alert, setAlert] = useState<AlertOptions | null>(null);

  useEffect(() => {
    setAlertState = setAlert;
    // Process any queued alerts
    if (alertQueue.length > 0) {
      setAlert(alertQueue.shift() || null);
    }
  }, []);

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAlert(null);
    // Process next alert in queue if any
    if (alertQueue.length > 0) {
      setTimeout(() => {
        setAlert(alertQueue.shift() || null);
      }, 200);
    }
  };

  const handleButtonPress = (button: AlertButton) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleClose();
    if (button.onPress) {
      setTimeout(() => button.onPress!(), 100);
    }
  };

  if (!alert) return null;

  // Default buttons if none provided
  const buttons = alert.buttons || [
    {
      text: 'OK',
      style: 'default',
      onPress: handleClose,
    },
  ];

  return (
    <Modal
      visible={!!alert}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <Pressable
        style={styles.overlay}
        onPress={handleClose}
      >
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
        >
          <Card
            style={[
              styles.alertCard,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.border,
                shadowColor: colors.shadow,
              },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.alertContent}>
              <Text
                style={[
                  styles.alertTitle,
                  { color: colors.text },
                ]}
              >
                {alert.title}
              </Text>
              <ScrollView
                style={styles.messageContainer}
                showsVerticalScrollIndicator={false}
              >
                <Text
                  style={[
                    styles.alertMessage,
                    { color: colors.textSecondary },
                  ]}
                >
                  {alert.message}
                </Text>
              </ScrollView>
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => {
                  const isCancel = button.style === 'cancel';
                  const isDestructive = button.style === 'destructive';
                  
                  return (
                    <View
                      key={index}
                      style={[
                        styles.buttonWrapper,
                        buttons.length > 1 && index < buttons.length - 1 && styles.buttonSpacing,
                      ]}
                    >
                      <Button
                        title={button.text}
                        onPress={() => handleButtonPress(button)}
                        variant={isCancel ? 'secondary' : 'primary'}
                        style={{
                          ...styles.alertButton,
                          ...(isDestructive ? {
                            backgroundColor: colors.imposter,
                            borderColor: colors.imposter,
                          } : {}),
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          </Card>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  alertCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
  },
  alertContent: {
    width: '100%',
  },
  alertTitle: {
    ...typography.heading,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  messageContainer: {
    maxHeight: 200,
    marginBottom: spacing.lg,
  },
  alertMessage: {
    ...typography.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  buttonWrapper: {
    flex: 1,
    minWidth: 0,
  },
  buttonSpacing: {
    marginRight: spacing.xs,
  },
  alertButton: {
    minHeight: 48,
  },
});

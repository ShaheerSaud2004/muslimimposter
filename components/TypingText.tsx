import React, { useState, useEffect, useRef } from 'react';
import { Text, TextProps } from 'react-native';

type TypingTextProps = TextProps & {
  text: string;
  delayPerChar?: number;
  onComplete?: () => void;
};

/**
 * Reveals text character by character (typing effect).
 */
export function TypingText({
  text,
  delayPerChar = 45,
  onComplete,
  style,
  ...rest
}: TypingTextProps) {
  const [visibleLength, setVisibleLength] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!text) {
      setVisibleLength(0);
      return;
    }
    setVisibleLength(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisibleLength(i);
      if (i >= text.length) {
        clearInterval(id);
        onCompleteRef.current?.();
      }
    }, delayPerChar);
    return () => clearInterval(id);
  }, [text, delayPerChar]);

  const visible = text.slice(0, visibleLength);

  return (
    <Text style={style} {...rest}>
      {visible}
    </Text>
  );
}

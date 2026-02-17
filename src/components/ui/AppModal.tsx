import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";

type Props = {
  visible: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;

  headerRight?: React.ReactNode;

  // sizing
  width?: ViewStyle["width"];
  maxWidth?: number;
  containerStyle?: ViewStyle;

  // when true: body scrolls, footer stays visible
  scroll?: boolean;
};

// Generic app modal/dialog component.
// Has backdrop, title, body, optional footer.
// Can optionally have scrollable body content.
export function AppModal({
  visible,
  title,
  onClose,
  children,
  footer,
  headerRight,
  width = "100%",
  maxWidth = 720,
  containerStyle,
  scroll = false,
}: Props) {
  const { height } = useWindowDimensions();

  // default: centered dialog, but never taller than screen.
  const maxH = Math.round(height * 0.88);
  const fixedH = scroll ? maxH : undefined;

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        {/* Backdrop press closes */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* Sheet on top */}
        <View style={[styles.sheet, { width, maxWidth, maxHeight: maxH, height: fixedH }, containerStyle]}>
          {(title || headerRight) ? (
            <View style={styles.header}>
              {title ? (
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                  {title}
                </Text>
              ) : (
                <View style={{ flex: 1 }} />
              )}

              {headerRight ? <View style={styles.headerRight}>{headerRight}</View> : null}
            </View>
          ) : null}

          {scroll ? (
            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.body}>{children}</View>
          )}

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden",
  },
  body: {
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  footer: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  headerRight: {
    /* width: 44, */
    justifyContent: "center",
    alignItems: "flex-end"
  },
  title: {
    flex: 1,
    textAlign: "left",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
});

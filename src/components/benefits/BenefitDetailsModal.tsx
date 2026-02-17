import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { AppModal } from "../ui/AppModal";
import type { Benefit } from "../../types/benefit";
import MoreButton from "@/src/components/ui/MoreButton";

type Props = {
  visible: boolean;
  benefit: Benefit | null;
  onClose: () => void;

  canEdit?: boolean;
  onMorePress?: () => void;
};

// Details modal shows full description.
// Uses asset metadata to keep image aspect ratio consistent across platforms.
export function BenefitDetailsModal({
  visible,
  benefit,
  onClose,
  canEdit = false,
  onMorePress,
}: Props) {

  if (!benefit) return null;

  const showMore = canEdit && !!onMorePress;

  return (
    <AppModal
      visible={visible}
      title={benefit.title}
      onClose={onClose}
      scroll
      headerRight={
        showMore ? (
          <Pressable onPress={onMorePress} hitSlop={12}>
            <MoreButton />
          </Pressable>
        ) : null
      }
      footer={
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onClose}>
          <Text style={styles.btnPrimaryText}>Sulje</Text>
        </Pressable>
      }
    >
      {/* Scrollable content for long descriptions */}
      <Image source={benefit.image} resizeMode="contain" style={styles.hero} />
      <Text style={styles.desc}>{benefit.description}</Text>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 12,
  },
  desc: {
    fontSize: 16,
    lineHeight: 22,
  },
  btn: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btnPrimary: {
    backgroundColor: "#111",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
  },
});


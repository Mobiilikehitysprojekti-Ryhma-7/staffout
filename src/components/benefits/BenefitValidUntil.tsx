import React, { useMemo, useState } from "react";
import { Modal, Platform, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import DateTimePicker, { DateTimePickerEvent, DateTimePickerAndroid } from "@react-native-community/datetimepicker";

type Props = {
  value: Date | null;
  onChange: (next: Date | null) => void;

  // Minimum allowed date 
  minimumDate?: Date;

  // Placeholder
  placeholder?: string;

  // Sheet title (iOS)
  title?: string;

  // Field style
  fieldStyle?: StyleProp<ViewStyle>;

  //Text style
  textStyle?: StyleProp<TextStyle>;
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

// Display format dd.MM.yyyy "klo" HH:mm
function formatFi(d: Date) {
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} klo ${pad2(
    d.getHours()
  )}:${pad2(d.getMinutes())}`;
}

// Merge date and time
function mergeDateAndTime(datePart: Date, timePart: Date) {
  const merged = new Date(datePart);
  merged.setHours(timePart.getHours(), timePart.getMinutes(), 0, 0);
  return merged;
}

export function BenefitValidUntil({
  value,
  onChange,
  minimumDate = new Date(),
  placeholder = "Valitse päivämäärä ja aika",
  title = "Valitse voimassaolo",
  fieldStyle,
  textStyle,
}: Props) {
  const isEmpty = !value;

  // iOS sheet state
  const [iosOpen, setIosOpen] = useState(false);
  const [iosStep, setIosStep] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date>(value ?? new Date());
  const [tempTime, setTempTime] = useState<Date>(value ?? new Date());

  const displayText = useMemo(() => (value ? formatFi(value) : placeholder), [value, placeholder]);

// Open picker (Android = dialogs / iOS = sheet)
  const open = () => {
    if (Platform.OS === "android") {
      openAndroidFlow();
    } else {
      openIosSheet();
    }
  };

  const openAndroidFlow = () => {
    const original = value;
    const base = value ?? new Date();

    DateTimePickerAndroid.open({
      value: base,
      mode: "date",
      minimumDate,
      onChange: (event: DateTimePickerEvent, selectedDate?: Date) => {
        // cancelled -> no changes
        if (event.type !== "set" || !selectedDate) return;

        // keep previous time while moving to time step
        const dateWithOldTime = mergeDateAndTime(selectedDate, base);

        DateTimePickerAndroid.open({
          value: dateWithOldTime,
          mode: "time",
          is24Hour: true,
          onChange: (event2: DateTimePickerEvent, selectedTime?: Date) => {
            // if time step is canceled -> keep original time
            if (event2.type !== "set" || !selectedTime) {
              onChange(original ?? null);
              return;
            }

            const merged = mergeDateAndTime(selectedDate, selectedTime);
            onChange(merged < minimumDate ? minimumDate : merged);
          },
        });
      },
    });
  };

  // iOS Sheet
  const openIosSheet = () => {
    const base = value ?? new Date();
    setTempDate(base);
    setTempTime(base);
    setIosStep("date");
    setIosOpen(true);
  };

  // iOS Update tempDate / tempTime based on step
  const onIosPickerChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (!selected) return;
    if (iosStep === "date") setTempDate(selected);
    else setTempTime(selected);
  };

  // iOS Cancel
  const cancelIos = () => {
    setIosOpen(false);
  };
  
  // iOS Next or Done
  const nextOrDoneIos = () => {
    if (iosStep === "date") {
      setIosStep("time");
      return;
    }
    const merged = mergeDateAndTime(tempDate, tempTime);
    onChange(merged < minimumDate ? minimumDate : merged);
    setIosOpen(false);
  };

  const clear = () => onChange(null);

  return (
    <>
      {/* input field and clear + chevron. */}
      <View style={[styles.field, fieldStyle]}>
        <Pressable style={styles.fieldPressArea} onPress={open}>
          <Text
            style={[styles.fieldText, isEmpty && styles.placeholderText, textStyle]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayText}
          </Text>
        </Pressable>
        <View style={styles.rightActions}>
          {!isEmpty && (
            <Pressable onPress={clear} hitSlop={10} style={styles.clearBtn}>
              <Text style={styles.clearText}>✕</Text>
            </Pressable>
          )}
          <Text style={styles.chevron}>›</Text>
        </View>
      </View>

      {/* iOS sheet */}
      {Platform.OS === "ios" && (
        <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={cancelIos}>
          <Pressable style={styles.backdrop} onPress={cancelIos} />

          <View style={styles.sheetWrap}>
            <View style={styles.sheet}>
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <Pressable onPress={cancelIos} style={styles.closeBtn}>
                  <Text style={styles.closeText}>Peruuta</Text>
                </Pressable>
              </View>

              <Text style={styles.stepLabel}>
                {iosStep === "date" ? "Valitse päivämäärä" : "Valitse kellonaika"}
              </Text>

              {/* iOS show only ONE picker at a time (date / time) */}
              <DateTimePicker
                value={iosStep === "date" ? tempDate : tempTime}
                mode={iosStep}
                is24Hour
                minimumDate={iosStep === "date" ? minimumDate : undefined}
                display="spinner"
                onChange={onIosPickerChange}
              />

              <Pressable onPress={nextOrDoneIos} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>
                  {iosStep === "date" ? "Seuraava: aika" : "Valmis"}
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: {
    alignSelf: "stretch",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,

    flexDirection: "row",
    alignItems: "center",
  },
  fieldPressArea: {
    flex: 1,
  },
  fieldText: {
    fontSize: 14,
  },
  placeholderText: {
    color: "#999",
  },
  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 10,
  },
  clearBtn: {
    paddingHorizontal: 2,
    paddingVertical: 2,
  },
  clearText: {
    fontSize: 14,
    color: "#666",
  },
  chevron: {
    fontSize: 20,
    color: "#333",
    marginTop: -2,
  },

  // iOS sheet
  backdrop: {
    flex: 1,
  },
  sheetWrap: {
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  closeText: {
    fontSize: 14,
  },
  stepLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  primaryBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  primaryBtnText: {
    fontSize: 14,
  },
});

import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

type Props = {
  useGps: boolean;
  onToggleUseGps: (value: boolean) => void;
  gpsLoading: boolean;
  gpsError: string | null;

  // optional
  showRefresh?: boolean;
  showSwitch?: boolean;
  onRefresh?: () => void;
  refreshDisabled?: boolean;
};

export function LocationOpt({
  useGps,
  onToggleUseGps,
  gpsLoading,
  gpsError,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.locationRow}>

        <Text>Käytä sijaintia</Text>
        <Switch
          value={useGps}
          onValueChange={onToggleUseGps}
          disabled={gpsLoading}
        />
      </View>

      {gpsLoading ? <Text>Haetaan sijaintia…</Text> : null}
      {gpsError ? <Text style={{ color: "red" }}>{gpsError}</Text> : null}

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    gap: 0
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1.5,
  },
  locationColumn: {
    flexDirection: 'column',
  }
});

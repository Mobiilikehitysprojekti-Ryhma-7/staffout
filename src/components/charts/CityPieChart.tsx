import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useUserProfile } from "@/src/hooks/useUserProfile";
import { useOrganizationUsers } from "@/src/hooks/useOrganizationUsers";
import { CHART_PALETTE } from "@/src/constants/chartColors";
import type { CityStat } from "@/src/types/cityStats";
import { CityPieLegend } from "./cityPieChartLegend/CityPieLegend";
import { PRESET_CITIES } from "@/src/constants/cities";
import { buildPresetCityMap, buildChartCityBuckets } from "@/src/utils/cityBucket";
import { typography } from "@/src/styles/regularStyles";

export default function CityPieChart() {

    // Get org users and count them by city, then prepare data for the pie chart and legend.
    const { user } = useUserProfile();
    const orgId = user?.organizationId;

    // Responsive sizing based on screen width and content padding.
    const { width } = useWindowDimensions();
    const contentWidth = width - 40;

    // Chart radius and label sizes scale with available width.
    const radius = Math.floor(Math.min(170, contentWidth * 0.38));
    const innerRadius = Math.floor(radius * 0.6);
    const centerLabelFontSize = Math.max(10, Math.floor(radius * 0.22));

    // Load organization users (with loading state + reload helper)
    const { users, loading, reload } = useOrganizationUsers(orgId);

    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const presetMap = useMemo(() => buildPresetCityMap(PRESET_CITIES), []);

    useFocusEffect(
        useCallback(() => {
            reload();
        }, [reload])
    );

    // Build chart buckets (preset + promoted custom cities + "Muu" category) and compute totals
    const { stats, total } = useMemo(() => {
        const { finalEntries, total } = buildChartCityBuckets(users ?? [], presetMap, {
            minCustomCount: 2,
            maxCities: 6,
        });

        const stats: CityStat[] = finalEntries.map(([city, count], idx) => ({
            city,
            count,
            percent: total > 0 ? Math.round((count / total) * 100) : 0,
            color: CHART_PALETTE[idx % CHART_PALETTE.length],
        }));

        return { stats, total };
    }, [users, presetMap]);


    // Pick a default selection when data arrives
    useEffect(() => {
        if (!selectedCity && stats.length > 0) setSelectedCity(stats[0].city);
        // If the selected city is no longer in the stats (e.g. data changed), pick a new one
        if (selectedCity && stats.length > 0 && !stats.some((s) => s.city === selectedCity)) {
            setSelectedCity(stats[0].city);
        }
    }, [stats, selectedCity]);

    // Find the currently selected city's stats for displaying in the center label
    const selected = useMemo(
        () => stats.find((s) => s.city === selectedCity) ?? null,
        [stats, selectedCity]
    );

    // Prepare data for the pie chart, marking the selected city as focused
    const pieData = useMemo(
        () =>
        stats.map((s) => ({
            value: s.count,          // slice size
            color: s.color,
            text: s.city,            // used in onPress payload / labels
            focused: s.city === selectedCity,
        })),
        [stats, selectedCity]
    );

    if (!orgId) return null;

    return (
    <View style={styles.wrap}>
        <Text style={styles.title}>Tilastot</Text>

        {/* Show the pie chart and legend */}
        <View style={[styles.container, { width: contentWidth }]}>
            {loading ? (
                <Text style={styles.meta}>Ladataan...</Text>
            ) : total === 0 ? (
                <Text style={styles.meta}>Ei dataa</Text>
            ) : (
            <>
                <View style={styles.chartWrap}>
                    <PieChart
                        data={pieData as any}
                        donut
                        radius={radius}
                        innerRadius={innerRadius}
                        innerCircleColor="#fff"
                        sectionAutoFocus
                        focusOnPress
                        toggleFocusOnPress={false}
                        onPress={(item: any) => {
                            const city = typeof item?.text === "string" ? item.text : null;
                            if (city) setSelectedCity(city);
                        }}
                        centerLabelComponent={() => (
                            <View style={{ alignItems: "center" }}>
                                <Text style={[styles.centerBig, { fontSize: centerLabelFontSize }]}>
                                    {selected ? `${selected.percent}%` : ""}
                                </Text>
                                <Text
                                    style={[styles.centerSmall, { fontSize: centerLabelFontSize * 0.7 }]}
                                    numberOfLines={1}
                                >
                                    {selected ? selected.city : ""}
                                </Text>
                                <Text style={[styles.centerSmallMuted, { fontSize: centerLabelFontSize * 0.6 }]}>
                                    {selected ? `Työkavereita ${selected.count}` : ""}
                                </Text>
                            </View>
                        )}
                    />
                </View>

                <CityPieLegend
                    stats={stats}
                    selectedCity={selectedCity}
                    onSelectCity={setSelectedCity}
                />
            </>
            )}
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    wrap: {
        marginTop: 18,
        paddingVertical: 8
    },
    title: {
        ...typography.title
    },
    centerBig: {
        fontSize: 22,
        fontWeight: "800"
    },
    centerSmall: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: "700"
    },
    centerSmallMuted: {
        marginTop: 2,
        fontSize: 12,
        color: "#666"
    },
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    chartWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    meta: {
        marginTop: 10,
        color: "#666"
    },
});

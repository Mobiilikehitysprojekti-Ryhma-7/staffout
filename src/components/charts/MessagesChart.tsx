import React, { useCallback, useMemo, useState } from 'react'
import { LineChart } from "react-native-gifted-charts"
import { getAllUserMessages } from '@/src/services/chat/messages.service';
import { useFocusEffect } from 'expo-router';

export default function MessagesChart() {
    const [messages, setMessages] = useState<any[]>([]);

   useFocusEffect(
        useCallback(() => {
            fetchMessages();
        }, [])
    );

    async function fetchMessages() {
        const messages = await getAllUserMessages();
        setMessages(messages || []);
    }

    // Count messages of the day for the current month
    const countDuplicates = (messages: any[]): Record<string, number> => {

        const counts: Record<string, number> = {};
        messages.forEach((value: any) => {
            if (value.createdAt.toDate().getMonth() === new Date().getMonth() && value.createdAt.toDate().getFullYear() === new Date().getFullYear()) {
                
                if (!counts[value.createdAt.toDate().getDate()]) {
                    counts[value.createdAt.toDate().getDate()] = 1;
                } else {
                    counts[value.createdAt.toDate().getDate()]++;
                }
            }
        });
        return counts;
    };

    const result = useMemo(() => countDuplicates(messages), [messages]);

    const barData = Array.from({ length: new Date().getDate() }, (_, i) => ({
        value: result[i + 1] || 0,
        label: (i + 1) % 3 === 0 ? (i + 1).toString() : '',
    }));

    return (
        <LineChart
            areaChart
            data={barData}
            height={250}
            initialSpacing={0}
            spacing={15}
            color1="skyblue"
            textColor1="green"
            hideDataPoints
            dataPointsColor1="blue"
            startFillColor1="skyblue"
            startOpacity={0.8}
            endOpacity={0.3}
            xAxisLabelTextStyle={{ marginHorizontal: -5}}
        />
    )
}
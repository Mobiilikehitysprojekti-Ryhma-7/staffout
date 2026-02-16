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
    
const rangeDays = 30;
const today = new Date();
const priorDate = new Date(today);
priorDate.setHours(0, 0, 0, 0);
priorDate.setDate(today.getDate() - (rangeDays - 1));


    // Count messages of the day for the current month
    const countDuplicates = (messages: any[]): Record<string, number> => {

        const counts: Record<string, number> = {};
        messages.forEach((value: any) => {
            const messageDate = value.createdAt.toDate();
            if (messageDate >= priorDate) {
                const dateKey = `${messageDate.getDate()}-${messageDate.getMonth() + 1}`;
                
                if (!counts[dateKey]) {
                    counts[dateKey] = 1;
                } else {
                    counts[dateKey]++;
                }
            }
        });
        console.log(counts)
        return counts;
    };

    const result = useMemo(() => countDuplicates(messages), [messages]);

    const barData = Array.from({ length: rangeDays }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (rangeDays - 1) + i);
        return {
            value: result[`${date.getDate()}-${date.getMonth() + 1}`] || 0,
            label: `${date.getDate()}-${date.getMonth() + 1}`
        };
    });



    return (
        <LineChart
            areaChart
            data={barData}
            height={250}
            initialSpacing={20}
            spacing={40}
            scrollToEnd
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
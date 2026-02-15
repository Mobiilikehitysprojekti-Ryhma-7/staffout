import React from "react";
import { Modal, View, Text, Button, StyleSheet } from "react-native";


export default function EventDetailsModal({ visible, event, onClose }) {
  if (!event) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.description}>{event.description}</Text>
          {event.location && (
            <Text style={styles.location}>📍 {event.location}</Text>
          )}
          <Text style={styles.date}>
            📅 {event.eventDate?.toDate ? event.eventDate.toDate().toLocaleString() : event.eventDate}
          </Text>
          <Text style={styles.participants}>
            👥 {event.participants?.length || 0}
          </Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    minWidth: 300,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  participants: {
    fontSize: 14,
    marginBottom: 16,
  },
});

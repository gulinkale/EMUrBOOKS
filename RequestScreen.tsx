import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function RequestScreen() {
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([]);
  const [swapRequests, setSwapRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = auth().currentUser;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!currentUser) return;

      try {
        const userID = await getUserID(currentUser.email);

        // Satın alma isteklerini getir
        const purchaseSnapshot = await firestore()
          .collection('purchaseRequests')
          .where('buyerID', '==', userID)
          .get();

        const purchases = purchaseSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'purchase',
          ...doc.data(),
        }));

        // Takas isteklerini getir
        const swapSnapshot = await firestore()
          .collection('swapRequests')
          .where('fromUserID', '==', userID)
          .get();

        const swaps = swapSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'swap',
          ...doc.data(),
        }));

        setPurchaseRequests(purchases);
        setSwapRequests(swaps);
        setLoading(false);
      } catch (error) {
        console.error('Request verileri alınamadı:', error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const getUserID = async (email: string | null) => {
    const snapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return data.userID;
    }

    return null;
  };

  const deleteRequest = async (id: string, type: 'purchase' | 'swap') => {
    try {
      const ref = firestore().collection(
        type === 'purchase' ? 'purchaseRequests' : 'swapRequests'
      );
      await ref.doc(id).delete();
      Alert.alert('Success', 'Request deleted');

      // Ekranı güncelle
      if (type === 'purchase') {
        setPurchaseRequests(prev => prev.filter(item => item.id !== id));
      } else {
        setSwapRequests(prev => prev.filter(item => item.id !== id));
      }
    } catch (error) {
      Alert.alert('Error', 'Could not delete request');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading requests...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Your Book Requests</Text>

      {/* Satın alma istekleri */}
      {purchaseRequests.map((req, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>Purchase Request</Text>
          <Text>Book ID: {req.bookID}</Text>
          <Text>Status: {req.status}</Text>
          <TouchableOpacity
            onPress={() => deleteRequest(req.id, 'purchase')}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* Takas istekleri */}
      {swapRequests.map((req, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.label}>Swap Request</Text>
          <Text>Offered Book ID: {req.offeredBookID}</Text>
          <Text>Requested Book ID: {req.requestedBookID}</Text>
          <Text>Status: {req.status}</Text>
          <TouchableOpacity
            onPress={() => deleteRequest(req.id, 'swap')}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      {purchaseRequests.length === 0 && swapRequests.length === 0 && (
        <Text style={styles.empty}>You have no active requests.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: '#f0f4f8',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: '#004aad',
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#004aad',
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  empty: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});

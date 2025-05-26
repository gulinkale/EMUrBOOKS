import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function MyBooksScreen({ navigation }: any) {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const currentUser = auth().currentUser;
        if (!currentUser) return;

        const email = currentUser.email;
        const userSnapshot = await firestore()
          .collection('users')
          .where('email', '==', email)
          .get();

        if (userSnapshot.empty) return;

        const userData = userSnapshot.docs[0].data();
        const userID = userData.userID;

        const bookSnapshot = await firestore()
          .collection('books')
          .where('ownerID', '==', userID)
          .get();

        const userBooks = bookSnapshot.docs.map(doc => doc.data());
        setBooks(userBooks);
        setLoading(false);
      } catch (error) {
        console.error('İlanlar alınamadı:', error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004aad" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Geri Butonu */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Book Listings</Text>

        {books.length === 0 ? (
          <Text style={styles.empty}>You haven't listed any books yet.</Text>
        ) : (
          books.map((book, index) => (
            <View key={index} style={styles.bookCard}>
              {book.imageUrl && <Image source={{ uri: book.imageUrl }} style={styles.bookImage} />}
              <View style={{ flex: 1 }}>
                <Text style={styles.bookTitle}>{book.title}</Text>
                <Text style={styles.bookInfo}>Writer: {book.author}</Text>
                <Text style={styles.bookInfo}>Price: {book.price} ₺</Text>
              </View>
            </View>
          ))
        )}

        {/* Add Book Butonu */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon!')}
        >
          <Text style={styles.addButtonText}>+ Add Book</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
  },
  backButtonText: {
    color: '#004aad',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004aad',
    marginBottom: 20,
    alignSelf: 'center',
  },
  empty: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'center',
    marginBottom: 20,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    alignItems: 'center',
    gap: 10,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 6,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
  },
  bookInfo: {
    fontSize: 14,
    color: '#444',
  },
  addButton: {
    backgroundColor: '#004aad',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

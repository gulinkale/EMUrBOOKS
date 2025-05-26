import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

interface Book {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

export default function BookHomeScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const snapshot = await firestore().collection('books').get();
        const bookList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Book[];
        setBooks(bookList);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const getUserID = async (email: string | null) => {
    const snapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();

    if (!snapshot.empty) {
      return snapshot.docs[0].data().userID;
    }
    return null;
  };

  const handleBuyRequest = async (book: Book) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const buyerID = await getUserID(currentUser.email);
    const bookRef = await firestore().collection('books').doc(book.id).get();
    const sellerID = bookRef.data()?.ownerID;

    if (!sellerID || !buyerID) {
      Alert.alert('Error', 'Missing user or book owner info.');
      return;
    }

    try {
      await firestore().collection('purchaseRequests').add({
        bookID: book.id,
        buyerID,
        sellerID,
        price: book.price,
        status: 'pending',
      });
      Alert.alert('Success', 'Purchase request sent.');
    } catch (error) {
      console.error('Purchase request error:', error);
      Alert.alert('Error', 'Could not send purchase request.');
    }
  };

  const handleSwapRequest = async (book: Book) => {
    const currentUser = auth().currentUser;
    if (!currentUser) return;

    const fromUserID = await getUserID(currentUser.email);
    const bookRef = await firestore().collection('books').doc(book.id).get();
    const toUserID = bookRef.data()?.ownerID;

    if (!fromUserID || !toUserID) {
      Alert.alert('Error', 'Missing user or book owner info.');
      return;
    }

    const offeredBookID = 'placeholder-book-id';

    try {
      await firestore().collection('swapRequests').add({
        requestedBookID: book.id,
        fromUserID,
        toUserID,
        offeredBookID,
        status: 'pending',
      });
      Alert.alert('Success', 'Swap request sent.');
    } catch (error) {
      console.error('Swap request error:', error);
      Alert.alert('Error', 'Could not send swap request.');
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <View style={styles.bookCard}>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
      )}
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookPrice}>{item.price} ₺</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleBuyRequest(item)}>
            <Text style={styles.actionButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleSwapRequest(item)}>
            <Text style={styles.actionButtonText}>Swap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ❤️ Favori Sayfası Geçiş */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
          <Text style={styles.favoriteIcon}>❤️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.searchLabel}>Search For a Book</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter a book name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <TouchableOpacity style={styles.searchButton}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBook}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f0fe',
    padding: 20,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  searchLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: '#004aad',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bookCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    elevation: 2,
  },
  bookImage: {
    width: 80,
    height: 110,
    borderRadius: 10,
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  bookPrice: {
    fontSize: 16,
    color: '#0057a3',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#004aad',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

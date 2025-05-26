import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function ProfileScreen({ navigation }: any) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const email = currentUser.email;
          const querySnapshot = await firestore()
            .collection('users')
            .where('email', '==', email)
            .get();

          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            setUserData(doc.data());
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Kullanıcı verisi alınamadı:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#004aad" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.center}>
        <Text>Kullanıcı bilgisi bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profil resmi */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('./assets/profile-icon.png')}
          style={styles.avatar}
        />
      </View>

      <Text style={styles.name}>{userData.fullName}</Text>
      <Text style={styles.email}>{userData.email}</Text>

      {/* Boşluk */}
      <View style={styles.spacer} />

      {/* Menü Kartı */}
      <View style={styles.card}>
        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={styles.optionText}>Invite a Friend</Text>
        </TouchableOpacity>

        {/* Kitap İlanlarım Butonu */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate('MyBooks')}
        >
          <Text style={styles.optionText}>My Book Listings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Text style={[styles.optionText, { color: 'red' }]}>Logout</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  avatarWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 3,
    borderColor: '#004aad',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 40,
    marginBottom: 10,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004aad',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  spacer: {
    height: 50,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  option: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
});

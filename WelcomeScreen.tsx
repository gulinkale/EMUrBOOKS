import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      {/* EMU logosu */}
      <View style={styles.logoWrapper}>
        <Image source={require('./assets/logo.png')} style={styles.logo} />
      </View>

      {/* Ortadaki grup (Yazı + Kitap ikon) */}
      <View style={styles.middleContent}>
        <Text style={styles.appName}>EMU R BOOKS</Text>
        <Image source={require('./assets/book-icon.png')} style={styles.bookIcon} />
      </View>

      {/* Butonlar */}
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004aad',
    paddingHorizontal: 30,
    paddingTop: 50,
  },
  logoWrapper: {
    marginTop: 20, // 👈 Logo biraz aşağıdan başlasın
    alignItems: 'center',
  },
  logo: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
  },
  middleContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  bookIcon: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  buttonsWrapper: {
    marginBottom: 40,
    alignItems: 'center',
    gap: 15,
  },
  primaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004aad',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#fff',
    paddingVertical: 14,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

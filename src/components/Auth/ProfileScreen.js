import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.get('https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/profile', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setUserData(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={{ uri: userData.profilePicture }} style={styles.profilePicture} />
      <Text style={styles.userName}>{userData.name}</Text>
   <Text>This app is developed by saurabh kumar</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileScreen;

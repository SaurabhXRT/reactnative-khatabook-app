import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList,StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ShopkeeperScreen = () => {
  const [shopkeepers, setShopkeepers] = useState([]);
  const [newShopkeeper, setNewShopkeeper] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  const formatDate = (isoDate) => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    return new Intl.DateTimeFormat('en-US', options).format(new Date(isoDate));
  };

  const fetchShopkeepers = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.get('https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper', {
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      setShopkeepers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addShopkeeper = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      await axios.post(
        'https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper',
        { name: newShopkeeper },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      fetchShopkeepers();
      setNewShopkeeper('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateList = (shopkeeperId) => {
    navigation.navigate('ListItemScreen', { shopkeeperId });
  };

  const handleDeleteShopkeeper = (shopkeeperId) => {
    Alert.alert(
      'Delete Shopkeeper',
      'Are you sure you want to delete this shopkeeper?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              const storedToken = await AsyncStorage.getItem('token');
              await axios.delete(
                `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/${shopkeeperId}`,
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                  },
                }
              );

              fetchShopkeepers();
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All Shopkeepers</Text>
      <FlatList
        data={shopkeepers}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.shopkeeperContainer}>
            <View style={styles.itemRow}>
            <Text style={styles.shopkeeperName}>{item.name}</Text>
            <Text style={styles.shopkeeperName}>{formatDate(item.createdAt)}</Text>
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleCreateList(item._id)}
              >
                <Text style={styles.buttonText}>Create List</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => handleDeleteShopkeeper(item._id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="New Shopkeeper"
        value={newShopkeeper}
        onChangeText={(text) => setNewShopkeeper(text)}
      />
      <TouchableOpacity
        onPress={addShopkeeper}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add new Shopkeeper</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  shopkeeperContainer: {
    marginBottom: 10,
    borderBottomWidth: 1
  },
  shopkeeperName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5
  },
  button: {
    backgroundColor: 'green',
    padding: 6,
    borderRadius: 5,
    width: '48%', 
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    width: '50%',
    alignSelf: 'center',
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },

});

export default ShopkeeperScreen;

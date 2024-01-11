import React, { useState, useEffect } from 'react';
import { View, Text, TextInput,StyleSheet, ScrollView,TouchableOpacity, Alert, Button, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ListItemScreen = ({ route }) => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [paidPrice, setPaidPrice] = useState(0);
  const [totalPaidPrice, setTotalPaidPrice] = useState(0);
  const [remainingPrice, setRemainingPrice] = useState(0);
  const [shopkeeperName, setShopkeeperName] = useState('');

  const shopkeeperId = route.params.shopkeeperId;

  useEffect(() => {
    fetchShopkeeper();
    fetchItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [items]);

  useEffect(() => {
    fetchPayments();
  }, [totalPrice, totalPaidPrice]);

  const calculateTotalPrice = () => {
    const total = items.reduce((acc, item) => acc + parseFloat(item.price), 0);
    setTotalPrice(total.toFixed(2));
  };

  const fetchShopkeeper = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/${shopkeeperId}/name`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setShopkeeperName(response.data.name);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPayments = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeepers/${shopkeeperId}/payments`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      const totalPaidPrice = response.data.reduce(
        (acc, payment) => acc + parseFloat(payment.paidPrice),
        0
      );
      setTotalPaidPrice(totalPaidPrice.toFixed(2));
      const remaining = totalPrice - parseFloat(totalPaidPrice);
      setRemainingPrice(remaining.toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };

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

  const fetchItems = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/${shopkeeperId}/items`,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setItems(response.data);
      

    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/${shopkeeperId}/items`,
        { itemName, price },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setItems([...items, response.data]);
      setItemName('');
      setPrice('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    Alert.alert(
      'Delete this item',
      'Are you sure you want to delete this item?',
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
                `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeeper/${shopkeeperId}/items/${itemId}`,
                {
                  headers: {
                    Authorization: `Bearer ${storedToken}`,
                  },
                }
              );
              setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
            } catch (error) {
              console.error(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddPayment = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const response = await axios.post(
        `https://nativeshopapp-server-nodejs.vercel.app/api/shopkeepers/${shopkeeperId}/payments`,
        { paidPrice },
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );
      setTotalPaidPrice((prevPaidPrice) => (parseFloat(prevPaidPrice) + parseFloat(response.data.paidPrice)).toFixed(2));
      setRemainingPrice((prevRemaining) => (prevRemaining - parseFloat(response.data.paidPrice)).toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All listitem for {shopkeeperName}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.listItemContainer}>
            <Text>{formatDate(item.createdAt)}</Text>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{item.itemName}</Text>
              <Text style={styles.itemText}>{`Price: ${item.price}`}</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteItem(item._id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={itemName}
          onChangeText={(text) => setItemName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.summaryContainer}>
        <Text style={{fontWeight: 'bold'}}>{`Total Price: ${totalPrice}`}</Text>
        <View style={styles.summaryRow}>
          <TextInput
            style={styles.input}
            placeholder="Paid Price"
            value={paidPrice}
            onChangeText={(text) => setPaidPrice(text)}
            keyboardType="numeric"
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPayment}
          >
            <Text style={styles.buttonText}>Add Payment</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.paidContainer}>
        <Text style={{fontWeight: 'bold'}}>{`Total Paid Price: ${totalPaidPrice}`}</Text>
        <Text style={{fontWeight: 'bold'}}>{`Remaining Price: ${remainingPrice}`}</Text>
        </View>
      </View>
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
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listItemContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    paddingBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5
  },
  summaryContainer: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  paidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default ListItemScreen;

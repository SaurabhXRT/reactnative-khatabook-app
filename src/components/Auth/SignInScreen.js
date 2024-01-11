import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity,  Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      console.log(name);
      const response = await axios.post('https://nativeshopapp-server-nodejs.vercel.app/api/auth/signin', { name, password });
      console.log("api fetched");
      await AsyncStorage.setItem('token', response.data.token);
      navigation.navigate('Home1');
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'Home1' }],  
      // });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.containers}>
     <View style={styles.container}>
      <Text style={styles.text}>Sign In</Text>
      <TextInput style={styles.textinput} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.textinput} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {/* <Button style={styles.button} title="Sign In" onPress={handleSignIn} /> */}
      <TouchableOpacity
          style={styles.button}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    flex: 1,
    justifyContent: 'center'

  },
  container: {
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    margin: 25,
    elevation: 100
   
  },
  text: {
    color: 'black',
    fontSize: 30
  },
  textinput: {
    padding: 2,
    marginTop: 15,
    borderBottomWidth: 1, 
    borderBottomColor: 'black'
  },
  button: {
    backgroundColor: 'black',
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});


export default SignInScreen;

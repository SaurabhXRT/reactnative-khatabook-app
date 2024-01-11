import React, { useState } from 'react';
import { View, Text, TextInput, Button,TouchableOpacity, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const SignupScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    try {
      console.log(name,password);
      const response = await axios.post('https://nativeshopapp-server-nodejs.vercel.app/api/auth/signup', { name, password });
      await AsyncStorage.setItem('token', response.data.token);
      navigation.navigate('Home1');
    } catch (error) {
      console.error(error);
    }
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.containers}>
    <View style={styles.container}>
      <Text style={styles.text}>Sign Up</Text>
      <TextInput
        style={styles.textinput}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.textinput}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signInButton}
        onPress={navigateToSignIn}
      >
        <Text style={styles.signInButtonText}>Already have an account? Sign In</Text>
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
    elevation: 150
  },
  text: {
    color: 'black',
    fontSize: 30,
    marginBottom: 20,
  },
  textinput: {
    padding: 2,
    marginTop: 5,
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
  },
  signInButton: {
    marginTop: 10 
  },
  signInButtonText: {
    color: 'blue',
  }
});


export default SignupScreen;

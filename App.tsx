import React, { useEffect, useState } from "react";
import {  NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./src/components/Auth/SignupScreen";
import SignInScreen from "./src/components/Auth/SignInScreen";
import ShopkeeperScreen from "./src/components/ShopkeeperScreen";
import ListItemScreen from "./src/components/ListItemScreen";
import ProfileScreen from "./src/components/Auth/ProfileScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, StatusBar } from 'react-native';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Profiles"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Profiles" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Shopkeeper"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Shopkeeper" component={ShopkeeperScreen} />
      <Stack.Screen name="ListItemScreen" component={ListItemScreen} />
    </Stack.Navigator>
  );
};

const HomeScreens = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        keyboardHidesTabBar: true,
        activeTintColor: "black",
        style: {
          elevation: 5,
        },

      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          tabBarStyle: {
            elevation: 1, 
          },

        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          tabBarStyle: {
            elevation: 1000, 
          },
        }}
      />
    </Tab.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SignUp"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignupScreen} />
    </Stack.Navigator>
  );
};

const App = () => {

  useEffect(() => {
    StatusBar.setBackgroundColor('black');
    StatusBar.setBarStyle('light-content');

    return () => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('dark-content');
    };
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        setIsAuthenticated(isAuthenticated);
      } else {
        console.log("not authenticated");
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    }
  };
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home1" : "Auth"}
        screenOptions={{ headerShown: false}}
      >
        <Stack.Screen name="Home1" component={HomeScreens} />
        <Stack.Screen name="Auth" component={AuthStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

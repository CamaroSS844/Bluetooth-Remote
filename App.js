/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import RNBluetoothClassic, {
  BluetoothEventType,
  BluetoothDevice,
} from "react-native-bluetooth-classic";

import { PermissionsAndroid, Platform } from "react-native";
import { FontAwesome, AntDesign, MaterialCommunityIcons} from "@expo/vector-icons";

const power = <FontAwesome name="power-off" size={30} color="red" />;
const up = <AntDesign name="up" size={30} color="white" style={{marginBottom: 20}} />;
const down = <AntDesign name="down" size={30} color="white" style={{marginTop: 20}}/>;
const left = <AntDesign name="left" size={30} color="white" style={{marginRight: -15}}/>;
const right = <AntDesign name="right" size={30} color="white" style={{marginLeft: -5}}/>;
const bConnect = <MaterialCommunityIcons name="bluetooth-connect" size={30} color="white"/>;
const bOff = <MaterialCommunityIcons name="bluetooth-off" size={30} color="white" style={{marginLeft: -5}}/>;

const overallWidth = Dimensions.get('window').width;

function CustomHeader() {

  const initialiseBle = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access fine location required for discovery',
        message:
          'In order to perform discovery, you must enable/allow ' +
          'fine location access.',
        buttonNeutral: 'Ask Me Later"',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK'
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  
  const startDiscovery = async () => {
    //request permissions
    try {
      const granted = await initialiseBle();
  
      if (!granted) {
      console.log(`Access fine location was not granted`);
      }
  
      //check if bluetooth is on 
      try {
        const enabled = await RNBluetoothClassic.isBluetoothEnabled();
        if (!enabled) {
          Alert.alert(
            `Bluetooth is not enabled`,
            `Please turn on bluetooth and try again`
          );
          return;
        }
      } catch (err) {
          // Handle accordingly
      }
  
      try {
      const unpaired = await RNBluetoothClassic.startDiscovery();
      Alert.alert(
          `Found ${unpaired.length} unpaired devices.`,
          JSON.stringify(unpaired, null, 2)
      );
      } finally {
      // this.setState({ devices, discovering: false });
      }      
    } catch (err) {
      Alert.alert(
        `Error`,
        err.message
      );
    }
  }

  return (
    <View style={styles.customHeader}>
      <Text style={{color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 20}}>Group 1 Remote</Text>
      <TouchableOpacity onPress={() => startDiscovery()} style={{marginTop: 20}}>
        {bConnect}
      </TouchableOpacity>
    </View>
  )
}

function App(){
  const isDarkMode = useColorScheme() === 'dark';
  

  const backgroundStyle = {
    backgroundColor: "black"
  };
  


  const send = async (val) => {
    // bluetooth address for esp 32 "48:E7:29:C9:E9:66"
        try {
          const myConnection = await RNBluetoothClassic.connectToDevice("48:E7:29:C9:E9:66");
          myConnection.write(val);
        } catch (error) {
          console.log(error);
        }
      }


  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={backgroundStyle.backgroundColor}/>
      <CustomHeader />
      <View>
        <TouchableOpacity style={styles.onOff} onPress={() => send("1")}>{power}</TouchableOpacity>
        <View style={{width: overallWidth, ...styles.template,flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={{...styles.onOff}} onPress={() => send("2")}><Text style={{color: '#fff', fontSize: 15}}>radio</Text></TouchableOpacity>
          <TouchableOpacity style={{...styles.onOff}} onPress={() => send("3")}><Text style={{color: '#fff', fontSize: 15}}>mute</Text></TouchableOpacity>
        </View>
        <View style = {styles.mainSet}>
          <View style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.left} onPress={() => send("4")}>{left}</TouchableOpacity>
          </View>

          <View style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.up} onPress={() => send("5")}>{up}</TouchableOpacity>
            <TouchableOpacity style={styles.ok} onPress={() => send("6")}><Text style={{color: "white", fontSize: 20}}>ok</Text></TouchableOpacity>
            <TouchableOpacity style={styles.down} onPress={() => send("7")}>{down}</TouchableOpacity>
          </View>

          <View style = {{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.right} onPress={() => send("8")}><Text style={{color: '#fff', marginLeft: 25}}>{right}</Text></TouchableOpacity>
          </View>
        </View>


        <View style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: overallWidth}}>
          <View style = {{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', borderRadius: 40, height: 150}}>
            <TouchableOpacity style={styles.buttonV} onPress={() => send("9")}><Text style={{color: "white"}}>V+</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonV} onPress={() => send("A")}><Text style={{color: "white"}}>V-</Text></TouchableOpacity>
          </View>
          <View style = {{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', width: "60%"}}>
            <TouchableOpacity style={{...styles.buttonV, width: 50, height: 50}} onPress={() => send("B")}><Text style={{color: "white"}}>audio</Text></TouchableOpacity>
            <TouchableOpacity style={{...styles.buttonV, width: 50, height: 50}} onPress={() => send("C")}><Text style={{color: "white"}}>info</Text></TouchableOpacity>
            <TouchableOpacity style={{...styles.buttonV, width: 50, height: 50}}onPress={() => send("D")}><Text style={{color: "white"}}>back</Text></TouchableOpacity>
          </View>
          <View style = {{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', borderRadius: 40, height: 150}}>
            <TouchableOpacity style={styles.buttonV}><Text style={{color: "white"}} onPress={() => send("E")}>C+</Text></TouchableOpacity>
            <TouchableOpacity style={styles.buttonV}><Text style={{color: "white"}} onPress={() => send("F")}>C-</Text></TouchableOpacity>
          </View>

        </View>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:"#555555"
  },
  template: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  customHeader: {
    backgroundColor: 'black',
    width: overallWidth,
    height: 75,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  onOff: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 100,
    height: 40, 
    backgroundColor: 'black',
    borderRadius: 20,
    shadowColor: "#fff",
    elevation: 20,
  },
  up: {
   width: 120,
    height: 80,
    marginBottom: -30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -2,
  },
  down: {
    width: 120,
    height: 80,
    marginTop: -30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  left: {
    width: 70,
    height: 140,
    marginRight: -30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    zIndex: -1
  },
  right: {
   width: 70,
    height: 140,
    marginLeft: -30,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  ok: {
    width: 95,
    height: 95,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainSet: {
    display: 'flex',
    flexDirection: 'row', 
    borderRadius: 700, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: overallWidth * 0.55, 
    marginLeft: 'auto', 
    marginRight: 'auto',
    shadowColor: "#fff",
    elevation: 20,
  },
  buttonV: {
    width: 40,
    height: 40,
    borderRadius: 115,
    backgroundColor: "black",
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#fff",
    elevation: 20,
  }
});

export default App;

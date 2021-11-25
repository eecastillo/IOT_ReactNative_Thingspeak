import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { render } from 'react-dom';
import { Button, StyleSheet, Text, View,SafeAreaView, ScrollView,TextInput} from 'react-native';
import { Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RNRestart from 'react-native-restart';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

function onLogin() {
  alert("hiii")
}

const Home = ({ navigation }) => {

  
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={{alignItems:'center',paddingVertical: Dimensions.get("window").height/3}}>
      <TextInput
        style={{height: 40, fontSize:30}}
        placeholder="User"
        onChangeText={user => setUser(user)}
        defaultValue={user}
      />
      <TextInput
        style={{height: 40, fontSize:30}}
        placeholder="Password"
        onChangeText={password => setPassword(password)}
        defaultValue={password}
      />
      <Button
        title="Access"
        onPress={() => (user=="ponganos" && password == "diezporfavor") ? navigation.navigate('ProfileScreen'):alert("Incorrect credentials")}
      />
    </View>
  );
}


function Profile({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile screen</Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const forFade = ({ current, next }) => {
  const opacity = Animated.add(
    current.progress,
    next ? next.progress : 0
  ).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};


const Stack = createStackNavigator();



function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}
const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);

export default class App extends React.Component {

  
  state = {
    datos_json:[],
    fecha: ['jj'],
    temp: [0],
    light: [0],
    rfid: ['a','b','c'],
    rfid_freq:[0,1,2]
  }
  
  //created_at
  //field1
  //field2
  //field3
  /*constructor(){
    super();
    this.state = {texto:""};
  }*/

  componentDidMount = () => {
    this.myTimer = setInterval(() => {
      this.getDataUsingGet()

    },5000);
  }

  componentWillUnmount = () => {
    clearInterval(this.myTimer);
  }


  json2array(json){
    var result = [];
    var keys = Object.keys(json);
    keys.forEach(function(key){
        result.push(json[key]);
    });
    return result;
  }
  getDataUsingGet = () => {
    //GET request
    
    fetch('https://thingspeak.com/channels/1557755/feeds.json', {
      method: 'GET',
      //Request Type
    })
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        //alert(JSON.stringify(responseJson));

   //   alert((responseJson.feeds.length))
      var dates=[]
      var temp=[]
      var light=[]
      var rfid=[]
      var freq=[]
      var size = responseJson.feeds.length;
      var tempdate = ""
      var hour="";
      for(var i = size-15; i < size; i++){          
        tempdate = responseJson.feeds[i].created_at
        hour = (parseInt(tempdate.substring(11,13))-6).toString()
        dates.push(hour+tempdate.substring(13,16))
        temp.push(responseJson.feeds[i].field1)
        light.push(responseJson.feeds[i].field2)
        rfid.push(responseJson.feeds[i].field3)
      }
      var unique = rfid.filter(onlyUnique);
      unique.sort(function(a, b){return a-b});
      unique.shift()
      for(var i=0;i<unique.length;i++){
        freq.push(countOccurrences(rfid,unique[i]))
      }
      this.setState({
        datos_json:(responseJson),
        datos_feeds:(responseJson.feeds),
        fechas:dates,
        temp:temp,
        light:light,
        rfid:unique,
        rfid_freq:freq
      })
      })
      //If response is not in json then in error
      .catch((error) => {
        //Error
        alert(JSON.stringify(error));
        console.error(error);
      });
  }

  ProfileScreen = () => {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <Text>Temperature plot</Text>
          <LineChart
            data={{
              labels: this.state.fechas,
              datasets: [
                {
                  data: this.state.temp
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisSuffix="°C"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#e00a00",
              backgroundGradientFrom: "#FF61D2",
              backgroundGradientTo: "#FE9090",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            verticalLabelRotation={30}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <Text>Ligth plot</Text>
          <LineChart
            data={{
              labels: this.state.fechas,
              datasets: [
                {
                  data: this.state.light
                }
              ]
            }}
            width={Dimensions.get("window").width} // from react-native
            height={220}
            yAxisSuffix="lx"
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              backgroundColor: "#38ADAE",
              backgroundGradientFrom: "#38ADAE",
              backgroundGradientTo: "#CD295A",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            verticalLabelRotation={30}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <Text>RFID plot</Text>
          <BarChart
            data={{
              labels: this.state.rfid,
              datasets: [
                {
                  data: this.state.rfid_freq
                }
              ]
            }}
            width={Dimensions.get("window").width}
            height={220}
            chartConfig={{
              backgroundColor: "#e24a00",
              backgroundGradientFrom: "#C6EA8D",
              backgroundGradientTo: "#FE90AF",
              decimalPlaces: 1, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}          
            verticalLabelRotation={0}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
          <StatusBar style="auto" />
        </ScrollView>
      </SafeAreaView>
       
    );
  };



  render(){
    return (
      <NavigationContainer>
            <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTintColor: 'white',
            headerStyle: { backgroundColor: 'tomato' },
          }}
        />
        <Stack.Screen
          name="ProfileScreen"
          component={this.ProfileScreen}
          options={{ headerStyleInterpolator: forFade }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingVertical: 0
  },
  input: {
    width: 200,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
  inputext: {
    width: 200,
    height: 44,
    padding: 10,
    textAlign:'center',
    fontWeight:'bold',
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
  },
});

import React, { Component } from "react";
import { 
  View,
  Text,
  StyleSheet
} from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {IconButton, Colors} from 'react-native-paper';
import WelcomeScreen from './Screens/Welcome';
import Signup from './Screens/Signup';
import Login from './Screens/Login';
import Clinic from './Screens/Clinic';
import Doctor from './Screens/Doctor';
import Admin from './Screens/Admin';
import Patient from './Screens/Patient';
import Auditor from './Screens/Auditor';
import PatientDetail from './Screens/PatientDetail';
import DoctorDetail from './Screens/DoctorDetail';
import ProblemScreen from "./Screens/ProblemScreen";
import DoctorProfile from "./Screens/DoctorProfile";
import DoctorProblem from "./Screens/DoctorProblem";
import HistoryScreen from "./Screens/History";
import ADocScreen from "./Screens/ADocScreen";

const Stack=createStackNavigator();



class App extends Component {
  constructor(props)
  {
    super(props)
  }
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome' >
                <Stack.Screen name="Welcome" component={WelcomeScreen} options={{headerShown:false}}/>
              <Stack.Screen name="Signup" component={Signup}
                  options={{headerTitleAlign:'center',title:'SIGNUP',
                  headerStyle:{backgroundColor:'#3C1053FF'},
                  headerTintColor:'#dddd',
                  headerTitleStyle:{fontWeight:'bold'}
                }}

             />
             <Stack.Screen name="Login" component={Login} 
                options={{headerTitleAlign:'center',
                title:'LOGIN',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
             
              <Stack.Screen name="Clinic" component={Clinic} 
                options={{headerTitleAlign:'center',
                title:'Clinic',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'},
                headerLeft:()=>(
                 <IconButton
                  icon="menu"
                  color={'#dddd'}
                  size={20}
                  onPress={() => {
                    this.props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'Welcome' }],
                    });
                  }}
                />
                )
              }}
                
              />
              <Stack.Screen name="Doctor" component={Doctor} 
                options={{headerTitleAlign:'center',
                title:'Doctor',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'},
                headerLeft:null
              }}/>
              <Stack.Screen name="Admin" component={Admin} 
                options={{headerTitleAlign:'center',
                title:'Admin',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'},
                headerLeft:null
              }}/>
              <Stack.Screen name="Patient" component={Patient} 
                options={{headerTitleAlign:'center',
                title:'Patient',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="Auditor" component={Auditor} 
                options={{headerTitleAlign:'center',
                title:'Auditor',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'},
                headerLeft:null,
              }}/>
              <Stack.Screen name="DoctorDetail" component={DoctorDetail} 
                options={{headerTitleAlign:'center',
                title:'Detail',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'},
                
              }}/>
              <Stack.Screen name="PatientDetail" component={PatientDetail} 
                options={{headerTitleAlign:'center',
                title:'Detail',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="Problem" component={ProblemScreen} 
                options={{headerTitleAlign:'center',
                title:'Problem',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="DoctorProblem" component={DoctorProblem} 
                options={{headerTitleAlign:'center',
                title:'Problem',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="DoctorProfile" component={DoctorProfile} 
                options={{headerTitleAlign:'center',
                title:'Profile',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="History" component={HistoryScreen} 
                options={{headerTitleAlign:'center',
                title:'History',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              <Stack.Screen name="ADocScreen" component={ADocScreen} 
                options={{headerTitleAlign:'center',
                title:'Auditor',
                headerStyle:{backgroundColor:'#3C1053FF'},
                headerTintColor:'#dddd',
                headerTitleStyle:{fontWeight:'bold'}
              }}/>
              
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
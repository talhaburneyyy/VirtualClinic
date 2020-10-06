import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    ImageBackground
} from "react-native";
import {Button} from 'react-native-paper'
import { color } from "react-native-reanimated";
class WelcomeScreen extends Component {
    componentDidMount(){
        
    }
     
    render() {
        return (
            
                <ImageBackground
                source={require('../assets/backgroundd.jpg') } 
                  style={styles.container}>
                    <View style={styles.innerContainer}>
                        <Text style={styles.text}>Virtual</Text>
                        <Text style={styles.text}>Clinic</Text>
                    </View>
                    <View style={{marginVertical:100, elevation:50}}>
                        <Button mode='contained' theme={Btnthemes} style={styles.btn}
                        onPress={()=>this.props.navigation.navigate('Login')}
                        >LOGIN</Button>
                        <Button mode='contained' theme={Btnthemes} style={styles.btn}
                        onPress={()=>this.props.navigation.navigate('Signup')}
                        >SIGNUP</Button>
                    </View>
                </ImageBackground>
       
        );
    }
}


const Btnthemes = {
    colors: {
      primary: '#3C1053FF',
      accent: '#ddd',
    },
  };

export default WelcomeScreen;   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        
    },
    text:{
        fontSize:75,
        color:'#3C1053FF',
    },
    innerContainer:{
        flexDirection:'row',
        marginVertical:140,
        borderWidth:10,
        borderTopColor:'#ddd',
        borderBottomColor:'#ddd',
        elevation:50
    },
    btn:{
        width:200,
        margin:5,
    }
});
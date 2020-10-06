import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Text,
    ToastAndroid,
    AsyncStorage,
    Alert
} from "react-native";
import {TextInput, Button, ActivityIndicator, Card, Caption, Avatar} from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";
import {LinearGradient} from 'expo-linear-gradient';
import {Input, Icon, Overlay} from 'react-native-elements';
import * as Constants from  '../Configuration/ipconfig';


class LoginScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            email:'',
            password:'',
            animate:false,
            navigation:"",
            secureTextEntry:true,
            animating:false,
            isShow:false,
        }
    }
    
    componentDidMount(){
        
    }
    validateData = async () => {
        this.setState({isShow:true})
        await fetch("http://"+Constants.ipAddress+"/Api/api/Login/UserLogin?id="+this.state.email+'&password='+this.state.password+'&time='+new Date().toLocaleTimeString())
        .then((response)=>response.text())
        .then(data=>this.setState({navigation:data.split("\"")[1].split("\"")[0]}))
        .catch(err=>console.log(err.message))
        if(this.state.navigation=="Clinic"){ 
            this.setState({isShow:false})   
            this.props.navigation.navigate('Clinic',{email:this.state.email,password:this.state.password});
        }
        else if(this.state.navigation=="Doctor"){
            this.setState({isShow:false})
            this.props.navigation.navigate('Doctor',{email:this.state.email,password:this.state.password})
        }
        else if(this.state.navigation=='Admin'){
            this.setState({isShow:false})
            this.props.navigation.navigate('Admin',{email:this.state.email,password:this.state.password})
        }
        else if(this.state.navigation=='Auditor'){
            this.setState({isShow:false})
            this.props.navigation.navigate('Auditor',{email:this.state.email,password:this.state.password})
        }
        else if(this.state.navigation=='Pending'){
            this.setState({isShow:false})
            Alert.alert("Information","You're Request to Join Virtual Clinic is in Pending State, We're looking onto your request.")
        }
        else if(this.state.navigation=='Blacklist'){
            this.setState({isShow:false})
            Alert.alert("Information","Your Account Has Been Suspended")
        }
        else{
            this.setState({isShow:false})
            ToastAndroid.show("Invalid Email and Password",ToastAndroid.LONG)
        }

    }
    







    render() {
        return (
            <View style={styles.container}>
                <LinearGradient
                    colors={['rgba(60, 16, 83, 1.00)', 'transparent']}
                    start={[0.1,0.2]}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        height: 1000,
                    }}
                    />
                <Overlay
                    isVisible={this.state.isShow}
                >
                    <View style={{flexDirection:'row'}}>
                        <ActivityIndicator style={{margin:5}} size='small' color="#3C1053FF" animating={true} />
                        <Caption style={{margin:5,top:7}}>Loading...</Caption>
                    </View>
                </Overlay>
                <Card style={styles.card}>
                    <Avatar.Text theme={Btonthemes} style={{alignSelf:'center',position:'absolute',top:-150,elevation:20}} label='VC' size={150}/>
                    <Input  
                        inputStyle={styles.textinputs} 
                        leftIcon={{ type: 'feather', name: 'mail' }}
                        label='Email' 
                        placeholder='email@address.com'
                        value={this.state.email} 
                        onChangeText={text=>this.setState({email:text})}/>
                    <Input  
                        inputStyle={styles.textinputs} 
                        placeholder='Password'
                        label='Password'  
                        secureTextEntry={this.state.secureTextEntry}
                        leftIcon={{ type: 'feather', name: 'lock' }}
                        rightIcon={
                           this.state.password?<Icon
                            name={this.state.secureTextEntry?'eye':'eye-off'}
                            type='feather'
                            onPress={()=>this.setState({secureTextEntry:!this.state.secureTextEntry})}
                            size={24}
                            color='black'
                            />:null
                          
                        } 
                        value={this.state.password } 
                        onChangeText={text=>this.setState({password:text})}/>
                    <Button theme={Btnthemes} onPress={this.validateData} mode='contained' style={styles.button}>LOGIN</Button>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('Signup')}>
                    <Text style={{alignSelf:'center'}}>Don't have an account? SIGNUP</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }
}
export default LoginScreen;
const Btnthemes = {
    roundness: 45,
    colors: {
      primary: '#3C1053FF',
      accent: '#f1c40f',
    },
  };
  const Btonthemes = {
    colors: {
      primary: '#dddddd',
      accent: '#f1c40f',
    },
  };
const txtthemes = {
    colors: {
      primary: '#3C1053FF',
      accent: '#f1c40f',
    },
  };
const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    textinputs:{
        width:350,
        left:10
    },
    button:{
        alignSelf:'center',
        width:200,
        marginVertical:40
    },
    card:{
        top:100,
        margin:20,
        elevation:20,
        height:500,
        padding:50,
        borderBottomRightRadius:50,
    }
});
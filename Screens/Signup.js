import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Text,
    KeyboardAvoidingView,
    ToastAndroid,
    Alert
} from "react-native";
import { Button } from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";
import SwitchSelector from 'react-native-switch-selector';
import {Input, Icon, Overlay, Card} from 'react-native-elements'
import * as Constants from '../Configuration/ipconfig'
var radio_props = [
    {label: 'Doctor', value: 0 },
    {label: 'Clinic', value: 1 }
  ];
class SignupScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            name:'',
            email:'',
            password:'',
            cnic:'',
            phoneno:'',
            location:'',
            keyboradView:false,
            checked:'first',
            value:-1,
            status:"",
            secureTextEntry:true,
            isVisible:false,
            education:'',
            speciality:''
        }
        this.submit=this.submit.bind(this)
    }
    toggleOverlay = () => {
        this.setState({isVisible:!this.state.isVisible});
      };
    submit = async () => {
       
        const {name,email,password,phoneno,location,cnic}=this.state;
        if(name==''){
            ToastAndroid.show("Please Enter Your Name",ToastAndroid.LONG)
            return;
        }
        if(email==''){
            ToastAndroid.show("Please Provide Valid Email",ToastAndroid.LONG)
            return;
        }
        if(password==''){
            ToastAndroid.show("Please Input Password",ToastAndroid.LONG)
            return;
        }
        if(phoneno==''){
            ToastAndroid.show("Please Provide Phone No.",ToastAndroid.LONG)
            return;
        }
        if(location==''){
            ToastAndroid.show("Please Provide Location",ToastAndroid.LONG)
            return;
        }
        if(cnic==''){
            ToastAndroid.show("Please Provide CNIC Number",ToastAndroid.LONG)
            return;
        }
        if(this.state.value==-1)
        {
            ToastAndroid.show("Please Select Doctor or Clinic", ToastAndroid.LONG)
            return;
        }else if(this.state.value==1){
            let C_cnic=cnic;
            let C_name=name;
            await fetch("http://"+Constants.ipAddress+"/Api/api/Clinic/RegisterClinic", {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    C_cnic,
                    C_name,
                    email,
                    phoneno,
                    location,
                    password
                })
            })
            .then(response=>response.text())
            .then(data=>this.setState({status:data.split("\"")[1].split("\"")[0]}))
            .catch(err=>console.log(err.message()))
            if(this.state.status=="Registered")
                this.props.navigation.navigate('Clinic',{email:this.state.email,password:this.state.password})
            }
            else if(this.state.value==0)
            {
                let D_cnic=cnic;
                let D_name=name;
                let D_email=email;
                let D_password=password;
                let D_location=location;
                let D_phoneno=phoneno;
                await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/RegisterDoctor", {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        D_cnic,
                        D_name,
                        D_email,
                        D_phoneno,
                        D_location,
                        D_password,
                        qualification:this.state.education,
                        speciality:this.state.speciality
                    })
                  })
                  .then(response=>response.text())
                  .then(data=>this.setState({status:data.split("\"")[1].split("\"")[0]}))
                  .catch(err=>console.log(err))
                  if(this.state.status=="Pending")
                    Alert.alert("Information","Your Registration Request Has Been Sent To Authorities, We will reach you shortly.")
                  else 
                  Alert.alert("Information",this.state.status)

                    this.setState({isVisible:false})
                }
            }
             
    
            
    render() {
        return (
            <View style={styles.container}>
            <KeyboardAvoidingView behavior='position' enabled={this.state.keyboradView} >
               
               <Input 
                    onFocus={()=>this.setState({keyboradView:false})}
                    inputStyle={styles.textinputs}
                    placeholder='Full Name' 
                    leftIcon={{ type: 'feather', name: 'user' }}
                    label='Name'   
                    value={this.state.name} 
                    onChangeText={text=>this.setState({name:text})}/>
               <Input 
                    onFocus={()=>this.setState({keyboradView:false})}
                    inputStyle={styles.textinputs} 
                    label='Email'
                    placeholder='email@address.com' 
                    leftIcon={{ type: 'feather', name: 'mail' }} 
                    value={this.state.email} 
                    onChangeText={text=>this.setState({email:text})}/>
               
               <Input 
                    onFocus={()=>this.setState({keyboradView:false})} 
                    inputStyle={styles.textinputs} label='Password' 
                    leftIcon={{ type: 'feather', name: 'lock' }}
                    rightIcon={
                        <Icon
                        name={this.state.secureTextEntry?'eye':'eye-off'}
                        type='feather'
                        onPress={()=>this.setState({secureTextEntry:!this.state.secureTextEntry})}
                        size={24}
                        color='black'
                        />
                    }
                    secureTextEntry={this.state.secureTextEntry} 
                    placeholder='Password'
                    value={this.state.password} 
                    onChangeText={text=>this.setState({password:text})}/>
               <Input 
                    onFocus={()=>this.setState({keyboradView:false})}
                    placeholder='NIC Number'
                    inputStyle={styles.textinputs} 
                    leftIcon={{type:'simple-line-icon',name:'info'}}
                    label='CNIC' 
                    value={this.state.cnic} 
                    onChangeText={text=>this.setState({cnic:text})}/>
               <Input 
                    onFocus={()=>this.setState({keyboradView:false})}
                    inputStyle={styles.textinputs} 
                    placeholder='000000000'
                    leftIcon={{type:'feather',name:'phone'}}
                    label='Phone No'  
                    value={this.state.phoneno} 
                    onChangeText={text=>this.setState({phoneno:text})}/>
               <Input 
                    onFocus={()=>this.setState({keyboradView:true})} 
                    inputStyle={styles.textinputs} 
                    leftIcon={{type:'simple-line-icon',name:'location-pin'}}
                    placeholder='City'
                    label='Location' 
                    value={this.state.location} 
                    onChangeText={text=>this.setState({location:text})}/>
                 <SwitchSelector
                    options={radio_props}
                    initial={-1}
                    buttonColor="#3C1053FF"
                    onPress={async (abc) => { await this.setState({value:abc})}} 
                    style={{margin:10}}
                />
                <Button theme={Btnthemes} mode='contained' onPress={this.state.value==0?this.toggleOverlay:this.submit} style={styles.button}>{this.state.value==0?"Next":"Signup"}</Button>
                <TouchableOpacity style={{alignSelf:'center'}} onPress={()=>this.props.navigation.navigate('Login')}>
                <Text>Already have an account?</Text>
                </TouchableOpacity>
                <Overlay
                transparent={true}
                overlayStyle={{width:'100%',padding:20}}
                isVisible={this.state.isVisible}
                onBackdropPress={this.toggleOverlay}
                
                >
                    <Card>
                        <Input 
                            onFocus={()=>this.setState({keyboradView:true})} 
                            inputStyle={styles.textinputs} 
                            leftIcon={{type:'simple-line-icon',name:'location-pin'}}
                            placeholder='Enter Qualification'
                            label='Qualification' 
                            value={this.state.education} 
                            onChangeText={text=>this.setState({education:text})}/>
                        <Input 
                            onFocus={()=>this.setState({keyboradView:true})} 
                            inputStyle={styles.textinputs} 
                            placeholder='Enter Speciality'
                            label='Speciality' 
                            value={this.state.speciality} 
                            onChangeText={text=>this.setState({speciality:text})}/>
                        <Button theme={Btnthemes} mode='outlined' onPress={this.submit}>Signup</Button>
                    </Card>
                </Overlay>
            </KeyboardAvoidingView>
            </View>
        );
    }
}
export default SignupScreen;
const Btnthemes = {
    roundness: 45,
    colors: {
      primary: '#3C1053FF',
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
        paddingLeft:10,
        width:350,
    },
    button:{
        width:200,
        marginVertical:20,
        alignSelf:'center'
    }
});
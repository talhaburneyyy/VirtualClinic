import React, { Component } from "react";
import { 
    View,
    Modal,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ToastAndroid
} from "react-native";
import { Card, Button} from 'react-native-paper'
import {  TouchableOpacity } from "react-native-gesture-handler";
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Input, Icon, withBadge, Badge } from "react-native-elements";
import DateTimePicker from '@react-native-community/datetimepicker';
import SwitchSelector from 'react-native-switch-selector'
import * as Constants from '../Configuration/ipconfig'
var radio_props = [
    {label: 'Male', value: 0 },
    {label: 'Female', value: 1 }
  ];

class DoctorProfileScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            date:new Date(),
            show:false,
            name:'',
            email:'',
            phoneno:'',
            location:'',
            qualification:null,
            genderValue:-1,
            dob:null,
            speciality:null,
            gender:'',
            rating:null,
            image:null,
            docDetails:null,
            imgmdl:false,
            neditable:true,
            maileditable:true,
            phoneeditable:true,
            locationeditable:true,
            qeditable:true,
            seditable:true,
            genderswitch:true,
            officeHourTo:'',
            officeHourFrom:'',
            officeHourToEditable:true,
            officeHourFromEditable:true,
            availibilityStatus:null,
        }
    }

    async componentDidMount(){
        let {D_cnic}=this.props.route.params;
        console.log(D_cnic)
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/getDoctorByNIC?nic="+D_cnic)
        .then((response)=>response.json())
        .then( async data=>await this.setState({
            name:data[0].D_name,
            email:data[0].D_email,
            location:data[0].D_location,
            phoneno:data[0].D_phoneno,
            image:data[0].image,
            gender:data[0].gender,
            qualification:data[0].qualification,
            speciality:data[0].speciality,
            dob:data[0].dob==null?null:data[0].dob.split('T')[0],
            officeHourTo:data[0].timeTo,
            officeHourFrom:data[0].timeFrom,
            availibilityStatus:data[0].availbilitystatus
        }))
        .catch(err=>console.log(err.message))
       if(this.state.gender==='Male')
            this.setState({genderValue:0})
        else 
            this.setState({genderValue:1})
    }
    setDate =  (event, date)=>{
        date = date || this.state.date
        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });
        let agee = this.state.date.toLocaleDateString()
       
       this.setState({dob:agee})
        
    }
    show = mode => {
        this.setState({
            show: true,
        });
    }
    async UpdateUser(){
        let {D_cnic} = this.props.route.params;
        let {image,qualification,speciality,dob}=this.state;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/UpdateDoctor",
        {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                D_name:this.state.name,
                D_cnic,
                D_email:this.state.email,
                D_location:this.state.location,
                image,
                qualification,
                speciality,
                dob,
                gender:this.state.genderValue==0?'Male':'Female',
                D_phoneno:this.state.phoneno,
                timeTo:this.state.officeHourTo,
                timeFrom:this.state.officeHourFrom

            })
        })
        .then((response)=>response.json())
        .then( data=>ToastAndroid.show(data,ToastAndroid.LONG))
        .catch(err=>console.log(err))
        this.componentDidMount()
    }
    pickFromGallary=async()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
             let data = await ImagePicker.launchImageLibraryAsync({
                 mediaTypes:ImagePicker.MediaTypeOptions.Images,
                 allowsEditing:true,
                 aspect:[1,1],
                 quality:0.5,
                 base64:true
             })
             let {base64} = data;
             this.setState({image:base64, imgmdl:false});
             
        }else{
             ToastAndroid.show("Permission Not Granted");
        }
     }
     pickFromCamera=async()=>{
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
             let data = await ImagePicker.launchCameraAsync({
                 mediaTypes:ImagePicker.MediaTypeOptions.Images,
                 allowsEditing:true,
                 aspect:[1,1],
                 quality:0.5,
                 base64:true
             })
             let {base64} = data;
             this.setState({image:base64,imgmdl:false});
        }else{
             ToastAndroid.show("Permission Not Granted");
        }
     }
    
     _imgshowModal = () => this.setState({ imgmdl: true });
     _imghideModal = () => this.setState({ imgmdl: false });
    
    render() {
       
        return (
            <View style={styles.container}>
                <View style={styles.topImg}>
                    {this.state.image == null ? 
                    <TouchableOpacity onPress={()=>this._imgshowModal()}>
                    <Image style={{width:150, height:150, borderRadius:75}} source={require('../assets/add-user.jpg')}/>{this.state.availibilityStatus!='false' ? <Badge badgeStyle={{scaleX:4,scaleY:4,position:'absolute',top:-20,right:20}} status='success'/>:null}</TouchableOpacity> : 
                    <TouchableOpacity onPress={()=>this._imgshowModal()}>
                    <Image style={{width:150, height:150, borderRadius:75}} source={{uri: `data:image/gif;base64,${this.state.image}`}} />{this.state.availibilityStatus!='false'? <Badge badgeStyle={{scaleX:4,scaleY:4,position:'absolute',top:-20,right:20}} status='success'/>:null}
                    </TouchableOpacity>
                    }                   
                    
                </View>
                <View style={{height:550}}>
                <ScrollView bounces={true}>
                <Card style={{top:20,margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Name' 
                        value={this.state.name}
                        onChangeText={text=>this.setState({name:text})} 
                        disabled={this.state.neditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({neditable:!this.state.neditable})}/>}
                        />
                </Card>
                <Card style={{top:10,margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Email' 
                        value={this.state.email}
                        onChangeText={text=>this.setState({email:text})} 
                        disabled={this.state.maileditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({maileditable:!this.state.maileditable})}/>}    
                        />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Phone No.' 
                        value={this.state.phoneno}
                        onChangeText={text=>this.setState({phoneno:text})} 
                        disabled={this.state.phoneeditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({phoneeditable:!this.state.phoneeditable})}/>}    
                        />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Location' 
                        value={this.state.location}
                        onChangeText={text=>this.setState({location:text})} 
                        disabled={this.state.locationeditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({locationeditable:!this.state.locationeditable})}/>}
                        />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Qualification' 
                        value={this.state.qualification==null?'Enter Qualification':this.state.qualification}
                        onChangeText={text=>this.setState({qualification:text})} 
                        disabled={this.state.qeditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({qeditable:!this.state.qeditable})}/>}
                        />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                    <Input 
                        label='Speciality' 
                        value={this.state.speciality==null?'Enter Speciality':this.state.speciality}
                        onChangeText={text=>this.setState({speciality:text})}
                        disabled={this.state.seditable}
                        inputStyle={{color:'#ddd'}} 
                        labelStyle={{color:'#ddd'}}
                        rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({seditable:!this.state.seditable})}/>}
                        />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                   
                        <Input 
                            label='Office Hour From:' 
                            value={this.state.officeHourFrom==null?'HH:MM AM/PM':this.state.officeHourFrom}
                            onChangeText={text=>this.setState({officeHourFrom:text})}
                            disabled={this.state.officeHourFromEditable}
                            inputStyle={{color:'#ddd'}} 
                            labelStyle={{color:'#ddd'}}
                            rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({officeHourFromEditable:!this.state.officeHourFromEditable})}/>}
                            />
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                        <Input 
                            label='Office Hour To:' 
                            value={this.state.officeHourTo==null?'HH:MM AM/PM':this.state.officeHourTo}
                            onChangeText={text=>this.setState({officeHourTo:text})}
                            disabled={this.state.officeHourToEditable}
                            inputStyle={{color:'#ddd'}} 
                            labelStyle={{color:'#ddd'}}
                            rightIcon={<Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({officeHourToEditable:!this.state.officeHourToEditable})}/>}
                            />
                   
                </Card>
                
                <Card style={{margin:10,flexDirection:'row', backgroundColor:'#3C1053FF'}}>
                    
                        <SwitchSelector
                                options={radio_props}
                                initial={this.state.genderValue}
                                value={this.state.genderValue}
                                buttonColor="#3C1053FF"
                                disabled={this.state.genderswitch}
                                onPress={async (abc) => {
                                        
                                     await this.setState({genderValue:abc})
                                    
                                    }}
                                
                                style={{margin:10}}
                                
                        />
                        <Icon name='edit'type='feather' color='#ddd' onPress={()=>this.setState({genderswitch:!this.state.genderswitch})}/>
                </Card>
                <Card style={{margin:10, backgroundColor:'#3C1053FF'}}>
                    <Text style={{color:'#ddd'}}>Date Of Birth</Text>
                    { this.state.show && (
                                <DateTimePicker
                                    value={this.state.date}
                                    mode='date'
                                    display='spinner'
                                    onChange={this.setDate}
                                />
                    )}
                   <Button theme={themess} onPress={()=>this.show()} mode='outlined' icon='calendar'>{this.state.dob==null?'Select Date Of Birth':this.state.dob}</Button>
                </Card>
                </ScrollView>
                <Button theme={Btonthemes} onPress={()=>this.UpdateUser()} style={{top:15}} mode='contained' icon='content-save-all'>Save</Button>
                </View>
                <Modal
                            visible={this.state.imgmdl}
                            onRequestClose={this._imghideModal}
                            transparent={true}
                        > 
                        <View style={styles.modelView}>
                            <View style={styles.modelbuttonview}>
                                <Button 
                                theme={Btonthemes} 
                                icon='camera' 
                                mode='contained'
                                onPress={this.pickFromCamera}
                                >
                                Camera
                                </Button>
                                <Button 
                                theme={Btonthemes} 
                                icon='image-area' 
                                mode='contained'
                                onPress={this.pickFromGallary}
                                >
                                Gallary
                                </Button>
                            </View>
                                <Button style={{alignSelf:'center',width:200}} theme={Btonthemes} onPress={this._imghideModal} mode='outlined' icon='cancel'>Cancel</Button>
                            </View>
                </Modal>
            </View>
        );
    }
}
export default DoctorProfileScreen;
const Btnthemes = {
    roundness: 45,
    colors: {
      primary: '#3C1053FF',
    },
  };
const Btonthemes = {
    colors: {
      primary: '#3C1053FF',
    },
  };
  const themess = {
    colors: {
      primary: '#ddd',
    },
  };
const styles = StyleSheet.create({
    container: {
        flex: 2,
    },
    topImg:{
        top:15,
        elevation:20,
        alignSelf:'center',
        borderRadius:75,
        alignItems:'center'
        
    },
    title:{
        fontSize:30,
        fontWeight:'bold',
        color:'#3C1053FF'
    },
    modelbuttonview:{
        flexDirection:'row',
        justifyContent:'space-around',
        padding:10,
    },
    modelView:{
        backgroundColor:'#ddd',
        position:'absolute',
        bottom:2,
        width:"100%"
    },
});
import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Modal,
    ToastAndroid,
    Platform,
    FlatList,
} from "react-native";
import {FAB, TextInput,Divider, Button, Card, Avatar, Caption, ActivityIndicator, Title} from 'react-native-paper';
import {  TouchableOpacity } from "react-native-gesture-handler";
import SwitchSelector from 'react-native-switch-selector'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Icon, Image, Input, Badge } from 'react-native-elements'
import * as Constant from '../Configuration/ipconfig';
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as FileSystem from 'expo-file-system'

var radio_props = [
    {label: 'Male', value: 0 },
    {label: 'Female', value: 1 }
  ];
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});
const notificationListener = React.createRef();
const responseListener = React.createRef();

class ClinicScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            visible:false,
            imgmdl:false,
            name:null,
            age:'',
            date:new Date(),
            show:false,
            base64img:null,
            value:-1,
            gender:'',
            cid:'Null',
            clinic:'',
            refreshing:false,
            Activity:false,
            contactno:'',
            location:'',
            search:'',
            expoPushToken:'',
            notification:false,
            cross:false
        }
    }
    async sendPushNotification1(expoPushToken) {
        // let token = 'ExponentPushToken[3BdqGaLxZTi7pExBo9II2_]'
        // let response = await fetch('https://exp.host/--/api/v2/push/send',{
        //   method:'POST',
        //   headers:{
        //     Accept:'application/json',
        //     'Content-Type':'application/json'
        //   },
        //   body:JSON.stringify({
        //     to:token,
        //     sound:'default',
        //     title:'You Have a new Case',
        //     body:this.state.name+'Need Your Assistance'
        //   })
    
        // })
        
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "You've Response!",
            body: 'Doctor Has Replied',
          },
          trigger: { seconds: 1 },
        });
      }
     
    async componentDidMount(){
        let {email}=this.props.route.params;
        let {password}=this.props.route.params;
        //Expo Notification Start
        if (Constants.isDevice) {
            const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
              finalStatus = status;
            }
            if (finalStatus !== 'granted') {
              alert('Failed to get push token for push notification!');
            }
            
        } else {
            alert('Must use physical device for Push Notifications');
        }
        //Expo Notifiation End
        this.setState({Activity:true})
        await fetch("http://"+Constant.ipAddress+"/Api/api/Login/getId?id="+email+'&pass='+password)
        .then((response)=>response.json())
        .then((data)=> this.setState({cid:data[0].C_cnic,clinic:data[0]}))
        .catch(err=>console.log(err.message))
        
        await fetch("http://"+Constant.ipAddress+"/Api/api/Patient/ClinicPatient?cnic="+this.state.cid)
        .then((response)=>response.json())
        .then((data)=> {
            this.setState({list:data})})
        .catch(err=>{
            if(err.message=='JSON Parse error: Unexpected EOF')
            {
                this.setState({list:[]})
            }
            console.log(err.message)
        })
        this.props.navigation.setOptions({
            title:this.state.clinic.C_name,
        })
        this.setState({refreshing:false,Activity:false,cross:false, search:''});
        //this.sendPushNotification1('xyz');
        
    }
    //DateTime Picker Start
    setDate =  (event, date)=>{
        date = date || this.state.date
        this.setState({
            show: Platform.OS === 'ios' ? true : false,
            date,
        });
        let agee = this.state.date.toLocaleDateString()
        this.setState({age:agee})  
    }
    show = mode => {
        this.setState({
            show: true,
        });
    }
    //DateTime Picker End
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
            this.setState({base64img:base64, imgmdl:false});
            
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
            this.setState({base64img:base64,imgmdl:false});
       }else{
            ToastAndroid.show("Permission Not Granted");
       }
    }
    async setGender(g){ await this.setState({gender:g})};
    addData = async () => {
        this.setState({Activity:true});
        if(this.state.value==0)
          await this.setGender('M')
        else if(this.state.value==1)
          await this.setGender('F')
        else{
            ToastAndroid.show("Select Gender",ToastAndroid.LONG)
            return;
        }
        let {name, age, gender, base64img, cid, contactno, location} = this.state;
        let C_cnic=cid;
        let image=base64img;
        await fetch("http://"+Constant.ipAddress+"/Api/api/Patient/RegisterPatient", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               C_cnic,
               name,
               age,
               gender,
               image,
               contactno,
               location
            })
          })
          .then(response=>console.log(response.status))
          .catch(err=>console.log(err.message()))
          this.setState({name:'',value:-1,base64img:null,visible:false})
          this.componentDidMount()
    }
    _showModal = () => this.setState({ visible: true });
    _hideModal = () => this.setState({ visible: false });
    _imgshowModal = () => this.setState({ imgmdl: true });
    _imghideModal = () => this.setState({ imgmdl: false });
    _navigate(n,nam,img,loc,phno){
        this.props.navigation.navigate('Patient',{serialno:n,name:nam,image:img,cliniccnic:this.state.cid,location:loc,phoneno:phno})
    }
    _empty=()=>{return <View></View>}
    _delete= async (number)=>{
        this.setState({Activity:true})
        await fetch("http://"+Constant.ipAddress+"/Api/api/Patient/DeletePatient?number="+number)
        .then((response)=>response.json())
        .then(data=>ToastAndroid.show(data,ToastAndroid.LONG))
        .catch(err=>console.log(err.message))
        this.componentDidMount()
    }
    searchDoctor = async () => {
        this.setState({cross:true})
        await fetch("http://"+Constant.ipAddress+"/Api/api/Patient/searchPatient?name="+this.state.search+"&cnic="+this.state.cid)
        .then((response)=>response.json())
        .then((data)=> {
            this.setState({list:data})})
        .catch(err=>{
            if(err.message=='JSON Parse error: Unexpected EOF')
            {
                this.componentDidMount()
            }
            console.log(err.message)
        })
    }
    _handleRefresh=()=>{
        this.setState({refreshing:true})
        this.componentDidMount()
    }
    render() {
        const {show, date} = this.state;
        return (
            <View style={styles.container}>
                <View style={{alignItems:'center'}}>
                    <Title style={{fontFamily:'monospace',top:5,fontSize:25,letterSpacing:20}}>{this.state.clinic.C_name}</Title>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={{flex:1,alignSelf:'center'}} size={20} name='location-pin' type='simple-line-icon'/>
                        <Title style={{left:15}}>{this.state.clinic.location}</Title>
                    </View>
                    <View style={{flexDirection:'row'}}>
                        <Icon style={{flex:1}} size={20} name='phone' type='simple-line-icon'/>
                        <Title style={{left:15}}>{this.state.clinic.phoneno}</Title>
                    </View>
                    
                </View>
                <Divider/>
                <Card style={{margin:15, elevation:20,padding:15}}>
                    <Input value={this.state.search} onChangeText={text=>this.setState({search:text})} label='SEARCH PATIENT' placeholder='Name'
                        rightIcon={
                           <Icon
                            name={this.state.cross?'x':'search'}
                            type='feather'
                            size={24}
                            color='black'
                            onPress={this.state.cross?()=>this.componentDidMount():this.searchDoctor}    
                            />
                        }
                            
                    />
                </Card>
                <Title style={{left:20}}>Registered Patients</Title>
                <ActivityIndicator size="large" color="#3C1053FF" style={{alignSelf:'center',position:'absolute',top:300}} animating={this.state.Activity} />
                {  this.state.list.length ?
                    <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    data={this.state.list}
                    ListEmptyComponent={this._empty}
                    renderItem={({item})=>{
                        
                        return  (<Card style={styles.card}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',margin:15}}>
                               <TouchableOpacity onPress={()=>this.props.navigation.navigate('PatientDetail',{number:item.serialno})}>
                                    {item.image == null ? <Avatar.Text theme={Btonthemes} size={54} label={item.name[0]} /> : <Image PlaceholderContent={<ActivityIndicator/>} style={{width:50, height:50, borderRadius:25}} source={{uri: `data:image/gif;base64,${item.image}`}} />}
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>this._navigate(item.serialno,item.name,item.image,item.location,item.contactno)}>
                                    <View>
                                        <Text style={styles.text}>{item.name}</Text>
                                        <Text style={{alignSelf:'center'}}>{item.contactno}</Text>
                                        <Text style={{alignSelf:'center'}}>{item.gender=='M'? <Text>Male</Text>:<Text>Female</Text>}</Text>
                                        {item.p_status=="true"?<Badge value='Active' badgeStyle={{backgroundColor:'green'}}/>:null}
                                    </View>
                                </TouchableOpacity>
                                <View>
                                    <TouchableOpacity onPress={()=>this._delete(item.serialno)}>
                                        <Avatar.Icon size={40} theme={Btonthemes} icon="delete" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>)
                    }}
                    keyExtractor={item=>item.serialno.toString()}
                    style={{flex:1}}
                />:<Caption style={{alignSelf:'center'}}>No Record Found</Caption>
                }
                <FAB
                    icon={'plus'}
                    theme={Btnthemes}
                    style={styles.fab}
                    onPress={()=>this._showModal()}
                />
                <Modal
                    visible={this.state.visible}
                    onRequestClose={this._hideModal}
                >
                    <View style={{flex:1,backgroundColor:'#dddd'}}>
                        <View>
                            <Text style={styles.title}>Register Patient</Text>
                            <Input inputStyle={{margin:10}} leftIcon={{type:'simple-line-icon',name:'user'}} onChangeText={text=>this.setState({name:text})} placeholder='Full Name'  label='Name'/>
                            <Input inputStyle={{margin:10}} leftIcon={{type:'simple-line-icon',name:'phone'}} onChangeText={text=>this.setState({contactno:text})} placeholder='0000000' label='Contact Number' />
                            <Input inputStyle={{margin:10}} leftIcon={{type:'simple-line-icon',name:'location-pin'}} onChangeText={text=>this.setState({location:text})} placeholder='City' label='Location'/>
                            <View style={{flexDirection:'row',justifyContent:'center'}}>
                                <Button style={{margin:10}} mode='outlined' onPress={()=>this.show()}>Date Of Birth</Button>
                                <Caption style={{alignSelf:'center'}}>Date of Birth: {this.state.age}</Caption>
                            </View>
                            { show && (
                                <DateTimePicker
                                    value={date}
                                    mode='date'
                                    display='spinner'
                                    onChange={this.setDate}
                                />
                            )}
                            <SwitchSelector
                                options={radio_props}
                                initial={this.state.value}
                                buttonColor="#3C1053FF"
                                onPress={async (abc) => {
                                        
                                     await this.setState({value:abc})
                                    
                                    }}
                                
                                style={{margin:10}}
                                
                            />
                            {this.state.base64img && <Image style={{alignSelf:'center',width: 200, height: 200, margin:5}} source={{uri: `data:image/gif;base64,${this.state.base64img}`}}/>}

                            <Button 
                                icon='image-album' 
                                style={{width:200, alignSelf:'center'}} 
                                mode='contained' 
                                theme={Btonthemes}
                                onPress={()=>this._imgshowModal()}
                            >
                                Add Image
                            </Button>
                            <Button icon='content-save' onPress={this.addData} style={{width:200, alignSelf:'center',margin:10}} mode='contained' theme={Btonthemes}>Register</Button>

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
                </Modal>
            </View>
        );
    }
}
export default ClinicScreen;
const Btonthemes = {
    colors: {
      primary: '#3C1053FF',
      accent: '#f1c40f',
    },
  };
const Btnthemes = {
    colors: {
      accent: '#3C1053FF',
    },
  };
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
      title:{
          alignSelf:'center',
          fontSize:30,
          backgroundColor:'#dddd',
          fontWeight:'bold',
          color:'#3C1053FF',
          borderBottomWidth:1
      },
      modelView:{
          position:'absolute',
          bottom:2,
          width:"100%"
      },
      modelbuttonview:{
          flexDirection:'row',
          justifyContent:'space-around',
          padding:10,
      },
      card:{
          margin:10,
          padding:5,
          elevation:20,
          borderBottomRightRadius:20,
         
      },
      text:{
          fontSize:24,
          fontWeight:'bold',
          alignSelf:'center'
      }
});



/*
{
'C_cnic':'3740592847952',
'P_name':'Khizar',
'P_post':'Flu',
'C_name':'Star Clinic',
'SerialNo':'1045',
}*/
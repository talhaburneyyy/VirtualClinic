import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Modal,
    Image,
    ToastAndroid,
    FlatList,
    TouchableOpacity,
    ScrollView
} from "react-native";
import { FAB, Button, Card, Avatar, Divider,Caption, Title, ActivityIndicator, IconButton} from 'react-native-paper';
import {Input, Icon, Overlay, CheckBox} from 'react-native-elements'
import * as Constants from '../Configuration/ipconfig'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system'
import {Audio} from 'expo-av';
import * as MediaLibrary from 'expo-media-library';


class PatientScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            visible:false,
            imgmdl:false,
            name:'',
            base64img:null,
            cid:'',
            homeImage:null,
            srno:'',
            post:'',
            refreshing:false,
            loading:false,
            side:'patient',
            phno:'',
            location:'',
            weight:'',
            temp:'',
            ubp:'',
            lbp:'',
            sugar:'',
            discription:'',
            problem:'',
            symSheet:false,
            headache:false,
            flu:false,
            fever:false,
            caugh:false,
            sourthroat:false,
            isRecording:false,
            recordingDuration:0,
            flag:false,
            AudioUri:null,
            recordedDuration:0,
        }
    }
    async _sendRequest(){
        
        let P_name=this.state.name;
        let ProblemTitle=this.state.problem;
        let Weight=this.state.weight;
        let UBloodPressure=this.state.ubp;
        let LBloodPressure=this.state.lbp;
        let Temprature = this.state.temp;
        let SugarLevel=this.state.sugar;
        let ProblemDiscription=this.state.discription;
        let C_cnic=this.state.cid;
        let Problem_image=this.state.base64img;
        let SerialNo=this.state.srno;
        let {fever, headache, flu, caugh, sourthroat,base64Audio} = this.state;
        await fetch('http://'+Constants.ipAddress+'/Api/api/Request/SendRequest', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               C_cnic,
               P_name,
               ProblemDiscription,
               ProblemTitle,
               UBloodPressure,
               LBloodPressure,
               SugarLevel,
               Temprature,
               Weight,
               Problem_image,
               SerialNo,
               fever,
               headache,
               flu,
               caugh,
               sorethroat:sourthroat,
               P_audio:this.Recording.getURI(),
               P_time:new Date().toLocaleTimeString()
            })
          })
          .then(response=>response.json())
          .then(data=>ToastAndroid.show(data, ToastAndroid.LONG))
          .catch(err=>console.log(err.message()))
          
          this.setState({visible:false,problem:null,weight:null,temp:null,bp:null,sugar:null,ProblemDiscription:null,base64img:null})
          this._fetchData();
    }
    async componentDidMount(){
        await Permissions.askAsync(Permissions.CAMERA_ROLL)
        this.ImageString=" ";
        let {name,image,cliniccnic,serialno,location,phoneno}=this.props.route.params;
        await this.setState({homeImage:image,name:name,cid:cliniccnic,srno:serialno,location:location,phoneno:phoneno})
        console.log(this.state.name)
        this.props.navigation.setOptions({
            title:'Patient Panel',
        })
        this._fetchData()
        await Audio.setIsEnabledAsync(true)
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
          playThroughEarpieceAndroid: false,
          staysActiveInBackground: true,
        });
        this.Recording=new Audio.Recording()
        this.sound = new Audio.Sound()
    } 
    //Audio
    _updateScreenForRecordingStatus = (status) => {
        if (status.canRecord) {
          this.setState({
            isRecording: status.isRecording,
            recordingDuration: status.durationMillis/1000,
          });
        } else if (status.isDoneRecording) {
          this.setState({
            isRecording: false,
            recordingDuration: status.durationMillis/1000,
          });
          
        }
    }
     StartRecording=async () => {
         await Permissions.askAsync(Permissions.AUDIO_RECORDING)
        try{
            const recording = new Audio.Recording()
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);
    
            this.Recording = recording
            await this.Recording.startAsync();
            
            
          }catch(err){
            console.log(err)
          }
    }
    stopRecording=async()=>{
        if(!this.Recording) 
          return;
        try{
          await this.Recording.stopAndUnloadAsync();
        }catch(err){
          console.log(err)
          return
        }
        const asset = await MediaLibrary.createAssetAsync(this.Recording.getURI());
        await MediaLibrary.createAlbumAsync('Expo', asset)
        .then(async() => {
          await this.setState({AudioUri:asset.uri,flag:true})
        })
        .catch(error => {
          console.log('err', error);
        });
        console.log(this.state.AudioUri)
      }
    async playSound(){
    
        
          this.sound = new Audio.Sound()
                
        await this.sound.loadAsync({uri:this.Recording.getURI()},{shouldPlay:false},false);
        await this.sound.getStatusAsync().then(status=> console.log(status.durationMillis))
        .catch(err=>console.log(err));
        if(this.sound!=null){
          await this.sound.playAsync(); 
           
        }
        else
          console.log(null)
        
      }
    async _fetchData(){
        this.setState({loading:true})
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/GetAll?serialno="+this.state.srno+'&clinic='+this.state.cid)
        .then((response)=>response.json())
        .then((data)=> this.setState({list:data}))
        .catch(err=>console.log(err.message))
        this.setState({loading:false, refreshing:false})
    }
    pickFromGallary=async()=>{
       const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
       if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Images,
                allowsEditing:true,
                aspect:[1,1],
                quality:0.5,
                base64:true,
            })
            let {base64} = data;
            this.setState({base64img:base64, imgmdl:false});
            this.ImageString=this.ImageString+"TalhaMehtab"+this.state.base64img
            console.log("ok")
            console.log(this.ImageString)
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
    _showModal = () => this.setState({ visible: true });
    _hideModal = () => this.setState({ visible: false });
    _imgshowModal = () => this.setState({ imgmdl: true });
    _imghideModal = () => this.setState({ imgmdl: false });
    _handleRefresh=()=>{
        this.setState({refreshing:true})
        this.componentDidMount()
    }
    toggleSheet=()=>{
        this.setState({symSheet:!this.state.symSheet})
    }
    render() {
        const {show, date} = this.state;
        return (
            <View style={styles.container}>
                    <View style={{flex:1,backgroundColor:'#dddd'}}>
                        
                            <Card style={{backgroundColor:'#3C1053FF',margin:5,padding:10}}>
                                {this.state.homeImage == null? <Avatar.Text style={{alignSelf:'center',backgroundColor:'#dddd'}} theme={Btonthemes} size={54} label={this.state.name[0]} /> : this.state.homeImage && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${this.state.homeImage}`}}/>}
                                <View>
                                    <Title style={{fontFamily:'sans-serif',fontSize:30,color:'#ddd',alignSelf:'center'}}>{this.state.name}</Title>
                                    <Text style={{fontFamily:'sans-serif',fontSize:15,color:'#ddd',alignSelf:'center'}}>{this.state.location}</Text>
                                    <Text style={{fontFamily:'sans-serif',fontSize:15,color:'#ddd',alignSelf:'center'}}>{this.state.phoneno}</Text>
                                </View>
                            </Card>
                        <Divider/>
                        <ActivityIndicator animating={this.state.loading}/>
                        <Title style={{left:20}}>Cases</Title>
                        {  this.state.list.length ?
                    <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    data={this.state.list}
                    renderItem={({item})=>{
                       
                        return  (<Card style={item.readstatus=="1"?styles.card:styles.card2}>
                            <View style={{flex:2,flexDirection:'row',padding:10}}>
                                <View style={{margin:7}}>
                                        <Title>{item.ProblemTitle}</Title>
                                        <Caption>{item.postdate.split('T')[0]} - {item.P_time}</Caption>
                                </View>
                                <View style={{flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                    <Icon  name='arrow-right' type='simple-line-icon'  onPress={()=>this.props.navigation.navigate('Problem',{sno:item.sno})}/>
                                </View>
                            </View>
                            <Divider/>
                           
                        </Card>)
                    }}
                    keyExtractor={item=> parseInt(item.sno).toString()}
                    
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
                    <ScrollView style={{flex:1,backgroundColor:'#dddd'}}>
                        <View>
                            <Text style={styles.title}>Post Request</Text>
                            <View style={{alignSelf:'center'}}>
                                {this.state.base64img==null?<Icon size={50} raised={true} onPress={()=>this._imgshowModal()} name='image' type='feather'  />
                                :
                                <TouchableOpacity onPress={()=>this._imgshowModal()} >
                                <Image  style={{alignSelf:'center',width: 200, height: 200, margin:5}} source={{uri: `data:image/gif;base64,${this.state.base64img}`}}/>
                                </TouchableOpacity>}
                            </View>
                            <Input  multiline={true}  leftIcon={{type:'simple-line-icon',name:'info'}} onChangeText={text=>this.setState({problem:text})} placeholder='Problem'  label='Patient Problem'/>
                            <Input keyboardType='numeric' leftIcon={{type:'simple-line-icon',name:'info'}} onChangeText={text=>this.setState({weight:text})} placeholder='KG' label='Weight' />
                            <Input keyboardType='numeric' leftIcon={{type:'font-awesome',name:'thermometer-empty'}} onChangeText={text=>this.setState({temp:text})} placeholder='Celcius/Farenheit' label='Temprature'/>   
                            <Input leftIcon={{type:'font-awesome',name:'heartbeat'}} onChangeText={text=>this.setState({ubp:text})} placeholder='Upper Blood Pressure' label='Systolic Blood Pressure'/>
                            <Input leftIcon={{type:'font-awesome',name:'heartbeat'}} onChangeText={text=>this.setState({lbp:text})} placeholder='Lower Blood Pressure' label='Diastolic Blood Pressure'/>
                            <Input keyboardType='numeric' leftIcon={{type:'font-awesome',name:'info'}} onChangeText={text=>this.setState({sugar:text})} placeholder='Suger Level' label='Suger Level'/>
                            <Input  leftIcon={{type:'font-awesome',name:'info'}} onChangeText={text=>this.setState({discription:text})} placeholder='Problem Discription' label='Discription'/>
                            <Button onPress={this.toggleSheet} theme={Btonthemes} mode='contained' style={{width:200,alignSelf:'center'}}>Symptoms</Button>
                            <Text style={{color:'#8B0000', alignSelf:'center'}}>All Fields Are Required *</Text>
                            <View style={{alignSelf:'center',flexDirection:'row',flex:3}}>
                            
                            {!this.state.flag?<TouchableOpacity
                                
                                onPressIn={this.StartRecording}
                                onPressOut={this.stopRecording}
                                
                            >
                                <Icon
                                reverse
                                name='mic'
                                type='feather'
                                color='#3C1053FF'
                                />
                            </TouchableOpacity>:
                            <TouchableOpacity
                                onPress={()=>this.playSound()}
                            >
                                <Icon
                                reverse
                                name='play'
                                type='feather'
                                color='#3C1053FF'
                                />
                            </TouchableOpacity>}
                            <Caption style={{alignSelf:'center'}}>{Math.round(this.state.recordingDuration)}:30</Caption>
                            </View>
                            <Overlay
                                isVisible={this.state.symSheet}
                                onBackdropPress={this.toggleSheet}
                                
                            >
                                <View style={{width:'80%'}}>
                                    <Title style={{alignSelf:'center'}}>Common Symptoms</Title>
                                    <CheckBox
                                        onPress={()=>this.setState({fever:!this.state.fever})}
                                        title='Fever'
                                        checked={this.state.fever}
                                    />
                                    <CheckBox
                                        onPress={()=>this.setState({headache:!this.state.headache})}
                                        title='Slight body aches or a mild headache'
                                        checked={this.state.headache}
                                    />
                                    <CheckBox
                                        onPress={()=>this.setState({flu:!this.state.flu})}
                                        title='Runny or Stuffy nose'
                                        checked={this.state.flu}
                                    />
                                    <CheckBox
                                        onPress={()=>this.setState({caugh:!this.state.caugh})}
                                        title='Caugh'
                                        checked={this.state.caugh}
                                    />
                                    <CheckBox
                                        onPress={()=>this.setState({sourthroat:!this.state.sourthroat})}
                                        title='Sore Throat'
                                        checked={this.state.sourthroat}
                                    />
                                </View>
                            </Overlay>
                            <Button 
                            icon='content-save' 
                            onPress={()=>this._sendRequest()} 
                            style={{width:200, alignSelf:'center',margin:10}} 
                            mode='contained' 
                            theme={Btonthemes}>
                            Add Case</Button>
                            

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
                    </ScrollView>
                </Modal>
                </View>
            </View>
        );
    }
}
export default PatientScreen;
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
    caption:{
        fontSize:25,
        left:20,
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
          width:"100%",
          backgroundColor:'#dddd'
        
      },
      modelbuttonview:{
          
          justifyContent:'space-around',
          padding:10,
          flexDirection:'row'
      },
      card:{
          margin:5,
          padding:10,
          elevation:20,
          color:'#ffff'
      },
      card2:{
        margin:5,
        padding:10,
        elevation:20,
        backgroundColor:'#7e8a97'
    },
      text:{
          fontSize:24,
          fontWeight:'bold'
      },
      fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
      },
});
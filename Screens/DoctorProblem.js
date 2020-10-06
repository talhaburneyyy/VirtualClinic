import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    DatePickerIOS,
    ToastAndroid
} from "react-native";
import { Title, Card,  ActivityIndicator, Caption,Button , IconButton, Snackbar } from "react-native-paper";
import {  Image, Overlay, Input, Slider, Icon } from "react-native-elements";
import { Picker } from "native-base";
import * as Constants from '../Configuration/ipconfig'
import {Audio} from 'expo-av';
class DoctorProblem extends Component {
    constructor(props){
        super(props);
        this.state={
            sno:'',
            isVisible:false,
            isPres:false,
            qty:0,
            selected:"key0",
            medname:'',
            prescription:'',
            dose:'',
            query:'',
            reqStatus:'',
            isShow:false,
            success:false,
            data1:'',
            isQVisible:false,
            serialno:''

        }
    }
    QtoggleOverlay=()=>{
        this.setState({isQVisible:!this.state.isQVisible});
    }
    onValueChange(value) {
        this.setState({
          selected: value
        });
      }
    toggleOverlay = () => {
        this.setState({isVisible:!this.state.isVisible});
      };
    toggleOverlay2 = () => {
        this.setState({isPres:!this.state.isPres});
      };
    toggleOverlay3 = () => {
        this.setState({isShow:!this.state.isShow});
      };
    async componentDidMount(){
        let {sno}=this.props.route.params;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getRequest?sno="+sno)
        .then((response)=>response.json())
        .then((data)=> this.setState({data:data[0]}))
        .catch(err=>console.log(err.message))
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getPrescription?sno="+sno)
        .then((response)=>response.json())
        .then((data)=>this.setState({reqStatus:data=='NULL'?'Prescribe':'Show Prescription',data1:data[0]}))
        .catch(err=>console.log(err.message))
        
    }
    sendPrescription= async ()=>{
        let {sno}=this.props.route.params;
        let {medname,qty,selected,prescription,dose} = this.state;
        let timing;
        if(selected=="key0"){
            ToastAndroid.show("Select Timing", ToastAndroid.LONG)
        }
        else if(selected=="key1")
            timing="Morning"
        else if(selected=="key2")
            timing="Morning + Evening"
        else if(selected=="key3")
            timing="Morning + Evening + Afternoon"
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/sendPrescription",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                sno:sno,
                medName:medname,
                quanity:qty,
                timing,
                prescription1:prescription,
                dose
            })
        }).then(response=>response.json()).then(data=>data=='SUCCESS'?this.setState({success:true,isPres:false}):null).catch(err=>console.log(err))
        this.componentDidMount()

        
    }
    sendQuery= async ()=>{
        let {sno}=this.props.route.params;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/sendQuery",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                sno:sno,
                query:this.state.query
            })
        }).then(response=>response.json()).then(data=>ToastAndroid.show(data,ToastAndroid.LONG)).catch(err=>console.log(err))
        this.QtoggleOverlay()
        this.componentDidMount()

        
    }
    async playSound(url){
        console.log(url)
        this.sound = new Audio.Sound();    
        await this.sound.loadAsync({uri:url},{shouldPlay:false},false);
        await this.sound.getStatusAsync().then(status=> console.log(status.durationMillis))
        .catch(err=>console.log(err));
        if(this.sound!=null){
            await this.sound.playAsync(); 
            await this.sound.setPositionAsync(0)
        }
        else
            console.log(null)
    }
    onDismissSnackBar = () => this.setState({success:false});
    render() {
        let {sno} = this.props.route.params
        return (
            <View style={styles.container}>
               {
                   this.state.data && 
                   <Card style={{flex:1,margin:5,padding:20}}>
                       <Text h1 style={{fontSize:30, alignSelf:'center'}}>{this.state.data.ProblemTitle}</Text>
                       <Text h4>Weight: {this.state.data.Weight}</Text>
                       <Text h4>Systolic Blood Pressure: {this.state.data.UBloodPressure} mmHg</Text>
                       <Text h4>Diastolic Blood Pressure: {this.state.data.LBloodPressure} mmHg</Text>
                       <Text h4>Temprature: {this.state.data.Temprature}</Text>
                       <Text h4>Sugar: {this.state.data.SugarLevel} mg/dl</Text>
                       
                        <Card style={{backgroundColor:'#808080',alignItems:'center',margin:5,padding:15}}>
                            <Text h2 style={{alignSelf:'center',textDecorationLine:'underline',color:'#eee'}}>Description</Text>
                            <Text h4 style={{color:'#eeee'}}>{this.state.data.ProblemDiscription}</Text>
                        </Card> 
                        
                        <Card style={{backgroundColor:'#808080',alignItems:'center',margin:5,padding:15}}>
                           <Title style={{alignSelf:'center'}}>Symptoms</Title>
                           <View style={{flexDirection:'row'}}>
                                {this.state.data.fever=="True"?
                                <View style={{width:40,margin:5,borderRadius:5,borderWidth:1, borderColor:'#FFCC00'}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Fever</Caption></View>:null}
                                {this.state.data.flu=="True"?
                                <View style={{width:30,margin:5,borderRadius:5,borderWidth:1, borderColor:'#FFCC00'}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Flu</Caption></View>:null}
                                {this.state.data.caugh=="True"?
                                <View style={{width:50,margin:5,borderRadius:5,borderWidth:1, borderColor:'#FFCC00'}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Caugh</Caption></View>:null}
                                {this.state.data.sorethroat=="True"?
                                <View style={{width:65,margin:5,borderRadius:5,borderWidth:1, borderColor:'#FFCC00'}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Sore Throat</Caption></View>:null}
                                {this.state.data.headache=="True"?
                                <View style={{width:60,margin:5,borderRadius:5,borderWidth:1, borderColor:'#FFCC00'}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Headache</Caption></View>:null}
                            </View>
                        </Card> 
                       
                        
                        {this.state.data.Problem_image && 
                        <Card style={{height:'25%'}}>
                            <TouchableOpacity   onPress={()=>this.setState({isVisible:!this.state.isVisible})}>
                            <Image PlaceholderContent={<ActivityIndicator/>}  style={{width:'100%', height:'100%', alignSelf:'center'}} source={{uri: `data:image/gif;base64,${this.state.data.Problem_image}`}} />
                            </TouchableOpacity> 
                            </Card>
                        }
                        {this.state.data.P_audio&&
                            <View style={{flexDirection:'row',backgroundColor:'#3C1053FF'}} >
                            <TouchableOpacity
                                onPress={()=>this.playSound(this.state.data.P_audio)}
                               
                            >
                                <Icon
                                reverse
                                name='play'
                                type='feather'
                                color='#dddd'
                                reverseColor='#3C1053FF'
                                style={{alignSelf:'center'}}
                                />
                            </TouchableOpacity>
                        
                        </View>
                        }
                        <View style={{flexDirection:'row',top:5,alignSelf:'center'}}>
                            <Button color='#3C1053FF' style={{margin:10}} onPress={this.state.reqStatus=='Show Prescription'?this.toggleOverlay3:this.toggleOverlay2} mode='outlined'>{this.state.reqStatus}</Button>
                            <Button color='#3C1053FF' onPress={()=>this.props.navigation.navigate('History',{serialno:this.state.data.SerialNo})} style={{margin:10}} mode='contained'>History</Button>
                            <Button color='#3C1053FF' style={{margin:10}} onPress={this.QtoggleOverlay} mode='outlined'>Query</Button>
                        </View>
                        <Overlay
                        isVisible={this.state.isVisible}
                        onBackdropPress={this.toggleOverlay}
                        fullScreen={true}
                        >
                            <TouchableOpacity  onPress={()=>this.setState({isVisible:!this.state.isVisible})}>
                            <Image PlaceholderContent={<ActivityIndicator/>}  style={{width:'100%', height:'100%', alignSelf:'center'}} source={{uri: `data:image/gif;base64,${this.state.data.Problem_image}`}} />
                            </TouchableOpacity>
                        </Overlay>
                        <Overlay
                        isVisible={this.state.isQVisible}
                        onBackdropPress={this.QtoggleOverlay}
                        overlayStyle={{width:350}}
                        >
                            <View>
                                <Input onChangeText={text=>this.setState({query:text})} multiline={true} label="Query" placeholder="Enter Your Query"/>
                                <Button color='#3C1053FF' onPress={this.sendQuery} mode='contained'>Send Query</Button>
                            </View>
                        </Overlay> 
                        <Overlay
                        isVisible={this.state.isPres}
                        onBackdropPress={this.toggleOverlay2}
                        overlayStyle={{width:'95%',height:'65%'}}
                        >
                            <View style={{flex:1}}>

                                <Title style={{alignSelf:'center'}}>Prescription</Title>
                                <Input onChangeText={text=>this.setState({medname:text})} label='Medcine' placeholder='Medcine Name'/>
                                <View style={{flexDirection:'row'}}>
                                    <Title style={{flex:1}}>Quantity:</Title>
                                    <View style={{flex:1, flexDirection:'row',justifyContent:'flex-end'}}>
                                        <IconButton onPress={()=>this.setState({qty:this.state.qty>0?this.state.qty-1:this.state.qty})} icon='minus'/>
                                        <Caption style={{fontSize:20,top:15}}>{this.state.qty}</Caption>
                                        <IconButton onPress={()=>this.setState({qty:this.state.qty+1})} icon='plus'/>
                                    </View>
                                </View>
                                <View>
                                    <Picker
                                            style={{top:0}}
                                            note
                                            mode='dialog'
                                            selectedValue={this.state.selected}
                                            onValueChange={value=>this.onValueChange(value)}
                                    >
                                            <Picker.Item label="Select Timing" value="key0"/>
                                            <Picker.Item label="Morning" value="key1" />
                                            <Picker.Item label="Morning + Evening" value="key2" />
                                            <Picker.Item label="Morning + Afternoon + Evening" value="key3" />
                                    </Picker>
                                    <Input onChangeText={text=>this.setState({prescription:text})} multiline={true} label='Prescription' placeholder='Enter Prescription'/>
                                    <Input onChangeText={text=>this.setState({dose:text})} label='Dose' placeholder='Enter Dose'/>
                                   
                                    
                                    <Button color='#3C1053FF' onPress={this.sendPrescription} mode='contained'>
                                        Send Prescription
                                    </Button>
                                </View>
                            </View>
                        </Overlay>
                        <Overlay
                        isVisible={this.state.isShow}
                        onBackdropPress={this.toggleOverlay3}
                        overlayStyle={{alignItems:'center'}}
                        >   
                            <View>
                                <Title style={{alignSelf:'center'}}>Prescription</Title>
                                <Text style={{fontSize:25,textAlign:'left'}}>Medcine Name: {this.state.data1.medName} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Quantity: {this.state.data1.quanity} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Timing: {this.state.data1.timing} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Prescription:{this.state.data1.prescription1} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Doseage: {this.state.data1.dose} </Text>
                            </View>
                        </Overlay>
                        <Snackbar
                            visible={this.state.success}
                            onDismiss={this.onDismissSnackBar}
                        >
                            Prescription Sent..!
                        </Snackbar>
                   </Card>
                   
                }
               
               
               
            </View>
        );
    }
}
export default DoctorProblem;

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor:'#dddd'
    }
});
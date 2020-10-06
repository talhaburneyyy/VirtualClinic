import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    ToastAndroid,
    TouchableOpacity
} from "react-native";
import { Title, Card,Button,  ActivityIndicator, Divider } from "react-native-paper";
import { Text, Image, Overlay, Input, Icon, Slider } from "react-native-elements";
import * as Constants from '../Configuration/ipconfig'
import {Audio} from 'expo-av';
class ProblemScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            sno:'',
            data:null,
            reply:null,
            medName:'',
            prescription:'',
            dose:'',
            timing:'',
            qty:'',
            isShow:false,
            isVisibleOverlay:false,
            answer:''
        }
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
    async componentDidMount(){
        let {sno}=this.props.route.params;
        
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getPatRequest?sno="+sno)
        .then((response)=>response.json())
        .then((data)=> this.setState({data:data[0]}))
        .catch(err=>console.log(err.message))
        
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getSoluionRequest?sno="+sno)
        .then((response)=>response.json())
        .then((data)=> this.setState({reply:data[0]}))
        .catch(err=>console.log(err.message))
        
    }
    toggleOverlay3 = () => {
        this.setState({isShow:!this.state.isShow});
      }
    toggleOverlay4 = () => {
        this.setState({isVisibleOverlay:!this.state.isVisibleOverlay});
    }
    sendAnswer = async () => {
        let {sno} = this.props.route.params;
        
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/sendAnswer",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                sno,
                answer:this.state.answer
            })
        })
        .then((response)=>response.json())
        .then((data)=> ToastAndroid.show(data, ToastAndroid.LONG))
        .catch(err=>console.log(err.message))
        this.toggleOverlay4()
    }
    render() {
        return (
            <View style={styles.container}>
               {
                   this.state.data && 
                   <Card style={{flex:1,margin:5,padding:20}}>
                       <Text h1 style={{fontSize:30, alignSelf:'center'}}>{this.state.data.ProblemTitle}</Text>
                       <Text h4>Weight: {this.state.data.Weight}</Text>
                       <Text h4>Blood Pressure: {this.state.data.BloodPressure} mmHg</Text>
                       <Text h4>Temprature: {this.state.data.Temprature}</Text>
                       <Text h4>Sugar: {this.state.data.SugarLevel} mg/dl</Text>
                       <Text h4>Discription:</Text>
                        <Card style={{backgroundColor:'#808080',alignItems:'center',margin:10,padding:15}}>
                            <Text h4 style={{color:'#eeee'}}>{this.state.data.ProblemDiscription}</Text>
                        </Card> 
                       {this.state.data.Problem_image && <Image PlaceholderContent={<ActivityIndicator/>} style={{width:'100%', height:'75%', alignSelf:'center'}} source={{uri: `data:image/gif;base64,${this.state.data.Problem_image}`}} />}
                        {this.state.data.query &&
                            <Button onPress={this.toggleOverlay4} mode='outlined'>Doctor's Query</Button>
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
                    {this.state.reply && <Button style={{margin:10, position:'absolute',bottom:0,alignSelf:'center'}} onPress={this.toggleOverlay3} mode='outlined'>Prescription</Button>}
                    <Overlay
                    isVisible={this.state.isVisibleOverlay}
                    onBackdropPress={this.toggleOverlay4}
                    overlayStyle={{width:350}}
                >
                <View>
                    <Title style={{alignSelf:'center'}}>Doctor's Query</Title>
                    {this.state.data.query&&<Text h4>{this.state.data.query}</Text>}
                    {!this.state.reply && <Input multiline={true} label='Answer' placeholder='Enter Your Answer' onChangeText={text=>this.setState({answer:text})}/>}
                    <Button onPress={this.sendAnswer}>Send Answer</Button>
                </View>
               </Overlay>
                   </Card>
                }
               {this.state.reply && <Overlay
                        isVisible={this.state.isShow}
                        onBackdropPress={this.toggleOverlay3}
                        overlayStyle={{height:'50%',width:'90%'}}
                        >   
                            <View style={{flex:1}}>
                                <Title style={{alignSelf:'center'}}>Prescription</Title>
                                <Divider/>
                                <View style={{flex:1,padding:5}}>
                                    <View style={{flex:2, flexDirection:'row'}}>
                                        <Title style={{flex:1, fontSize:25}}>Medcine Name:  </Title>
                                        <Text style={{flex:1,fontSize:20}}>{this.state.reply.medName}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,padding:5}}>
                                    <View style={{flex:2, flexDirection:'row'}}>
                                        <Title style={{flex:1, fontSize:25}}>Quantity:  </Title>
                                        <Text style={{flex:1,fontSize:20}}>{this.state.reply.quanity}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,padding:5}}>
                                    <View style={{flex:2, flexDirection:'row'}}>
                                        <Title style={{flex:1, fontSize:25}}>Timing:  </Title>
                                        <Text style={{flex:1,fontSize:20}}>{this.state.reply.timing}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,padding:5}}>
                                    <View style={{flex:2, flexDirection:'row'}}>
                                        <Title style={{flex:1, fontSize:25}}>Prescription:  </Title>
                                        <Text style={{flex:1,fontSize:20}}>{this.state.reply.prescription1}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,padding:5}}>
                                    <View style={{flex:2, flexDirection:'row'}}>
                                        <Title style={{flex:1, fontSize:25}}>Doseage:  </Title>
                                        <Text style={{flex:1,fontSize:20}}>{this.state.reply.dose}</Text>
                                    </View>
                                </View>
                            </View>
                        </Overlay>}
               
            </View>
        );
    }
}
export default ProblemScreen;

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor:'#dddd'
    }
});
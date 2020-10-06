import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    ToastAndroid,
    FlatList,
    TouchableOpacity
} from "react-native";
import { TextInput, Button, Card, Avatar, Title, Caption, Subheading, IconButton, ActivityIndicator, Divider, Switch} from 'react-native-paper'
import { Icon, Overlay } from "react-native-elements";
import * as Constant from '../Configuration/ipconfig'
class DoctorScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            did:'Null',
            clinic:'',
            drname:'',
            refreshing:false,
            reply:'',
            show:false,
            side:'Doctor',
            isVisible:false,
            docDetails:null,
            isSwitchOn:false
        }
    }
    medicalEmergency(up,lp){
        if(up >= 130 && lp >= 90)
            return <View style={{left:15,borderRadius:5,borderWidth:1, borderColor:'#F32013', width:110}}><Caption style={{alignSelf:'center',color:'#F32013'}}>High Blood Pressure</Caption></View>
        else if(up <= 100 && lp <= 70)
            return <View style={{left:15,borderRadius:5,borderWidth:1, borderColor:'#F32013', width:110}}><Caption style={{alignSelf:'center',color:'#F32013'}}>Low Blood Pressure</Caption></View>
    }
    sugarWarning(sugarlevel){
        if(sugarlevel >= 200)
            return <View style={{left:15,borderRadius:5,borderWidth:1, borderColor:'#FFCC00', width:110}}><Caption style={{alignSelf:'center',color:'#FFCC00'}}>Diabetic Patient </Caption></View>
    }
    async componentDidMount(){
        this.setState({show:true})
        let {email} = this.props.route.params;
        let {password} = this.props.route.params;
        
        await fetch("http://"+Constant.ipAddress+"/Api/api/Doctor/getDoctor?email="+email+'&pass='+password)
        .then((response)=>response.json())
        .then(data=> this.setState({docDetails:data[0]}))
        .catch(err=>console.log(err.message))
        this.props.navigation.setOptions({
            title:'Doctor Panel',
        })
        this._fetchData()
        this.setState({show:false,isSwitchOn:this.state.docDetails.availbilitystatus=="true"?true:false})
       
    }
    async _fetchData(){
        let {docDetails} = this.state;
        
        await fetch("http://"+Constant.ipAddress+"/Api/api/Doctor/getRequests?cnic="+docDetails.D_cnic)
        .then((response)=>response.json())
        .then(data=>this.setState({list:data}))
        .catch(err=>console.log(err.message))
        this.setState({refreshing:false})
    }
    _handleRefresh=()=>{
        this.setState({refreshing:true})
        this._fetchData()
    }
    async _CloseRequest(sno) {
        await fetch("http://"+Constant.ipAddress+"/Api/api/Request/modifyRequest?sno="+sno,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then((response)=>response.json())
        .then(data=>ToastAndroid.show(data,ToastAndroid.LONG))
        .catch(err=>console.log(err.message))
    } 
    toggleOverlay = () => {
        this.setState({isVisible:!this.state.isVisible});
      };
    onToggleSwitch = async () => {
        await this.setState({isSwitchOn:!this.state.isSwitchOn})
        if(this.state.isSwitchOn){
            await fetch("http://"+Constant.ipAddress+"/Api/api/Doctor/availability?Dcnic="+this.state.docDetails.D_cnic+"&status="+this.state.isSwitchOn,{
                method:'POST',
            }).then(res=>res.json()).then(data=>ToastAndroid.show(data=="true"?"Online":"Offline",ToastAndroid.LONG)).catch(err=>console.log(err))
        
        }else{
            await fetch("http://"+Constant.ipAddress+"/Api/api/Doctor/availability?Dcnic="+this.state.docDetails.D_cnic+"&status="+this.state.isSwitchOn,{
                method:'POST',
            }).then(res=>res.json()).then(data=>ToastAndroid.show(data=="true"?"Online":"Offline",ToastAndroid.LONG)).catch(err=>console.log(err))
        
        }
       
      };

    render() {
        
        return (
            <View style={styles.container}>
                {this.state.docDetails && <Card style={{backgroundColor:'#3C1053FF',margin:5,padding:10}}>
                                {this.state.docDetails.image == null? <Avatar.Text style={{alignSelf:'center',margin:5}} theme={Btonthemes} size={74} label={this.state.docDetails.D_name[0]} /> : this.state.docDetails.image && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${this.state.docDetails.image}`}}/>}
                                <View>
                                    <Title style={{fontFamily:'sans-serif',fontSize:30,color:'#ddd',alignSelf:'center'}}>Dr. {this.state.docDetails.D_name}</Title>
                                    <Text style={{fontFamily:'sans-serif',fontSize:15,color:'#ddd',alignSelf:'center'}}>{this.state.docDetails.D_location}</Text>
                                    <Text style={{fontFamily:'sans-serif',fontSize:15,color:'#ddd',alignSelf:'center',margin:5}}>{this.state.docDetails.D_phoneno}</Text>
                                    <View style={{flexDirection:'row'}}>
                                    <View style={{flex:1,alignItems:'flex-start'}}>
                                    <Icon name='pencil-square-o' type='font-awesome'  color='#ddd' onPress={()=>{this.props.navigation.navigate('DoctorProfile',{D_cnic:this.state.docDetails.D_cnic})}}/>
                                    </View>
                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                    <Switch disabled={true} color='#32CD32'  value={this.state.isSwitchOn} onValueChange={this.onToggleSwitch} />
                                    {this.state.isSwitchOn?<Text style={{color:'#ddd'}}>Online</Text>:<Text style={{color:'#ddd'}}>Offline</Text>}
                                    </View>
                                    </View>
                                </View>
                            </Card>}
                        <Divider/>
                <ActivityIndicator color='#3C1053FF' style={{position:'absolute',top:350,alignSelf:'center'}} size='large' animating={this.state.show}/>
                {this.state.list && <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    data={this.state.list}
                    renderItem={({item})=>{
                        return  (<Card style={item.Doc_Read=='0'?styles.card2:styles.card}>
                            <View>
                                    <TouchableOpacity onLongPress={()=>{this.setState({isVisible:!this.state.isVisible})}} style={{flexDirection:'row'}}>
                                        <View style={{left:15,justifyContent:'center'}}>
                                        {item.Doc_Read=='0'?<Title>{item.P_name}</Title>:
                                            <Text style={{fontSize:20}}>{item.P_name}</Text>}
                                        </View>
                                        <View style={{right:15,flex:1,alignItems:'flex-end',justifyContent:'center'}}>
                                            <Icon  name='arrow-right' type='simple-line-icon' size={15}  onPress={()=>this.props.navigation.navigate('DoctorProblem',{sno:item.sno})}/>
                                        </View>
                                    </TouchableOpacity>
                                    {this.medicalEmergency(item.UBloodPressure,item.LBloodPressure)}
                                    {this.sugarWarning(item.SugarLevel)}
                                    
                            </View>
                        </Card>)
                    }}
                    keyExtractor={item=>item.sno.toString()}
                    style={{flex:1}}
                />}
               </View>
        );
    }
}
export default DoctorScreen;
const Btonthemes = {
    colors: {
      primary: '#dddd',
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
          margin:5,
          padding:10
      },
      card2:{
          margin:5,
          padding:10,
          backgroundColor:'#7e8a97'
      },
      text:{
          fontSize:24,
          fontWeight:'bold'
      }
});
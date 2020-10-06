import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Image,
    FlatList,
    ToastAndroid,
    Text,
    TouchableOpacity
} from "react-native";
import { Button, Card, Avatar, Title, Caption, Subheading, ActivityIndicator, Divider} from 'react-native-paper'
import {Rating, Overlay} from 'react-native-elements'
import * as Constants from '../Configuration/ipconfig'
class DoctorDetailScreen extends Component {
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
            isVisible:false,
            Problem_Image:null,
            isShow:false
        }
    }
    ratingCompleted=async (rating,D_cnic,reqno)=> {
        console.log(rating+D_cnic+reqno)
        await fetch("http://"+Constants.ipAddress+"/Api/api/Auditor/rateDoctor",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                rating,
                cnic:D_cnic,
                reqno
            })
        })
        .then((response)=>response.json())
        .then(data=>ToastAndroid.show(data,ToastAndroid.LONG))
        .catch(err=>console.log(err.message))
    }
    async componentDidMount(){
        this.setState({show:true})
        let {email} = this.props.route.params;
        let {password} = this.props.route.params;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/getDoctor?email="+email+'&pass='+password)
        .then((response)=>response.json())
        .then(data=>this.setState({drname:data[0].D_name, did:data[0].D_cnic}))
        .catch(err=>console.log(err.message))
        this.props.navigation.setOptions({
            title:this.state.drname,
        })
       this._fetchData()
       this.setState({show:false})
    }
    async _fetchData(){
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/getDocRequests?cnic="+this.state.did)
        .then((response)=>response.json())
        .then(data=>this.setState({list:data}))
        .catch(err=>console.log(err.message))
        this.setState({refreshing:false})
        
    }
    _handleRefresh=()=>{
        this.setState({refreshing:true})
        this._fetchData()
    }
    toggleOverlay2 = () => {
        this.setState({isVisible:!this.state.isVisible});
      };
    toggleOverlay3 = () => {
        this.setState({isShow:!this.state.isShow});
      };
    showImage(img){
        this.setState({Problem_Image:img,isVisible:true})
    }
    async showPrescription(sno){
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getSoluionRequest?sno="+sno)
        .then((response)=>response.json())
        .then((data)=> this.setState({reply:data[0],isShow:true}))
        .catch(err=>console.log(err.message))
    }
    render() {
        
        return (
            <View style={styles.container}>

                <ActivityIndicator style={{position:'absolute',top:350,alignSelf:'center'}} size='large' animating={this.state.show}/>
                {this.state.list && <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    data={this.state.list}
                    renderItem={({item})=>{
                        return  (<Card style={styles.card}>
                            <View>
                                    <View style={{flexDirection:'row'}}>
                                        {item.image == null ? <Avatar.Text theme={Btonthemes} size={54} label={item.P_name[0]} /> : <Image style={{width:50, height:50, borderRadius:25}} source={{uri: `data:image/gif;base64,${item.image}`}} />}
                                        <View style={{left:15}}>
                                            <Title>{item.P_name}</Title>
                                            <Caption>{item.postdate.split('T')[0]} - {item.P_time}</Caption>
                                        </View>

                                    </View>    
                                        <Subheading style={{alignSelf:'center', fontSize:22, fontWeight:'bold'}}>{item.ProblemTitle}</Subheading>
                                        <Card>
                                            <View style={{flexDirection:'row',flex:2}}>
                                                <Text style={{flex:1,fontWeight:'bold',fontSize:20}}>Weight:</Text>
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.Weight}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',flex:2}}>
                                                <Text style={{flex:1,fontWeight:'bold',fontSize:20}}>Temprature:</Text>
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.Temprature}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',flex:2}}>
                                                <Text style={{flex:1,fontWeight:'bold',fontSize:20}}>Blood Pressure:</Text>
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.BloodPressure}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',flex:2}}>
                                                <Text style={{flex:1,fontWeight:'bold',fontSize:20}}>Sugar Level:</Text>
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.SugarLevel}</Text>
                                            </View>
                                            <View style={{flexDirection:'row',flex:2}}>
                                                <Text style={{flex:1,fontWeight:'bold',fontSize:20}}>Description:</Text>
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.ProblemDiscription}</Text>
                                            </View>
                                            {
                                                item.Problem_image&&<View>
                                                <Button theme={Btonthemes} style={{width:150,alignSelf:'center',margin:5}} onPress={()=>this.showImage(item.Problem_image)} mode='outlined'>Show Image</Button>
                                                </View>}
                                            {   item.status=="Answered"&&<View>
                                                <Button theme={Btonthemes} style={{width:150,alignSelf:'center',margin:5}} onPress={()=>this.showPrescription(item.sno)} mode='outlined'>Prescription</Button>
                                                </View>}
                                            
                                        </Card>
                                               
                                    {item.status=="Answered"?
                                    item.flag=="True"?
                                    <Rating
                                        type='star'
                                        showRating
                                        imageSize={20}
                                        readonly
                                        startingValue={item.rating}
                                        ratingTextColor='#3C1053FF'
                                        style={{ paddingVertical: 10 }}
                                    />
                                    :<Rating
                                        type='star'
                                        showRating
                                        imageSize={20}
                                        startingValue={1}
                                        minValue={1}
                                        ratingTextColor='#3C1053FF'
                                        onFinishRating={rating=>this.ratingCompleted(rating,item.D_cnic,item.sno)}
                                        style={{ paddingVertical: 10 }}
                                    />:<Caption>Prescription Pending</Caption>}
                                    <Divider/>
                                    
                            </View>
                        </Card>)
                    }}
                    keyExtractor={item=>item.sno.toString()}
                    style={{flex:1}}
                />
                }
                <Overlay
                        isVisible={this.state.isShow}
                        onBackdropPress={this.toggleOverlay3}
                        overlayStyle={{alignItems:'center'}}
                        >   
                            <View>
                                <Text style={{fontSize:25,textAlign:'left'}}>Medcine Name: {this.state.reply.medName} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Quantity: {this.state.reply.quanity} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Timing: {this.state.reply.timing} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Prescription:{this.state.reply.prescription1} </Text>
                                <Text style={{fontSize:25,textAlign:'left'}}>Doseage: {this.state.reply.dose} </Text>
                            </View>
                        </Overlay>
                <Overlay
                    isVisible={this.state.isVisible}
                    onBackdropPress={this.toggleOverlay2}
                    fullScreen={true}
                >
                        <TouchableOpacity  onPress={()=>this.setState({isVisible:!this.state.isVisible})}>
                        <Image PlaceholderContent={<ActivityIndicator/>}  style={{width:'100%', height:'100%', alignSelf:'center'}} source={{uri: `data:image/gif;base64,${this.state.Problem_Image}`}} />
                        </TouchableOpacity>
                    </Overlay>
               </View>
        );
    }
}
export default DoctorDetailScreen;
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
          margin:5,
          padding:10
      },
      text:{
          fontSize:24,
          fontWeight:'bold'
      }
});
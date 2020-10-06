import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Image,Alert,Text, ToastAndroid
} from "react-native";
import { Button, Card, Avatar, Title, Caption, ActivityIndicator,Subheading, Divider} from 'react-native-paper'
import {Icon} from 'react-native-elements'
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import * as Constants from '../Configuration/ipconfig'
import { Input, Overlay, Rating } from "react-native-elements";
import SwitchSelector from 'react-native-switch-selector';
var radio_props = [
    {label: 'Doctors', value: 0 },
    {label: 'Cases', value: 1 }
  ];
class ClinicScreen extends Component {
    constructor(props){
        super(props);
        this.state={
            list:[],
            Audname:'',
            cid:'Null',
            clinic:'',
            badge:1,
            value:'',
            visible:false,
            name:'',
            img:'',
            loc:'',
            email:'',
            phoneno:'',
            quali:'',
            speciality:' ',
            rating:' ',
            cnic:' ',
            value:0,
            list2:[],
            clinicc:'',
            drname:'',
            refreshing:false,
            reply:'',
            show:false,
            isVisible:false,
            Problem_Image:null,
            isShow:false
        }
    }
    async componentDidMount(){
        await this.fetchDetail()

        this.props.navigation.setOptions({
            title:this.state.Audname,
        })
        await this.getDoctors()
        this.setState({show:true})
        this._fetchData()
        this.setState({show:false})
    }
    async fetchDetail(){
        let {email,password} = this.props.route.params;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Auditor/getName?id="+email+'&password='+password)
        .then((response)=>response.json())
        .then(data=>this.setState({Audname:data[0].name}))
        .catch(err=>console.log(err.message))
    }
    async getDoctors(){
        await fetch("http://"+Constants.ipAddress+"/Api/api/Auditor/getDoctors")
        .then((response)=>response.json())
        .then(data=>data=='Not Found'?this.setState({list:[]}):this.setState({list:data}))
        .catch(err=>console.log(err.message))
    }
    searchDoctor = async () => {
        console.log(this.state.value)
        await fetch("http://"+Constants.ipAddress+"/Api/api/Auditor/searchDoctor?value="+this.state.value)
        .then(response=>response.json())
        .then(data=>this.setState({list:data}))
        .catch(err=>console.log(err))
    }
    toggleOverlay= ()=>{
        this.setState({visible:!this.state.visible})
      };
    setData(name,img,rating,email,loc,phno,sp,quali, Dcnic){
        this.setState({name:name,
            img:img,
            rating:rating,
            email,loc,quali,sp,phno,cnic:Dcnic,visible:!this.state.visible})
      }
     async BlockDoctor(cnic){
         console.log(cnic)
        await fetch("http://"+Constants.ipAddress+"/Api/api/Admin/blacklist?cnic="+cnic,
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          }
        })
        .then(response=>response.json())
        .then(data=>Alert.alert('Information', data))
        .catch(err=>console.log(err))
        this.toggleOverlay()
        this.componentDidMount()
    }
    ratingCompleted=async (rating,reqno)=> {
        
        await fetch("http://"+Constants.ipAddress+"/Api/api/Auditor/rateDoctor",{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                rating,
                reqno
            })
        })
        .then((response)=>response.json())
        .then(data=>ToastAndroid.show(data,ToastAndroid.LONG))
        .catch(err=>console.log(err.message))
    }
    async _fetchData(){
        await fetch("http://"+Constants.ipAddress+"/Api/api/Doctor/getAllRequests")
        .then((response)=>response.json())
        .then(data=>this.setState({list2:data}))
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
    renderData(){
        if(this.state.value===0)
        {
            return (
                <View style={{flex:1}}>
                <Card style={{margin:15, elevation:20,padding:15}}>
                    <Input onChangeText={text=>this.setState({value:text})} label='SEARCH DOCTOR' placeholder='Name, City, Clinic'
                        rightIcon={
                           <Icon
                            name='search'
                            type='feather'
                            size={24}
                            color='black'
                            onPress={this.searchDoctor}    
                            />
                        }
                        
                            
                    />
                </Card>
                {this.state.list.length ? <FlatList
                    data={this.state.list}
                    renderItem={({item})=>{
                        return  (<Card style={styles.card}>
                        <TouchableOpacity 
                        onLongPress={()=>this.setData(item.D_name,item.image,item.D_rating,item.D_email,item.D_location,item.D_phoneno,item.speciality,item.qualification,item.D_cnic)}
                        onPress={()=>this.props.navigation.navigate('DoctorDetail',{email:item.D_email,password:item.D_password})}>
                            <View style={{justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>
                            <View>
                                { item.image && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${item.image}`}}/>}
                
                            </View>
                            <View style={{alignItems:'center'}}>
                                <Title>{item.D_name}</Title>
                                <Caption>{item.D_location}</Caption>
                                <Caption>{item.D_email}</Caption>
                            </View>
                            <View style={{flexDirection:'column',alignItems:'center'}}>
                                <Avatar.Icon theme={Btonthemes} size={24} icon="star-outline" />
                                <Caption>Rating {parseInt(item.D_rating)}</Caption>
                            </View>  
                            </View>
                        </TouchableOpacity>
                        </Card>)
                    }}
                    keyExtractor={item=>item.D_cnic}
                    style={{flex:1}}
                />:<Caption style={{top:350,alignSelf:'center'}}>No Doctor Registered</Caption>
                }
                <Overlay
                    isVisible={this.state.visible}
                    onBackdropPress={this.toggleOverlay}
                    overlayStyle={{width:'85%'}}
                    transparent={true}
                >
                    <Card style={{ width:'100%',padding:10}}>
                        {this.state.img && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${this.state.img}`}}/>}
                        <Title>Name: {this.state.name}</Title>
                        <Title>Email: {this.state.email}</Title>
                        <Title>Location: {this.state.loc}</Title>
                        <Title>Phone No.: {this.state.phoneno}</Title>
                        <Title>Qualification: {this.state.quali}</Title>
                        <Title>Speciality: {this.state.speciality}</Title>
                        <Title>Rating: {this.state.rating}</Title>
                        <Button theme={Btonthemes} mode='outlined' onPress={()=>this.BlockDoctor(this.state.cnic)}>Block Doctor</Button>
                    </Card>
                </Overlay>
                </View>
            );
        }
        else if(this.state.value===1){
            return (
            <View style={{flex:1}}>
                <ActivityIndicator style={{position:'absolute',top:350,alignSelf:'center'}} size='large' animating={this.state.show}/>
                {this.state.list && <FlatList
                    refreshing={this.state.refreshing}
                    onRefresh={this._handleRefresh}
                    data={this.state.list2}
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
                                                <Text style={{flex:1,fontWeight:'100',fontSize:20}}>{item.UBloodPressure}/{item.LBloodPressure}</Text>
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
                                        onFinishRating={rating=>this.ratingCompleted(rating,item.sno)}
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
            </View>);
        }
    }
    render() {
       
        return (
            <View style={styles.container}>
                <SwitchSelector
                    options={radio_props}
                    initial={this.state.value}
                    buttonColor="#3C1053FF"
                    onPress={async (abc) => { await this.setState({value:abc})}} 
                    style={{margin:10}}
                />
                {this.renderData()}
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
          margin:5,
          borderRadius:20,
          padding:20
      },
      text:{
          fontSize:24,
          fontWeight:'bold'
      }
});
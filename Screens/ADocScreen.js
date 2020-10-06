import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    Image,Alert
} from "react-native";
import { Button, Card, Avatar, Title, Caption, Badge} from 'react-native-paper'
import {Icon} from 'react-native-elements'
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import * as Constants from '../Configuration/ipconfig'
import { Input, Overlay } from "react-native-elements";


class ADocScreen extends Component {
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
            cnic:' '
        }
    }
    async componentDidMount(){
        await this.fetchDetail()

        this.props.navigation.setOptions({
            title:this.state.Audname,
        })
        await this.getDoctors()
       
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
    render() {
       
        return (
            <View style={styles.container}>
               
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
}
export default ADocScreen;
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
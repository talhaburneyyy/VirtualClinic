import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import {Avatar, Divider, Caption, Title, Card} from 'react-native-paper'
import { FlatList } from "react-native-gesture-handler";
import {LinearGradient} from 'expo-linear-gradient'
import * as Constants from '../Configuration/ipconfig'
class PatientDetailScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            list:[],
            cnic:'',
            age:'',
            gender:'',
            image:null,
            name:'',
            totalRequests:0,
            totalActiveRequests:0,
            totalClosedRequests:0,
        }
    }

    async componentDidMount(){
        let {number}=this.props.route.params;
        await fetch("http://"+Constants.ipAddress+"/Api/api/Patient/Detail?number="+number)
        .then((response)=>response.json())
        .then((data)=>{
            this.setState({
                name:data[0].name,
                image:data[0].image,
                age:data[0].age,
                gender:data[0].gender,
                cnic:data[0].C_cnic,
                
            })
        })
        .catch((error)=>console.log(error))
        await fetch("http://"+Constants.ipAddress+"/Api/api/Patient/totalRequests?serialno="+number)
        .then((response)=>response.json())
        .then((data)=>{
            this.setState({
                totalRequests:data[0],
                totalActiveRequests:data[1],
                totalClosedRequests:data[2]
            })
        })
        .catch((error)=>console.log(error))
       
    }
    
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.aboveView}>
                <LinearGradient
                    colors={['#dddd', 'rgba(60, 16, 83, 1.00)']}
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top:0,
                        height: 150,
                    }}
                    />
                </View>
                <View style={styles.topImg}>
                    {this.state.image == null ? <Avatar.Text theme={Btonthemes} size={150} label={this.state.name[0]} /> : 
                    <Image style={{width:150, height:150, borderRadius:75}} source={{uri: `data:image/gif;base64,${this.state.image}`}} />}
                    <Text style={styles.title}>{this.state.name}</Text>
                    <Text>Gender: {this.state.gender=='M'?'Male':'Female'}</Text>
                    <Text>Age: {this.state.age}</Text>
                   
                </View>
                <View style={{top:160,height:440}}>
                <Divider/>
                <View style={{flex:2}}>
                    <View style={{flex:1,flexDirection:'row',}}>
                    <Card style={{padding:70,alignItems:'center',flex:1,backgroundColor:'#32CD32'}}>
                            <Title>Active</Title>
                            <Caption style={{alignSelf:'center',fontSize:20}}>{this.state.totalActiveRequests}</Caption>
                        </Card>                        
                        <Card style={{padding:70,alignItems:'center',flex:1,backgroundColor:'#DC143C'}}>
                            <Title>Closed</Title>
                            <Caption style={{alignSelf:'center',fontSize:20}}>{this.state.totalClosedRequests}</Caption>
                        </Card>  
                    </View>
                    <Divider/>
                    <View style={{flex:1,flexDirection:'row',}}>
                        <Card style={{padding:75,alignItems:'center',flex:1,borderWidth:0.3}}>
                            <Title style={{fontSize:31}}>Total Requests</Title>
                            <Caption style={{alignSelf:'center',fontSize:20}}>{this.state.totalRequests}</Caption>
                        </Card>                      
                    </View>
                        
                            
                    
                </View>
                </View>
            </View>
        );
    }
}
export default PatientDetailScreen;
const Btonthemes = {
    colors: {
      primary: '#dddddd',
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
        flex: 2,
    },
    aboveView:{
        height:150,
    },
    topImg:{
        top:65,
        elevation:20,
        position:'absolute',
        alignSelf:'center',
        width:150,
        height:150,
        borderWidth:0,
        borderRadius:75,
        alignItems:'center'
        
    },
    title:{
        fontSize:30,
        fontWeight:'bold',
        color:'#3C1053FF'
    }
});
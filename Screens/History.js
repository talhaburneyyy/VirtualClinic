import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity
} from "react-native";
import {Title, Divider, Card, ActivityIndicator, Button} from 'react-native-paper'
import {Icon, Image, Overlay} from 'react-native-elements'
import * as Constants from '../Configuration/ipconfig'

class HistoryScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            list:null,
            reply:null,
            isShow:false
        }
        
        
    }
    visits(){
        this.setState({visits:this.state.visits+1})
    }
    async _fetchData(){

        let {serialno}=this.props.route.params;
        console.log(serialno)
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getHistory?serialno="+serialno)
        .then((response)=>response.json())
        .then(data=>this.setState({list:data}))
        .catch(err=>console.log(err.message))
        console.log(this.state.list)
    }
    toggleOverlay3 = () => {
        this.setState({isShow:!this.state.isShow});
      }
    componentDidMount(){

       this._fetchData();
    }
    async showPrescription(sno){
        await fetch("http://"+Constants.ipAddress+"/Api/api/Request/getSoluionRequest?sno="+sno)
        .then((response)=>response.json())
        .then((data)=> this.setState({reply:data[0]}))
        .catch(err=>console.log(err.message))
        this.toggleOverlay3()
    }
    render(){
        
        return(
           <View style={styles.container}>
            <Text style={{fontSize:30, alignSelf:'center',fontWeight:'bold'}}>Patient Visits</Text>
            <Divider/>
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
            { <FlatList
                    data={this.state.list}
                    renderItem={({item})=>{
                        return  (
                            <Card style={{margin:5,padding:20}}>
                                <Title style={{alignSelf:'center',fontSize:30}}>{item.ProblemTitle}</Title>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Discription</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.ProblemDiscription}</Text>
                                </View>
                                
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Blood Pressure</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.LBloodPressure}-{item.UBloodPressure}</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Temprature</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.Temprature}</Text>
                                </View>
                                
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Sugar Level</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.SugarLevel}</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Weight</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.Weight}</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Date Of Visit</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.postdate.toString().split('T')[0]}</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Doctor</Text>
                                    <Text style={{flex:1,fontSize:20}}>Dr. {item.D_name}</Text>
                                </View>
                                <View style={{flexDirection:'row',flex:2}}>
                                    <Text style={{flex:1,fontSize:20}}>Clinic Name</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.C_name}</Text>
                                </View>
                                <View>
                                    <Button theme={Btnthemes} mode='contained' onPress={()=>this.showPrescription(item.sno)}>Prescription</Button>
                                </View>
                                
                            </Card>
                        )
                    }}
                    keyExtractor={item=>item.sno.toString()}
                    
                />
                }
           </View>
        )
    }
}
export default HistoryScreen;
const Btnthemes = {
    colors: {
      primary: '#3C1053FF',
    },
  };
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card:{
        margin:5
    }
});
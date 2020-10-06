import * as React from 'react';
import { 
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  ToastAndroid,
  Alert
} from "react-native";
import { BottomNavigation, Text, Card, Avatar, Title, Caption, IconButton, FAB, TextInput, Button, Divider} from 'react-native-paper';
import {Rating, colors, Overlay} from 'react-native-elements'
import { useEffect } from 'react';
import * as Constants from '../Configuration/ipconfig'
import SwitchSelector from 'react-native-switch-selector';
var radio_props = [
  {label: 'Doctor', value: 0 },
  {label: 'Requests', value: 1 }
];
const Doctor = () =>{
  const [list,setList] = React.useState([]);
  const [list2,setList2] = React.useState([]);
  const [visible,setVisible] = React.useState(false);
  const [name,setName] = React.useState('');
  const [img,setImage] = React.useState('');
  const [loc,setLocation] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [phoneno,setPhoneno] = React.useState('');
  const [quali,setQualification] = React.useState('');
  const [speciality,setSpeciality] = React.useState('');
  const [rating,setRating] = React.useState('');
  const [cnic,setCnic] = React.useState('');
  const [value, setValue] = React.useState('')
  React.useEffect(()=>{
    async function fetchData(){await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getDoctors')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
    }
   
    fetchData();
    
    
  });
  async function pendingDoctors(abc){
    console.log(abc)
    if(abc==1)
    {  await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getPendingDoctors')
      .then(response=>response.json())
      .then(data=>setList2(data))
      .catch(err=>console.log(err))
      setValue(abc)
    }
    else if(abc==0){
      await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getDoctors')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
    setValue(abc)
    }
    
  }
  async function accept(cnic){
    
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/AcceptRequest?cnic='+cnic,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then(data=>Alert.alert('Information', data))
    .catch(err=>console.log(err))
    fetchUpdatedData
    pendingDoctors(value)
    }  
  const fetchUpdatedData=async()=>{
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getDoctors')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
  }
  async function reject(cnic){
    
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/RejectDoctor?cnic='+cnic,
    {
      method:'DELETE',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then(data=>Alert.alert('Information', data))
    .catch(err=>console.log(err))
    fetchUpdatedData
    }    
    async function blockUser(cnic){
      await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/blacklist?cnic='+cnic,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then(response=>response.json())
      .then(data=>Alert.alert('Information', data))
      .catch(err=>console.log(err))
      fetchUpdatedData
    }
    function setData(name,img,rating,email,loc,phno,sp,quali, Dcnic){
      setName(name)
      setImage(img)
      setRating(rating)
      setEmail(email)
      setLocation(loc)
      setQualification(quali)
      setSpeciality(sp)
      setPhoneno(phno)
      setCnic(Dcnic)
      setVisible(!visible)
    }
    function toggleOverlay(){
      setVisible(!visible)
    };
    async function makeAuditor(){
      console.log(cnic)
      await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/AddAuditor?cnic='+cnic,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then(response=>response.json())
      .then(data=>Alert.alert('Information', data))
      .catch(err=>console.log(err))
    }
  return(<View style={{flex:1}}>
       <SwitchSelector
                    options={radio_props}
                    initial={0}
                    buttonColor="#3C1053FF"
                    onPress={(abc) => pendingDoctors(abc)} 
                    style={{margin:10}}
                />
     <FlatList
      data={value==0?list:list2}
      renderItem={({item})=>{
          return  (<Card style={{ margin:5, borderRadius:20, padding:20}}>
          
              {item.status=='Accepted'?
              <View style={{justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>
              <View>
              { item.image && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${item.image}`}}/>}
                                
              </View>
              <TouchableOpacity onPress={()=>setData(item.D_name,item.image,item.D_rating,item.D_email,item.D_location,item.D_phoneno,item.speciality,item.qualification,item.D_cnic)}>
              <View style={{alignItems:'center'}}>
                  <Title>Dr. {item.D_name}</Title>
                  <Caption>{item.D_location}</Caption>
                  <Caption>{item.D_email}</Caption>
                  <Rating
                    fractions={1}
                    ratingCount={5}
                    imageSize={25}
                    type='star'
                    readonly
                    startingValue={item.D_rating}
                    
                  />
              </View>
              </TouchableOpacity>
              <View style={{flexDirection:'column',alignItems:'center'}}>
                  <IconButton onPress={()=>blockUser(item.D_cnic)} theme={Blklist} size={34} icon="block-helper" />
                  
              </View>  
              </View>:
              <View style={{justifyContent:'center'}}>
               
              <View style={{alignItems:'center'}}>
                  <Title>Dr. {item.D_name}</Title>
                  <Caption>{item.qualification}</Caption>
                  <Caption>{item.speciality}</Caption>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <Button mode='outlined' theme={BtnthemesA} onPress={()=>accept(item.D_cnic)}>Accept</Button>
                    <Button mode='outlined' theme={BtnthemesR} onPress={()=>reject(item.D_cnic)}>Reject</Button>
              </View>  
              </View>
              

              }
          
          </Card>)
      }}
      keyExtractor={item=>item.D_cnic}
      style={{flex:1}}
  />
  <Overlay
    isVisible={visible}
    onBackdropPress={toggleOverlay}
    overlayStyle={{width:'85%'}}
    transparent={true}
  >
    <Card style={{ width:'100%',padding:10}}>
      {img && <Image style={{alignSelf:'center',width: 100, height: 100, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${img}`}}/>}
      <Title>Name: {name}</Title>
      <Title>Email: {email}</Title>
      <Title>Location: {loc}</Title>
      <Title>Phone No.: {phoneno}</Title>
      <Title>Qualification: {quali}</Title>
      <Title>Speciality: {speciality}</Title>
      <Title>Rating: {rating}</Title>
      <Button mode='outlined' onPress={()=>makeAuditor()}>Make Auditor</Button>
    </Card>
  </Overlay>
  </View>
  )
  }

const Auditor = () =>{
  const [list,setList]=React.useState([])
  const [Audlist,setAud]=React.useState([])
  const [visible,setVisible]=React.useState(false)
 
  
  React.useEffect(()=>{
    async function fetchData(){
      await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getAuditors')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
    }
    fetchData();
  });
  const showmodal= async ()=>{
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getDoctors')
    .then(response=>response.json())
    .then(data=>setAud(data))
    .catch(err=>console.log(err))
    
    setVisible(!visible)
  }
  const _hideModal=()=>{setVisible(!visible)}
  async function makeAuditor(cnic){
    console.log(cnic)
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/AddAuditor?cnic='+cnic,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then(data=>Alert.alert('Information', data))
    .catch(err=>console.log(err))
    showmodal
  }
  return(
    <View style={{flex:1}}>
         <FlatList
          data={list}
          renderItem={({item})=>{
          return  (<Card style={{ margin:5, borderRadius:20, padding:10,elevation:20}}>
          
              <View style={{flexDirection:'row', alignItems:'center'}}>
              <View>
              { item.image && <Image style={{alignSelf:'center',width: 75, height: 75, margin:5, borderRadius:50}} source={{uri: `data:image/gif;base64,${item.image}`}}/>}
                                
              </View>
                <View style={{alignItems:'center',marginLeft:90}}>
                    <Title>Dr. {item.D_name}</Title>
                    <Caption>{item.D_email}</Caption>
                    <Caption>{item.D_location}</Caption>
                    <Caption>{item.D_phoneno}</Caption>
                    
                </View>
              </View>

          </Card>)
      }}
      keyExtractor={item=>item.D_cnic}
      style={{flex:1}}
      />
        <FAB
          icon={'plus'}
          theme={Btnthemes}
          style={styles.fab}
          onPress={showmodal}
        />
        <Modal
          visible={visible}
          onRequestClose={_hideModal}
          transparent={true}
        >
            <Card style={{height:400,top:150,margin:10}}>
            <FlatList
              data={Audlist}
              renderItem={({item})=>{
          return  (<Card style={{ margin:5, borderRadius:20, padding:20}}>
          
              <View style={{justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>
              <View style={{alignItems:'center'}}>
                  <Title>{item.D_name}</Title>
                  <Caption>Rating {item.D_rating}</Caption>
              </View>
              <View style={{flexDirection:'column',alignItems:'center'}}>
                  <Button theme={Blklist} onPress={()=>makeAuditor(item.D_cnic)}>Make Auditor</Button>
                  
              </View>  
              </View>
          
          </Card>)
      }}
      keyExtractor={item=>item.D_cnic}
      style={{flex:1}}
  />
            </Card>
        </Modal>
    </View>
  )
}
  
const Clinic = ({navigation}) => {
  const [list,setList] = React.useState([]);
  const [cases,setCases] = React.useState([]);
  const [visible,setVisibile] = React.useState(false);
  React.useEffect(()=>{
    async function fetchData(){await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getClinics')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
    }
    fetchData();
  });
  const fetchUpdatedData=async()=>{
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getClinics')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
  }
  async function blockClinic(cnic){
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/blockClinic?cnic='+cnic,
    {
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      }
    })
    .then(response=>response.json())
    .then(data=>Alert.alert('Information', data))
    .catch(err=>console.log(err))
    fetchUpdatedData
  }
  async function getCases(cnic){
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getCases?cnic='+cnic)
    .then(response=>response.json())
    .then(data=>setCases(data))
    .catch(err=>console.log(err))
    setVisibile(!visible)
    
  }
  const toggleOverlay=()=>{
    setVisibile(!visible)
  }
  return(
    <View style={{flex:1}}>
     <FlatList
      data={list}
      renderItem={({item})=>{
          return  (<Card style={{ margin:5, borderRadius:20, padding:20}}>
          
              <View style={{justifyContent:'space-between',flexDirection:'row', alignItems:'center'}}>
              <View>
                  <Avatar.Text theme={Btonthemes} size={72} label={ item.C_name.split(' ')[1]!=null?item.C_name[0]+item.C_name.split(' ')[1][0]:item.C_name[0]}/> 
              </View>
              <TouchableOpacity onPress={()=>getCases(item.C_cnic)}>
              <View style={{alignItems:'center'}}>
                  <Title>{item.C_name}</Title>
                  <Caption>{item.location}</Caption>
                  <Caption>{item.email}</Caption>
                  <Caption>{item.phoneno}</Caption>
              </View>
              </TouchableOpacity>
              <View style={{flexDirection:'column',alignItems:'center'}}>
                  <IconButton theme={Blklist} onPress={()=>blockClinic(item.C_cnic)} size={34} icon="block-helper" />
                  
              </View>  
              </View>
          
          </Card>)
      }}
      keyExtractor={item=>item.C_cnic}
      style={{flex:1}}
  />
   <Overlay isVisible={visible} onBackdropPress={toggleOverlay} fullScreen={true}>
      <View>
          <Title style={{alignSelf:'center'}}>Clinic History</Title>
         {cases && <FlatList
                    data={cases}
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
                                    <Text style={{flex:1,fontSize:20}}>Patient Name</Text>
                                    <Text style={{flex:1,fontSize:20}}>{item.P_name}</Text>
                                </View>
                                <View>
                                    <Button theme={Btonthemes} mode='contained' onPress={()=>this.showPrescription(item.sno)}>Prescription</Button>
                                </View>
                                
                            </Card>
                        )
                    }}
                    keyExtractor={item=>item.sno.toString()}
                    
                />
          }
      </View>
   </Overlay>
  </View>
  )
}

const Blacklist = () =>{ 
  const [list,setList] = React.useState([]);
  React.useEffect(()=>{
    async function fetchData(){await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/getBlocked')
    .then(response=>response.json())
    .then(data=>setList(data))
    .catch(err=>console.log(err))
    }
    fetchData();
  });
  async function unblockUser(cnic)
  {
    await fetch('http://'+Constants.ipAddress+'/Api/api/Admin/unBlock?cnic='+cnic,
      {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then(response=>response.json())
      .then(data=>Alert.alert('Information', data))
      .catch(err=>console.log(err))
      
  }
  return (
    <FlatList
          data={list}
          renderItem={({item})=>{
          return  (<Card style={{ margin:5, borderRadius:20, padding:20}}>
          
              <View style={{flex:2,flexDirection:'row'}}>
                <View style={{flex:1}}>
                    <Title>{item.name}</Title>
                    <Caption>{item.email}</Caption>
                    <Caption>{item.location}</Caption>
                    <Caption>{item.phoneno}</Caption>
                </View>
                <View style={{flex:1,flexDirection:'column',alignItems:'flex-end'}}>
                  <IconButton onPress={()=>unblockUser(item.blockedCnic)} color='#00ff00' size={34} icon="check-underline-circle-outline" />
                  
                </View>
              </View>

          </Card>)
      }}
      keyExtractor={item=>item.blockedCnic}
      style={{flex:1}}
      />
  )
}

const AdminScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'Doctor', title: 'Doctor', icon: 'doctor', color:'#3C1053FF' },
    { key: 'Auditor', title: 'Auditor', icon: 'account-multiple-check', color:'#000' },
    { key: 'Clinic', title: 'Clinic', icon: 'stethoscope', color:'#3C1053FF' },
    { key: 'Blacklist', title: 'Blacklist', icon: 'block-helper', color:'#f32013' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    Doctor: Doctor,
    Auditor: Auditor,
    Clinic: Clinic,
    Blacklist:Blacklist
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default AdminScreen;

const Btonthemes = {
  colors: {
    primary: '#3C1053FF',
    accent: '#f1c40f',
  },
};
const Btnthemes = {
  colors: {
    accent: '#3C1053FF',
    primary: '#f1c40f',
  },
};
const BtnthemesA = {
  colors: {
    accent: '#00FF00',
    primary: '#00FF00',
  },
};
const BtnthemesR = {
  colors: {
    accent: '#8B0000',
    primary: '#8B0000',
  },
};
const Blklist = {
  colors: {
    primary: '#f32013',
    accent:'#f32013'
  },
};
const UBlklist = {
  colors: {
    primary: '#00ff00',
    accent:'#00ff00'
  },
};
const styles=StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})
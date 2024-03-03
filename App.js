import { StyleSheet, View, Button, ScrollView } from 'react-native';
import React,{useEffect, useState} from 'react';
import { firestore, collection, addDoc, serverTimestamp, MESSAGES, query, onSnapshot } from './firebase/Config';
import { TextInput } from 'react-native-paper';
import { convertFirebaseTimeStampToJS } from './helper/Functions';
import { orderBy } from 'firebase/firestore';

export default function App() {
  const [messages, setMessage] = useState([])
  const [newMessage, setNewMessage] = useState('')

  const save = async() => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch (error => console.log(error))

    setNewMessage('')
    console.log('Message saved.')
  }

  useEffect(() => {
    const q = query(collection(firestore,MESSAGES),orderBy('created','desc'))

    const unsubcribe = onSnapshot(q,(querySnapshot) => {
      const tempMessages =[]

      querySnapshot.forEach((doc) => {
        const messageObject = {
          id: doc.id,
          text: doc.data().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }
        tempMessages.push(messageObject)
      })
      setMessage(tempMessages)
    })

    return () => {
      unsubcribe()
    }
  }, [])  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) =>(
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created}</Text>
              <Text>{messages.text}</Text>
            </View>
          ))
        }  
      </ScrollView>  
    </SafeAreaView>    
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 10, 
    marginBottom: 10, 
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12
  }
});

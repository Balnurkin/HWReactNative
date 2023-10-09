import { Button, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [todos, setTodos] = useState([])

  useEffect(()=>{
    (async()=>{
      const todos = await AsyncStorage.getItem('todos')
      const todosList = JSON.parse(todos)
      
      if(todosList){
        setTodos(todosList)
      }
    })()
  }, [])

  const openModal = () => {
    setVisible(true)
  }

  const closeModal = () => {
    setVisible(false)
  }

  const addNewToDo = async () => {
    if(title, description){
      const newTodo = {
        title,
        description,
        id: new Date()
      }
      setTodos([...todos, newTodo])
      await AsyncStorage.setItem('todos', JSON.stringify([...todos, newTodo]))
      setTitle('')
      setDescription('')
      setVisible(false)
    }
  }

  const deleteTodo = (item) => {
    const todoId = item.id
    const filteredTodos = todos.filter(todo => todo.id !== todoId)
    setTodos(filteredTodos)
  }

  const Item = ({item}) => {
    return(
        <TouchableOpacity onLongPress={() => deleteTodo(item)}>
          <View style={styles.todos}>
            <Text style={{fontSize:22, color:'#001524'}}>{item.title}</Text>
            <Text style={{fontSize:18, color:'#445D48'}}>{item.description}</Text>
          </View>
        </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.press} onPress={openModal}>
        <Text style={{color:'#FDE5D4', fontSize:20}}>Добавить</Text>
      </TouchableOpacity>
      <Modal animationType='slide' visible={visible} transparent={true}>
        <View style={styles.modal}>
          <Text style={{textAlign:'center', fontSize:24, marginBottom:20}}>Новая задача</Text>
          <TextInput style={styles.inputTitle} placeholder='Название задачи' value={title} onChangeText={(text) => setTitle(text)} />
          <TextInput style={styles.inputDesc} placeholder='Описание задачи' value={description} onChangeText={(text) => setDescription(text)} />
          <View style={{flexDirection:'row', marginLeft:20, marginTop:20, gap:20}}>
            <TouchableOpacity style={styles.button} onPress={addNewToDo}>
              <Text style={{color:'#FDE5D4', fontSize:20}}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={{color:'#FDE5D4', fontSize:20}}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{marginTop:20}}>
        {todos.length === 0 ? 
        <>
          <Text style={{fontSize:20, textAlign:'center'}}>Нет задач</Text>
        </>
        :<>
          <Text style={{fontSize:24, marginVertical:20, textAlign:'center'}}>Список задач:</Text>
          <FlatList data={todos} keyExtractor={item => item.id} renderItem={({item}) => <Item item={item} />} />
        </>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDE5D4',
    paddingVertical:60
  },
  modal:{
    marginTop:200,
    marginHorizontal:20,
    width:350,
    height:300,
    backgroundColor:'#D6CC99',
    paddingHorizontal:20,
    paddingVertical:20
  },
  press:{
    width:120,
    height:35,
    backgroundColor:'#001524',
    justifyContent:'center',
    alignItems:'center',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    marginHorizontal:130
  },
  button:{
    width:120,
    height:35,
    backgroundColor:'#001524',
    justifyContent:'center',
    alignItems:'center',
    borderBottomLeftRadius:10,
    borderBottomRightRadius:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10
  },
  inputTitle:{
    borderWidth:1,
    height:35,
    fontSize:20, 
    marginBottom:10,
    paddingHorizontal:6
  },
  inputDesc:{
    fontSize:20, 
    marginBottom:10, 
    height:100,
    borderWidth:1,
    paddingHorizontal:6
  },
  todos:{
    backgroundColor: '#D6CC99',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  
});

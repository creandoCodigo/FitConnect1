import React, { useEffect, useState } from 'react';
import { Button, FlatList, Text, TextInput, View, Alert, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRVqBCqJHVeIX42ugcH7OOBu8VgcOjtrY",
  authDomain: "fitconnect1-ac0fc.firebaseapp.com",
  projectId: "fitconnect1-ac0fc",
  storageBucket: "fitconnect1-ac0fc.firebasestorage.app",
  messagingSenderId: "956421374922",
  appId: "1:956421374922:web:0d0e9b4919ea5142ec8533"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para agregar un nuevo documento
const createData = async (data) => {
  try {
    const docRef = await addDoc(collection(db, 'contacts'), data);
    console.log("Documento agregado con ID: ", docRef.id);
  } catch (e) {
    console.error("Error al agregar documento: ", e);
  }
};

// Función para obtener los documentos
const readData = async () => {
  const querySnapshot = await getDocs(collection(db, 'contacts'));
  const items = [];
  querySnapshot.forEach((doc) => {
    items.push({ id: doc.id, ...doc.data() });
  });
  return items;
};

// Función para actualizar un documento
const updateData = async (id, newData) => {
  try {
    const docRef = doc(db, 'contacts', id);
    await updateDoc(docRef, newData);
    console.log("Documento actualizado");
  } catch (e) {
    console.error("Error al actualizar documento: ", e);
  }
};

// Función para eliminar un documento
const deleteData = async (id) => {
  try {
    const docRef = doc(db, 'contacts', id);
    await deleteDoc(docRef);
    console.log("Documento eliminado");
  } catch (e) {
    console.error("Error al eliminar documento: ", e);
  }
};

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', phone: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Leer los datos al iniciar la aplicación
  useEffect(() => {
    const fetchData = async () => {
      const data = await readData();
      setItems(data);
    };
    fetchData();
  }, []);

  // Filtrar los items por búsqueda
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.phone.includes(searchTerm) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar un nuevo item
  const handleAddItem = async () => {
    if (!newItem.name || !newItem.phone || !newItem.email) {
      Alert.alert('Error', 'Todos los campos son obligatorios.');
      return;
    }
    await createData(newItem);
    setNewItem({ name: '', phone: '', email: '' });
    const data = await readData(); // Actualizar lista
    setItems(data);
  };

  // Eliminar un item
  const handleDeleteItem = async (id) => {
    await deleteData(id);
    const data = await readData(); // Actualizar lista
    setItems(data);
  };

  // Actualizar un item
  const handleUpdateItem = async (id, updatedItem) => {
    await updateData(id, updatedItem);
    const data = await readData(); // Actualizar lista
    setItems(data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F4F9', padding: 20 }}>
      
      {/* Título de la app */}
      <View style={styles.header}>
        <Text style={styles.title}>FitConnect1</Text>
      </View>

      {/* Buscador */}
      <TextInput
        value={searchTerm}
        onChangeText={setSearchTerm}
        placeholder="Buscar por nombre, teléfono o correo"
        style={styles.input}
      />
      
      {/* Formulario de nuevo contacto */}
      <TextInput
        value={newItem.name}
        onChangeText={(text) => setNewItem({ ...newItem, name: text })}
        placeholder="Nombre"
        style={styles.input}
      />
      <TextInput
        value={newItem.phone}
        onChangeText={(text) => setNewItem({ ...newItem, phone: text })}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        value={newItem.email}
        onChangeText={(text) => setNewItem({ ...newItem, email: text })}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddItem} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Contacto</Text>
      </TouchableOpacity>

      {/* Lista de contactos */}
      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.contactItem}>
            <Text style={styles.contactText}>{item.name} - {item.phone} - {item.email}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => handleUpdateItem(item.id, { name: prompt("Nuevo nombre:", item.name), phone: prompt("Nuevo teléfono:", item.phone), email: prompt("Nuevo correo:", item.email) })} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteItem(item.id)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

// Estilos mejorados
const styles = {
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50, // Para darle espacio al título desde la parte superior
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  contactItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  contactText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#2196F3', // Azul
    padding: 10,
    borderRadius: 25, // Botón redondeado
  },
  deleteButton: {
    backgroundColor: '#F44336', // Rojo
    padding: 10,
    borderRadius: 25, // Botón redondeado
  },
};

export default App;

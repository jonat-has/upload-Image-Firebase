
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadBytes, deleteObject, list } from "firebase/storage";



const ImagePickerExample = () => {
  const [imageUri, setImageUri] = useState("https://previews.123rf.com/images/mironovak/mironovak1508/mironovak150800047/44239635-textura-de-tela-branca-ou-textura-de-padr%C3%A3o-de-grade-de-linho.jpg");
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState([null]);
  const [visible, setVisible] = useState(false);

  const firebaseConfig = {
    apiKey: "AIzaSyBtpERb2bIdAtUPDXuxw3lPobt9sW08Kwc",
    authDomain: "upload-image-6a82d.firebaseapp.com",
    projectId: "upload-image-6a82d",
    storageBucket: "upload-image-6a82d.appspot.com",
    messagingSenderId: "358628752493",
    appId: "1:358628752493:web:480d23c29e5d7722d79364",
    measurementId: "G-C2YKLML803"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


  //Armazena a imagem para o upload e exibe a imagem
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
      console.log(result.assets);
    }
  };

  function getRandom(max) {
    return Math.floor(Math.random() * max + 1)
  }



  //Método para realizar upload para o Firebase
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('Selecione uma imagem antes de enviar.');
      return;
    }

    // Create a root reference
    const storage = getStorage();

    var name = getRandom(200);
    // Create a reference to 'mountains.jpg'
    const mountainsRef = ref(storage, name + '.jpg');

    const response = await fetch(imageUri);
    const blob = await response.blob();

    uploadBytes(mountainsRef, blob).then((snapshot) => {
      console.log(snapshot);
      alert('Imagem enviada com sucesso!!');
    });
  };


  //Listar no console as imagens salvas no storage
  async function LinkImage() {
    // Create a reference under which you want to list
    const storage = getStorage();
    const listRef = ref(storage);

    // Fetch the first page of 100.
    const firstPage = await list(listRef, { maxResults: 100 });
    var lista = [];
    firstPage.items.map((item) => {

      var link = ('https://firebasestorage.googleapis.com/v0/b/' +
        item.bucket + '/o/' + item.fullPath + '?alt=media');
      lista.push(link);

    })
    setImage(lista);
    setVisible(true);
    console.log(image);
  }

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.link}</Text>
    </View>
  );

  const deleteImage = async (img) => {
    try {
      // Linkar a image exbibida com a img do firebase
      const storage = getStorage();
      const imageRef = ref(storage, img);

      // Deletar a image
      await deleteObject(imageRef);

      // Atualizar lista
      setImage(image.filter((item) => item !== img));
      alert('Imagem excluída com sucesso!');
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Erro ao excluir a imagem!');
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: '16px'}}>
      <Button title="Escolher Imagem" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, marginVertical: 20 }} />}
      {uploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View> <Button title="Enviar Imagem" onPress={uploadImage} disabled={!imageUri} /></View>

      )}
      <View style={{padding: '8px'}}><Button title="Ver Imagens" onPress={LinkImage} /></View>
      <FlatList
        data={image}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 20, alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', height: '250px' }}>
            <Image source={{ uri: item }} style={{ width: 250, height: 200 }} />
            <Button title='Excluir' color={'#b00b1e'} onPress={() => deleteImage(item)}></Button>
          </View>
        )}
      />

    </View>
  );
};




export default ImagePickerExample;

import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Image} from 'react-native';
import * as MediaLibrary from 'expo-media-library'; // Guardar fotos
import Button from './src/components/Button';

export default function App() {

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back); //Camara trasera
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off); //Flash initial
  const cameraRef = useRef(null);
  
  //Pedi[r permiso de usar camara
  useEffect(() =>{
    (async() => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();

  }, []);

  //Tomar foto
  const takePicture = async() => {
    if(cameraRef){
      try{
        const data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri); // Guardar url
      } catch(e){
        console.log(e);
      }
    }
  }

  // Guardar fotos
  const savePicture = async() => {
    if(image){
      try{
        await MediaLibrary.createAssetAsync(image);
        alert('Picture Save! ')
        setImage(null);
        setImage(data.uri); // Guardar url
      } catch(e){
        console.log(e);
      }
    }
  }
  
  if(hasCameraPermission === false){
    return <Text>No access to camera</Text>
  }

  return (
    <View style={styles.container}>
      {!image ?
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flash}
        ref={cameraRef}
      >
        <View style={styles.options}>
          <Button 
            icon='retweet'
            onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)} ></Button>
          <Button 
            icon='flash'
            color={flash === Camera.Constants.FlashMode.off ? 'gray' : '#f1f1f1'}
            onPress={() => 
              setFlash(flash === Camera.Constants.FlashMode.off 
              ? Camera.Constants.FlashMode.on  
              : Camera.Constants.FlashMode.off )} ></Button>
        </View>
      </Camera> 
      :
      <Image source={{uri: image}} style={styles.camera}></Image>
      }
      <View>
        {image ?
        <View style={styles.options}>
          <Button title={'Re-take'} icon='retweet' onPress={() => setImage(null)}></Button>
          <Button title={'Save'} icon='check' onPress={savePicture}></Button>
        </View>
        :
        <Button title={'Take a picture'} icon='camera' onPress={takePicture}></Button>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  camera: {
    flex: 1,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
});

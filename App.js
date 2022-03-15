
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [askPermission, setAskPermission] = useState(true);
  const [type, setType] = useState(Camera.Constants.Type.front);
  const [photoPermission, setRequestPermission] = MediaLibrary.usePermissions();
  const [faceDetected, setFaceDetected] = useState(false);
  const ref = useRef(null)

  //--------------------ACCES CAMERA PERMISSION--------------------//

    useEffect(() => {
      (async () => {
        const {status} = await Camera.requestCameraPermissionsAsync();
        console.log(status)
        setAskPermission(status === 'granted');
      })();
    }, []);

    if (askPermission === null) {
      return <SafeAreaView>
        <Text>Une erreur s'est produite. L'accès à la caméra à échoué.</Text>
      </SafeAreaView>
    } 
    if (askPermission === false) {
      return <SafeAreaView>
        <Text>Accès à la caméra refusée</Text>
      </SafeAreaView>
    } 

  //--------------------ACCES PHOTO PERMISSION--------------------//

    useEffect(() => {
      (async () => {
         const askPhotoPermission = await MediaLibrary.requestPermissionsAsync();
         console.log(askPhotoPermission)
        setRequestPermission(photoPermission === 'granted')
      })();
    }, []);

    if (photoPermission === null) {
      return <SafeAreaView>
        <Text>Une erreur s'est produite. L'accès à la bibliothèque photo à échoué</Text>
      </SafeAreaView>
    }
    if (photoPermission === false) {
      return <SafeAreaView>
        <Text>Accès à la bibliothèque photo refusé</Text>
      </SafeAreaView>
    }

  //--------------------FONCTION PRISE DE PHOTO--------------------//  

    takePhoto = async () => {
      const photo = await ref.current.takePictureAsync()
      console.log(photo)
      await MediaLibrary.saveToLibraryAsync(photo.uri)
    }

  //--------------------FONCTION DETECTION VISAGE--------------------// 
    
    const handleFacesDetected = ({faces}) => {
      console.log(faces)
      if (faces.length > 0) {
      setFaceDetected(true)
      } else 
      setFaceDetected(false)
    };
        
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} 
        type={type}
        ref={ref}
        onFacesDetected={handleFacesDetected}
        faceDetectorSettings={{
          mode: FaceDetector.FaceDetectorMode.fast,
          detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
          runClassifications: FaceDetector.FaceDetectorClassifications.none,
          minDetectionInterval: 500,
          tracking: true,
        }}
        >
          <View style={[styles.filtre, faceDetected ? '' : styles.hidden]} />
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.buttonFlip}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.front
                  ? Camera.Constants.Type.back
                  : Camera.Constants.Type.front
                );
              }}>
                <Text style={{color: 'white', fontSize: 18, marginHorizontal: 50}}>Flip Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonFlip}
              onPress={takePhoto}
            >
              <Text style={{color: 'white', fontSize: 18, marginHorizontal: 50}}>Take a Shot</Text>
            </TouchableOpacity>
          </View>
          
      </Camera>
      
    </View>
  );
}

//--------------------STYLE--------------------// 

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 2,
    flexDirection: 'column-reverse',
  },
  button: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  buttonFlip: {
    marginVertical: 20,
  },
  filtre: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    borderWidth: 4,
    borderColor: 'white',
  },
  hidden: {
    height: 0,
    width: 0,
    opacity: 0,
  },
})

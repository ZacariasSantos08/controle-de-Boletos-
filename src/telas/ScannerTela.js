import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Camera from 'expo-camera'; // CORREÇÃO AQUI
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

export default function ScannerTela({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // Navega de volta para a tela de Formulário, enviando o dado lido como parâmetro
    navigation.navigate('FormularioBoleto', { scannedData: data });
  };

  if (hasPermission === null) {
    return <View style={styles.center}><Text>Solicitando permissão da câmera...</Text></View>;
  }
  if (hasPermission === false) {
    return (
        <SafeAreaView style={styles.center}>
            <Text style={{color: 'white', textAlign: 'center', padding: 20}}>Acesso à câmera negado.</Text>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButtonFallback}>
                <Text style={{color: tema.cores.primaria, fontSize: 16}}>Voltar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
          barCodeTypes: [ "interleaved2of5" ], // Padrão de boletos no Brasil
        }}
      />

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close-circle" size={40} color="white" />
        </TouchableOpacity>
        <View style={styles.scannerMessageContainer}>
            <Text style={styles.infoText}>Aponte a câmera para o código de barras</Text>
        </View>
        <View style={styles.scannerBox}>
            <View style={styles.scannerLine} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  backButtonFallback: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    zIndex: 10,
  },
  scannerMessageContainer: {
    position: 'absolute',
    top: '25%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: tema.espacamento.pequeno,
    paddingHorizontal: tema.espacamento.medio,
    borderRadius: tema.raioBorda.medio,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  scannerBox: {
    width: '90%',
    height: 150,
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: tema.raioBorda.grande,
    overflow: 'hidden',
  },
  scannerLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: tema.cores.erro,
  },
});
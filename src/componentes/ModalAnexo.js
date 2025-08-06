import React from 'react';
import { View, Modal, StyleSheet, Image, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

const ModalAnexo = ({ visivel, aoFechar, uri }) => {
  if (!uri) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <SafeAreaView style={styles.fundoModal}>
        <TouchableOpacity style={styles.botaoFechar} onPress={aoFechar}>
          <Ionicons name="close-circle" size={40} color="white" />
        </TouchableOpacity>
        <View style={styles.containerImagem}>
          <Image
            source={{ uri: uri }}
            style={styles.imagem}
            resizeMode="contain"
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fundoModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoFechar: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
  },
  containerImagem: {
    width: '100%',
    height: '80%',
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
});

export default ModalAnexo;
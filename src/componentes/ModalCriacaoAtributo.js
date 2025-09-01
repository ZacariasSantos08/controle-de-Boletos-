import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Button } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputFormulario from './InputFormulario';
import tema from '../estilos/tema';

const ModalCriacaoAtributo = ({ visivel, titulo, aoFechar, aoSalvar }) => {
  const [nome, setNome] = useState('');

  const lidarComSalvar = () => {
    if (!nome.trim()) {
      alert('O nome não pode ser vazio.');
      return;
    }
    aoSalvar({ nome });
    setNome(''); // Limpa o campo para a próxima vez
  };

  return (
    <Modal visible={visivel} animationType="fade" transparent={true} onRequestClose={aoFechar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitulo}>{titulo}</Text>
            <TouchableOpacity onPress={aoFechar}>
              <Feather name="x" size={24} color={tema.cores.cinza} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalBody}>
            <InputFormulario label="Nome" valor={nome} aoMudarTexto={setNome} />
            {/* Futuramente, outros campos como 'descrição' podem ser adicionados aqui */}
          </View>
          <View style={styles.modalFooter}>
            <Button title="Cancelar" onPress={aoFechar} color={tema.cores.cinza} />
            <Button title="Salvar" onPress={lidarComSalvar} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: tema.cores.secundaria,
    paddingBottom: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
  },
  modalTitulo: {
    fontSize: tema.fontes.tamanhoGrande,
    fontWeight: 'bold',
  },
  modalBody: {
    paddingVertical: tema.espacamento.medio,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: tema.espacamento.grande,
  },
});

export default ModalCriacaoAtributo;
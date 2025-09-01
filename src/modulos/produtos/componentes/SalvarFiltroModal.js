import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import InputFormulario from '../../../componentes/InputFormulario';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';

const SalvarFiltroModal = ({ visivel, aoFechar, aoSalvar }) => {
  const [nome, setNome] = useState('');

  const handleSalvar = () => {
    if (nome.trim()) {
      aoSalvar(nome.trim());
      setNome('');
    }
  };

  return (
    <Modal visible={visivel} animationType="fade" transparent={true} onRequestClose={aoFechar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitulo}>Salvar Filtro</Text>
          <InputFormulario
            label="Nome para este conjunto de filtros"
            valor={nome}
            aoMudarTexto={setNome}
            placeholder="Ex: Produtos para repor"
          />
          <View style={styles.botoesContainer}>
            <Botao titulo="Cancelar" tipo="secundario" onPress={aoFechar} />
            <View style={{width: 8}} />
            <Botao titulo="Salvar" tipo="primario" onPress={handleSalvar} />
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
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: tema.cores.branco,
    borderRadius: 12,
    padding: tema.espacamento.grande,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: tema.espacamento.grande,
  },
  botoesContainer: {
    flexDirection: 'row',
    marginTop: tema.espacamento.medio,
  },
});

export default SalvarFiltroModal;
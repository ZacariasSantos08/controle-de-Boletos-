import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import InputFormulario from '../../componentes/InputFormulario';
import Botao from '../../componentes/Botao';
import tema from '../../estilos/tema';

const ModalEdicaoAtributo = ({ visivel, aoFechar, aoSalvar, item, tipo }) => {
  const [nome, setNome] = useState('');

  useEffect(() => {
    if (visivel) { // Apenas atualiza quando o modal se torna visível
      setNome(item?.nome || '');
    }
  }, [visivel, item]);

  const handleSalvar = () => {
    if (!nome.trim()) {
      alert('O nome não pode ser vazio.');
      return;
    }
    aoSalvar(tipo, { ...item, nome: nome.trim() });
  };
  
  const titulo = `${item?.id ? 'Editar' : 'Adicionar'} ${tipo === 'categorias' ? 'Categoria' : 'Marca'}`;

  return (
    <Modal visible={visivel} animationType="fade" transparent={true} onRequestClose={aoFechar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitulo}>{titulo}</Text>
          <InputFormulario
            label="Nome"
            valor={nome}
            aoMudarTexto={setNome}
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

export default ModalEdicaoAtributo;
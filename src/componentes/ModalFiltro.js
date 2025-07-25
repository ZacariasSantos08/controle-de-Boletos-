import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';

const ModalFiltro = ({ visivel, aoFechar, opcoes, filtroAtual, onSelecionarFiltro }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visivel}
      onRequestClose={aoFechar}
    >
      <TouchableOpacity style={styles.fundoModal} activeOpacity={1} onPress={aoFechar}>
        <View style={styles.containerModal}>
          <SafeAreaView>
            <Text style={styles.titulo}>Selecionar Filtro</Text>
            {opcoes.map((opcao) => {
              const estaAtivo = filtroAtual === opcao.value;
              return (
                <TouchableOpacity
                  key={opcao.value}
                  style={styles.itemOpcao}
                  onPress={() => {
                    onSelecionarFiltro(opcao.value);
                    aoFechar();
                  }}
                >
                  <Text style={[styles.textoOpcao, estaAtivo && styles.textoOpcaoAtiva]}>
                    {opcao.label}
                  </Text>
                  {estaAtivo && <Ionicons name="checkmark-circle" size={24} color={tema.cores.sucesso} />}
                </TouchableOpacity>
              );
            })}
          </SafeAreaView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fundoModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  containerModal: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: tema.raioBorda.grande,
    paddingHorizontal: tema.espacamento.medio,
    paddingVertical: tema.espacamento.grande,
    maxHeight: '80%',
  },
  titulo: {
    ...tema.tipografia.titulo,
    color: tema.cores.primaria,
    textAlign: 'center',
    marginBottom: tema.espacamento.grande,
  },
  itemOpcao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: tema.espacamento.medio,
    borderBottomWidth: 1,
    borderBottomColor: tema.cores.borda,
  },
  textoOpcao: {
    ...tema.tipografia.subtitulo,
    fontSize: 18,
    color: tema.cores.texto,
  },
  textoOpcaoAtiva: {
    color: tema.cores.primaria,
    fontWeight: 'bold',
  },
});

export default ModalFiltro;
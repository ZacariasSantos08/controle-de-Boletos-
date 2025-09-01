import React from 'react';
import { Modal, View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';

const ItemFiltroSalvo = ({ item, onCarregar, onExcluir }) => {

  const confirmarExclusao = () => {
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja excluir o filtro "${item.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: () => onExcluir(item.id) },
      ]
    );
  };

  return (
    <View style={styles.itemContainer}>
      <TouchableOpacity style={styles.itemPrincipal} onPress={() => onCarregar(item)}>
        <Feather name="bookmark" size={22} color={tema.cores.primaria} />
        <Text style={styles.itemTexto}>{item.nome}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.botaoExcluir} onPress={confirmarExclusao}>
        <Feather name="trash-2" size={22} color={tema.cores.vermelho} />
      </TouchableOpacity>
    </View>
  );
};


const CarregarFiltroModal = ({ visivel, aoFechar, filtrosSalvos, onCarregarFiltro, onExcluirFiltro }) => {
  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={aoFechar}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={aoFechar} />
      <SafeAreaView style={styles.containerModal} edges={['bottom']}>
        <View style={styles.modalContent}>
          <View style={styles.headerModal}>
            <Text style={styles.titulo}>Carregar Filtro</Text>
            <TouchableOpacity onPress={aoFechar}>
              <Feather name="x" size={30} color={tema.cores.cinza} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={filtrosSalvos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ItemFiltroSalvo
                item={item}
                onCarregar={onCarregarFiltro}
                onExcluir={onExcluirFiltro}
              />
            )}
            ListEmptyComponent={
              <View style={styles.listaVaziaContainer}>
                <Text style={styles.listaVaziaTexto}>Nenhum filtro salvo ainda.</Text>
              </View>
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  containerModal: {
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: tema.cores.secundaria,
    padding: tema.espacamento.medio,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '60%',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tema.espacamento.grande,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.pequeno,
    elevation: 1,
  },
  itemPrincipal: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTexto: {
    fontSize: 18,
    marginLeft: tema.espacamento.medio,
  },
  botaoExcluir: {
    padding: tema.espacamento.pequeno,
  },
  listaVaziaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  listaVaziaTexto: {
    fontSize: 16,
    color: tema.cores.cinza,
  },
});

export default CarregarFiltroModal;
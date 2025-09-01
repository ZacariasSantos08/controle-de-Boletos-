import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useGerenciamentoAtributos } from '../hooks/useGerenciamentoAtributos';
import ModalEdicaoAtributo from '../componentes/ModalEdicaoAtributo';
import Botao from '../../componentes/Botao';
import tema from '../../estilos/tema';

const ItemAtributo = ({ item, onEdit, onDelete }) => (
  <View style={styles.itemContainer}>
    <Text style={styles.itemTexto}>{item.nome}</Text>
    <View style={styles.itemBotoes}>
      <TouchableOpacity onPress={onEdit} style={{padding: 8}}>
        <Feather name="edit-2" size={20} color={tema.cores.cinza} />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDelete} style={{padding: 8}}>
        <Feather name="trash-2" size={20} color={tema.cores.vermelho} />
      </TouchableOpacity>
    </View>
  </View>
);

const SecaoAtributos = ({ titulo, tipo, dados, hook }) => (
  <View style={styles.secaoContainer}>
    <Text style={styles.secaoTitulo}>{titulo}</Text>
    <FlatList
      data={dados}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <ItemAtributo 
          item={item}
          onEdit={() => hook.abrirModal(tipo, item)}
          onDelete={() => hook.excluirAtributo(tipo, item)}
        />
      )}
      ListEmptyComponent={<Text style={styles.textoVazio}>Nenhum item cadastrado.</Text>}
      scrollEnabled={false} // Para não ter scroll dentro de scroll
    />
    <View style={{marginTop: 16}}>
      <Botao 
        titulo={`Adicionar ${titulo.slice(0,-1)}`}
        tipo="secundario" 
        onPress={() => hook.abrirModal(tipo)}
        icone="plus"
      />
    </View>
  </View>
);

const GerenciamentoAtributosTela = () => {
  const hook = useGerenciamentoAtributos();

  if (hook.carregando) {
    return <View style={styles.containerCentralizado}><ActivityIndicator size="large" /></View>;
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <SecaoAtributos titulo="Categorias" tipo="categorias" dados={hook.atributos.categorias} hook={hook} />
        <SecaoAtributos titulo="Marcas" tipo="marcas" dados={hook.atributos.marcas} hook={hook} />
      </ScrollView>
      <ModalEdicaoAtributo 
        visivel={hook.modalState.visivel}
        aoFechar={hook.fecharModal}
        aoSalvar={hook.salvarAtributo}
        item={hook.modalState.item}
        tipo={hook.modalState.tipo}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  containerCentralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  secaoContainer: {
    backgroundColor: tema.cores.branco,
    margin: tema.espacamento.medio,
    padding: tema.espacamento.medio,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  secaoTitulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: tema.cores.preto },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemTexto: { fontSize: 16, flex: 1 },
  itemBotoes: { flexDirection: 'row' },
  textoVazio: { color: tema.cores.cinza, fontStyle: 'italic', textAlign: 'center', paddingVertical: 20 },
});

export default GerenciamentoAtributosTela;
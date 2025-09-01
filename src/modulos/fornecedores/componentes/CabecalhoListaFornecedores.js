import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';

const CabecalhoListaFornecedores = ({ 
  totalItens, 
  setFiltrosModalVisivel,
  setOrdenacaoModalVisivel,
  isFiltroAtivo,
  // NOVAS PROPS: Para controlar o modo de visualização
  modoVisualizacao,
  setModoVisualizacao,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textoContador}>{totalItens} fornecedor(es)</Text>
      <View style={styles.botoesContainer}>
        <TouchableOpacity onPress={() => setFiltrosModalVisivel(true)} style={styles.botao}>
          <Feather 
            name="filter" 
            size={24} 
            color={isFiltroAtivo ? tema.cores.primaria : tema.cores.preto}
          />
          {isFiltroAtivo && <View style={styles.filtroAtivoBadge} />}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setOrdenacaoModalVisivel(true)} style={styles.botao}>
          <Feather name="sliders" size={24} color={tema.cores.preto} />
        </TouchableOpacity>
        {/* NOVO: Botão para alternar entre card e tabela */}
        <TouchableOpacity 
          onPress={() => setModoVisualizacao(modoVisualizacao === 'card' ? 'tabela' : 'card')} 
          style={styles.botao}
        >
          <Feather name={modoVisualizacao === 'card' ? 'list' : 'grid'} size={24} color={tema.cores.preto} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tema.espacamento.medio,
    paddingVertical: tema.espacamento.pequeno,
    backgroundColor: tema.cores.secundaria,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  textoContador: {
    fontSize: 14,
    color: tema.cores.cinza,
  },
  botoesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espacamento.medio,
  },
  botao: {
    padding: tema.espacamento.pequeno,
  },
  filtroAtivoBadge: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: tema.cores.vermelho,
  },
});

export default CabecalhoListaFornecedores;
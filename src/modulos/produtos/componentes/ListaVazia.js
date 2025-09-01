import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';

export const ListaVazia = ({ isFiltroAtivo, termoBusca, onLimparFiltros }) => {
  if (!isFiltroAtivo && !termoBusca) {
    return (
      <View style={styles.centralizado}>
        <Text style={styles.textoVazio}>Nenhum produto cadastrado.</Text>
      </View>
    );
  }
  return (
    <View style={styles.centralizado}>
      <Text style={styles.textoVazio}>Nenhum produto encontrado</Text>
      <Text style={styles.textoVazioSub}>Tente ajustar sua busca ou filtros.</Text>
      <View style={{marginTop: 16, width: '60%'}}>
        <Botao titulo="Limpar Filtros" onPress={onLimparFiltros} tipo="secundario" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tema.espacamento.grande, paddingTop: 80 },
  textoVazio: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.preto, fontWeight: 'bold', textAlign: 'center' },
  textoVazioSub: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.cinza, textAlign: 'center', marginTop: tema.espacamento.pequeno, marginBottom: tema.espacamento.grande },
});
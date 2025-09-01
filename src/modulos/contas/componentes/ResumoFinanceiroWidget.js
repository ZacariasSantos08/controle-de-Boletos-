import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const ResumoFinanceiroWidget = ({ titulo, valor, icone, cor, carregando }) => {
  return (
    <View style={[styles.card, { borderLeftColor: cor }]}>
      <View style={styles.conteudo}>
        <View style={styles.header}>
          <Feather name={icone} size={20} color={cor} />
          <Text style={styles.titulo}>{titulo}</Text>
        </View>
        {carregando ? (
          <ActivityIndicator size="small" color={cor} style={{marginTop: 8}}/>
        ) : (
          <Text style={[styles.valor, { color: cor }]}>{formatarMoeda(valor * 100) }</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    minWidth: '48%',
    borderLeftWidth: 5,
  },
  conteudo: {
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 14,
    color: tema.cores.cinza,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  valor: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default ResumoFinanceiroWidget;
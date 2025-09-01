import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const CardFormulario = ({ titulo, icone, children }) => {
  const [recolhido, setRecolhido] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.header} onPress={() => setRecolhido(!recolhido)}>
        <View style={styles.tituloContainer}>
          {icone && <Feather name={icone} size={20} color={tema.cores.primaria} />}
          <Text style={styles.tituloCard}>{titulo}</Text>
        </View>
        <Feather name={recolhido ? "chevron-down" : "chevron-up"} size={24} color={tema.cores.cinza} />
      </TouchableOpacity>
      
      {!recolhido && (
        <>
          <View style={styles.divisor} />
          {children}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.grande,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2.22,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tema.espacamento.pequeno,
  },
  tituloCard: {
    fontSize: 18,
    fontWeight: 'bold',
    color: tema.cores.preto,
  },
  divisor: {
    height: 1,
    backgroundColor: tema.cores.secundaria,
    marginVertical: tema.espacamento.medio,
  },
});

export default CardFormulario;
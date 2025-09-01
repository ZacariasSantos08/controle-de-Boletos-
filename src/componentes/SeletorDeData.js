import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import tema from '../estilos/tema';

const SeletorDeData = ({ label, data, aoMudarData }) => {
  const [mostrar, setMostrar] = useState(false);

  const onChange = (evento, dataSelecionada) => {
    setMostrar(Platform.OS === 'ios'); // No iOS, o seletor é um modal que precisa ser fechado
    if (dataSelecionada) {
      aoMudarData(dataSelecionada);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.input} onPress={() => setMostrar(true)}>
        <Text style={[styles.textoValor, !data && styles.placeholder]}>
          {data ? data.toLocaleDateString('pt-BR') : 'dd/mm/aaaa'}
        </Text>
        <Feather name="calendar" size={20} color={tema.cores.cinza} />
      </TouchableOpacity>
      {mostrar && (
        <DateTimePicker
          value={data || new Date()}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: tema.espacamento.medio,
  },
  label: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.preto,
    marginBottom: tema.espacamento.pequeno / 2,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    paddingHorizontal: tema.espacamento.medio,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 49,
  },
  textoValor: {
    fontSize: tema.fontes.tamanhoMedio,
    color: tema.cores.preto,
  },
  placeholder: {
    color: tema.cores.cinza,
  },
});

export default SeletorDeData;
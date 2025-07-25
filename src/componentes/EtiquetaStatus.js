import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tema } from '../estilos/tema';

const statusConfig = {
  aPagar: { texto: 'A Pagar', corFundo: '#E3F2FD', corTexto: '#0D47A1' },
  vencendo: { texto: 'Vencendo', corFundo: '#FFF3CD', corTexto: '#856404' },
  vencido: { texto: 'Vencido', corFundo: '#F8D7DA', corTexto: '#721C24' },
  pago: { texto: 'Pago', corFundo: '#D4EDDA', corTexto: '#155724' },
};

const EtiquetaStatus = ({ status }) => {
  const config = statusConfig[status] || statusConfig.aPagar;
  return (
    <View style={[styles.container, { backgroundColor: config.corFundo }]}>
      <Text style={[styles.texto, { color: config.corTexto }]}>{config.texto}</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: { borderRadius: tema.raioBorda.grande, paddingVertical: 4, paddingHorizontal: 12, alignSelf: 'flex-start', },
  texto: { fontSize: 12, fontWeight: 'bold', },
});
export default EtiquetaStatus;
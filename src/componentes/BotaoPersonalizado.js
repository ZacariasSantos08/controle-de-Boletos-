import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tema } from '../estilos/tema';

const BotaoPersonalizado = ({ titulo, onPress, tipo = 'primario', style, textStyle }) => {
  const estilosBotao = [ styles.botao, styles[tipo], style, ];
  const estilosTexto = [ styles.texto, tipo === 'contorno' ? styles.textoContorno : styles.textoPrimario, textStyle ];
  return (
    <TouchableOpacity style={estilosBotao} onPress={onPress}>
      <Text style={estilosTexto}>{titulo}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  botao: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: tema.raioBorda.grande, alignItems: 'center', justifyContent: 'center', marginVertical: tema.espacamento.pequeno, },
  primario: { backgroundColor: tema.cores.primaria, },
  secundario: { backgroundColor: tema.cores.secundaria, },
  contorno: { backgroundColor: 'transparent', borderWidth: 1, borderColor: tema.cores.primaria, },
  texto: { fontSize: tema.tipografia.corpo.fontSize, fontWeight: 'bold', },
  textoPrimario: { color: tema.cores.textoClaro, },
  textoContorno: { color: tema.cores.primaria, },
});
export default BotaoPersonalizado;
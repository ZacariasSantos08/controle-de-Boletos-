import React, { forwardRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import tema from '../estilos/tema';

// ALTERADO: O componente agora usa forwardRef para que possamos passar uma referência a ele
const InputFormulario = forwardRef(({ 
  label, 
  valor, 
  aoMudarTexto, 
  erro,
  formatador,
  rightComponent,
  obrigatorio = false,
  onSubmitEditing, // NOVO: Prop para lidar com o "Enter"
  returnKeyType,   // NOVO: Prop para customizar o botão "Enter"
  ...props 
}, ref) => {
  
  const lidarComMudanca = (texto) => {
    const valorTratado = formatador ? formatador(texto) : texto;
    aoMudarTexto(valorTratado);
  };

  const containerInputStyle = [ styles.inputContainer, !!erro && styles.bordaErro ];
  const inputStyle = [ styles.input, props.multiline && { height: (props.numberOfLines || 1) * 25, textAlignVertical: 'top' } ];

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {obrigatorio && <Text style={styles.asterisco}> *</Text>}
        </Text>
      )}
      <View style={containerInputStyle}>
        <TextInput
          ref={ref} // Atribui a referência ao TextInput
          style={inputStyle}
          value={valor}
          onChangeText={lidarComMudanca}
          placeholderTextColor={tema.cores.cinza}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          blurOnSubmit={!props.multiline && !onSubmitEditing} // Fecha o teclado se não houver próxima ação
          {...props}
        />
        {rightComponent}
      </View>
      {erro && <Text style={styles.textoErro}>{erro}</Text>}
    </View>
  );
});

const styles = StyleSheet.create({
  container: { width: '100%', marginBottom: tema.espacamento.medio, },
  label: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.preto, marginBottom: tema.espacamento.pequeno / 2, fontWeight: 'bold', },
  asterisco: { color: tema.cores.vermelho, },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, borderWidth: 1, borderColor: '#E0E0E0', backgroundColor: tema.cores.secundaria, },
  input: { flex: 1, paddingHorizontal: tema.espacamento.medio, paddingVertical: 12, fontSize: tema.fontes.tamanhoMedio, color: tema.cores.preto, minHeight: 49, },
  bordaErro: { borderColor: tema.cores.vermelho, },
  textoErro: { fontSize: 12, color: tema.cores.vermelho, marginTop: 4, },
});

export default InputFormulario;
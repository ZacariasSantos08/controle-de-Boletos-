import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import CardFormulario from '../../../../componentes/CardFormulario';
import Botao from '../../../../componentes/Botao';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import tema from '../../../../estilos/tema';

const LinhaDetalhe = ({ detalhe, index }) => {
  const { atualizarDetalhe, removerDetalhe } = useFormularioProduto();

  return (
    <View style={styles.linhaContainer}>
      <TextInput
        style={styles.inputNome}
        placeholder="Detalhe (Ex: Cor)"
        value={detalhe.nome}
        onChangeText={(txt) => atualizarDetalhe(index, 'nome', txt)}
      />
      <TextInput
        style={styles.inputValor}
        placeholder="Valor (Ex: Azul)"
        value={detalhe.valor}
        onChangeText={(txt) => atualizarDetalhe(index, 'valor', txt)}
      />
      <TouchableOpacity onPress={() => removerDetalhe(index)} style={styles.botaoRemover}>
        <Feather name="trash-2" size={20} color={tema.cores.vermelho} />
      </TouchableOpacity>
    </View>
  );
};

const CardDetalhesAdicionais = () => {
  const { form, adicionarDetalhe } = useFormularioProduto();

  return (
    <CardFormulario titulo="Detalhes Adicionais" icone="plus-circle">
      {form.detalhes.map((detalhe, index) => (
        <LinhaDetalhe key={index} detalhe={detalhe} index={index} />
      ))}
      <View style={{marginTop: tema.espacamento.medio}}>
        <Botao titulo="Adicionar Detalhe" onPress={adicionarDetalhe} tipo="secundario" icone="plus" />
      </View>
    </CardFormulario>
  );
};

const styles = StyleSheet.create({
  linhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tema.espacamento.pequeno,
    gap: tema.espacamento.pequeno,
  },
  inputNome: {
    flex: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: tema.espacamento.medio,
    height: 45,
    backgroundColor: '#FFF',
  },
  inputValor: {
    flex: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: tema.espacamento.medio,
    height: 45,
    backgroundColor: '#FFF',
  },
  botaoRemover: {
    padding: tema.espacamento.pequeno,
  },
});

export default CardDetalhesAdicionais;
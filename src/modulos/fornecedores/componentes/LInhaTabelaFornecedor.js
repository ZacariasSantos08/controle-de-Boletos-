import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarData, formatarTelefone } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const Celula = ({ children, largura = 150 }) => (
  <View style={[styles.celula, { width: largura }]}>
    <Text style={styles.textoCelula} numberOfLines={2}>{children}</Text>
  </View>
);

const LinhaTabelaFornecedor = ({ 
    fornecedor, 
    onPress,
    onLongPress,
    isSelecionado,
    selectionModeAtivo,
    isZebrada 
}) => {
  const nome = fornecedor.tipoPessoa === 'Física' 
    ? fornecedor.nomeCompleto 
    : (fornecedor.nomeFantasia || fornecedor.razaoSocial);
  
  const identificador = fornecedor.cpf || fornecedor.cnpj || 'N/A';
  const contato = fornecedor.telefone ? formatarTelefone(fornecedor.telefone) : fornecedor.email;
  const localidade = fornecedor.endereco?.cidade ? `${fornecedor.endereco.cidade} - ${fornecedor.endereco.estado}` : 'N/A';

  return (
    <TouchableOpacity 
        style={[styles.linha, isZebrada && styles.linhaZebrada, isSelecionado && styles.linhaSelecionada]}
        onPress={onPress}
        onLongPress={onLongPress}
        delayLongPress={300}
    >
      {selectionModeAtivo && (
        <View style={styles.containerCheckbox}>
          <View style={[styles.checkboxBase, isSelecionado && styles.checkboxChecked]}>
            {isSelecionado && <Feather name="check" size={18} color="white" />}
          </View>
        </View>
      )}
      {/* ALTERADO: O ScrollView foi removido daqui */}
      <Celula largura={120}>{fornecedor.codigoFornecedor || 'N/A'}</Celula>
      <Celula largura={200}>{nome || 'N/A'}</Celula>
      <Celula largura={150}>{identificador}</Celula>
      <Celula largura={150}>{contato || 'N/A'}</Celula>
      <Celula largura={200}>{localidade}</Celula>
      <Celula largura={100}>{fornecedor.status || 'Ativo'}</Celula>
      <Celula largura={120}>{formatarData(fornecedor.dataCriacao)}</Celula>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center', backgroundColor: tema.cores.branco, paddingLeft: 8, },
  linhaZebrada: { backgroundColor: '#F8F9FA' },
  linhaSelecionada: { backgroundColor: '#F3E9F9' },
  containerCheckbox: { paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', },
  checkboxBase: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: tema.cores.primaria, borderRadius: 4 },
  checkboxChecked: { backgroundColor: tema.cores.primaria },
  celula: { paddingHorizontal: tema.espacamento.pequeno, paddingVertical: tema.espacamento.medio, justifyContent: 'center', },
  textoCelula: { fontSize: 13, color: tema.cores.preto },
});

export default LinhaTabelaFornecedor;
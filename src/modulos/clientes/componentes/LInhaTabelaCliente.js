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

const LinhaTabelaCliente = ({ 
    cliente, 
    onPress,
    onLongPress,
    isSelecionado,
    selectionModeAtivo,
    isZebrada 
}) => {
  const nome = cliente.tipoPessoa === 'Fisica' 
    ? cliente.detalhesPessoaFisica?.nomeCompleto
    : (cliente.detalhesPessoaJuridica?.nomeFantasia || cliente.detalhesPessoaJuridica?.razaoSocial);
  
  const identificador = cliente.tipoPessoa === 'Fisica' 
    ? cliente.detalhesPessoaFisica?.cpf
    : cliente.detalhesPessoaJuridica?.cnpj;

  const telefone = cliente.telefones?.[0]?.numero 
    ? formatarTelefone(cliente.telefones[0].numero) 
    : 'N/A';

  const localidade = cliente.endereco?.cidade ? `${cliente.endereco.cidade} - ${cliente.endereco.estado}` : 'N/A';
  const dataCadastro = formatarData(cliente.clienteDesde);

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
      <Celula largura={120}>{cliente.codigoCliente || 'N/A'}</Celula>
      <Celula largura={200}>{nome || 'N/A'}</Celula>
      <Celula largura={150}>{identificador || 'N/A'}</Celula>
      <Celula largura={150}>{telefone}</Celula>
      <Celula largura={200}>{localidade}</Celula>
      <Celula largura={100}>{cliente.status}</Celula>
      <Celula largura={120}>{dataCadastro}</Celula>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center', backgroundColor: tema.cores.branco, paddingLeft: 8, },
  linhaZebrada: { backgroundColor: '#F8F9FA' },
  linhaSelecionada: { backgroundColor: '#E9F7FF' },
  containerCheckbox: { paddingHorizontal: 8, justifyContent: 'center', alignItems: 'center', },
  checkboxBase: { width: 26, height: 26, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: tema.cores.primaria, borderRadius: 4 },
  checkboxChecked: { backgroundColor: tema.cores.primaria },
  celula: { paddingHorizontal: tema.espacamento.pequeno, paddingVertical: tema.espacamento.medio, justifyContent: 'center', },
  textoCelula: { fontSize: 13, color: tema.cores.preto },
});

export default LinhaTabelaCliente;
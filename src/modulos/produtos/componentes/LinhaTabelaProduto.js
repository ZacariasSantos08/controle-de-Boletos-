import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const Celula = ({ children, largura = 150, style }) => (
  <View style={[styles.celula, { width: largura }, style]}>
    {typeof children === 'string' ? (
      <Text style={styles.textoCelula} numberOfLines={2}>{children}</Text>
    ) : (
      children
    )}
  </View>
);

const LinhaTabelaProduto = ({ 
    produto, 
    onPress,
    onLongPress,
    isSelecionado,
    selectionModeAtivo,
    isZebrada 
}) => {
  const nomeFornecedor = produto.fornecedor?.nomeFantasia || produto.fornecedor?.razaoSocial || 'N/A';
  const custoFormatado = formatarMoeda((produto.valorCusto || 0) * 100);
  const precoVendaFormatado = formatarMoeda((produto.valorVenda || 0) * 100);
  const dataCriacaoFormatada = formatarData(produto.dataCriacao);
  const dataAtualizacaoFormatada = formatarData(produto.dataAtualizacao);

  const primeiraImagem = produto.imagens && produto.imagens.length > 0 ? { uri: produto.imagens[0] } : null;

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
      <Celula largura={60} style={{ paddingHorizontal: 4 }}>
        {primeiraImagem ? (
          <Image source={primeiraImagem} style={styles.imagemProduto} />
        ) : (
          <View style={styles.imagemPlaceholder}>
            <Feather name="image" size={24} color={tema.cores.cinza} />
          </View>
        )}
      </Celula>
      <Celula largura={200}>{produto.nome}</Celula>
      <Celula largura={120}>{produto.codigoProduto || 'N/A'}</Celula>
      <Celula largura={150}>{produto.codigoDeBarras || 'N/A'}</Celula>
      <Celula largura={150}>{produto.categoria?.nome || 'N/A'}</Celula>
      <Celula largura={150}>{produto.marca?.nome || 'N/A'}</Celula>
      <Celula largura={150}>{nomeFornecedor}</Celula>
      <Celula largura={80}>{produto.estoqueDisponivel || 0}</Celula>
      <Celula largura={80}>{produto.estoqueMinimo || 0}</Celula>
      <Celula largura={120}>{custoFormatado}</Celula>
      <Celula largura={120}>{precoVendaFormatado}</Celula>
      <Celula largura={120}>{dataCriacaoFormatada}</Celula>
      <Celula largura={120}>{dataAtualizacaoFormatada}</Celula>
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
  textoCelula: { fontSize: 13 },
  imagemProduto: { width: 40, height: 40, borderRadius: 4, },
  imagemPlaceholder: { width: 40, height: 40, borderRadius: 4, backgroundColor: '#F0F0F0', justifyContent: 'center', alignItems: 'center', },
});

export default LinhaTabelaProduto;
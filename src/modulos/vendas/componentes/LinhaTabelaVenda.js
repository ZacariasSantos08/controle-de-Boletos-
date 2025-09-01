import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';

const Celula = ({ children, largura = 150 }) => (
  <View style={[styles.celula, { width: largura }]}>
    <Text style={styles.textoCelula} numberOfLines={2}>{children}</Text>
  </View>
);

const LinhaTabelaVenda = ({ venda, onPress, isZebrada }) => {
  const totalItens = venda.itens.reduce((acc, item) => acc + item.quantidade, 0);

  const formatarPagamentos = (pagamentos) => {
    if (!pagamentos || pagamentos.length === 0) {
      if (venda.pagamento && venda.pagamento.forma) {
        return `${venda.pagamento.forma} ${venda.pagamento.parcelas > 1 ? `(${venda.pagamento.parcelas}x)` : ''}`;
      }
      return 'N/A';
    }
    
    const primeiraForma = pagamentos[0].forma;
    if (pagamentos.length > 1) {
      return `${primeiraForma} +${pagamentos.length - 1}`;
    }
    
    if (pagamentos[0].forma === 'A Prazo (Promissória)' && pagamentos[0].parcelas > 1) {
      return `${primeiraForma} (${pagamentos[0].parcelas}x)`;
    }

    return primeiraForma;
  };

  const textoPagamento = formatarPagamentos(venda.pagamentos);

  return (
    <TouchableOpacity 
        style={[styles.linha, isZebrada && styles.linhaZebrada]}
        onPress={onPress}
    >
      <Celula largura={120}>{venda.codigoVenda}</Celula>
      <Celula largura={120}>{formatarData(venda.dataEmissao)}</Celula>
      <Celula largura={200}>{venda.clienteSnapshot.nome}</Celula>
      <Celula largura={80}>{totalItens}</Celula>
      <Celula largura={150}>{textoPagamento}</Celula>
      <Celula largura={120}>{formatarMoeda(venda.subtotalProdutos * 100)}</Celula>
      <Celula largura={120}>{formatarMoeda(venda.descontoTotal * 100)}</Celula>
      <Celula largura={120}>{formatarMoeda(venda.valorTotalVenda * 100)}</Celula>
      <Celula largura={100}>{venda.status}</Celula>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#F0F0F0', alignItems: 'center', backgroundColor: tema.cores.branco, },
  linhaZebrada: { backgroundColor: '#F8F9FA' },
  celula: { paddingHorizontal: tema.espacamento.pequeno, paddingVertical: tema.espacamento.medio, justifyContent: 'center', },
  textoCelula: { fontSize: 13, color: tema.cores.preto },
});

export default LinhaTabelaVenda;
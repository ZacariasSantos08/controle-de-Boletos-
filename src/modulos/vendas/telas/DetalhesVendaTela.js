import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';
import tema from '../../../estilos/tema';
import { cancelarVenda, buscarVendaPorId } from '../../../api/vendas.api';
import Botao from '../../../componentes/Botao';

const DetalhesVendaTela = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const [venda, setVenda] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  const carregarVenda = useCallback(async () => {
    setCarregando(true);
    const { vendaId } = route.params;
    const dadosDaVenda = await buscarVendaPorId(vendaId);
    if (dadosDaVenda) {
      setVenda(dadosDaVenda);
    } else {
      Toast.show({type: 'error', text1: 'Erro', text2: 'Venda não encontrada.'});
      navigation.goBack();
    }
    setCarregando(false);
  }, [route.params]);

  useFocusEffect(carregarVenda);

  const handleCancelarVenda = () => {
    Alert.alert(
      "Cancelar Venda",
      "Esta ação não pode ser desfeita. O estoque dos produtos será devolvido e as contas a receber serão canceladas. Deseja continuar?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar Venda",
          style: "destructive",
          onPress: async () => {
            try {
              const vendaCancelada = await cancelarVenda(venda.id);
              setVenda(vendaCancelada);
              Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Venda cancelada com sucesso!' });
            } catch (error) {
              Toast.show({ type: 'error', text1: 'Erro', text2: error.message });
            }
          },
        },
      ]
    );
  };

  const renderItemDoCarrinho = ({ item }) => (
    <View style={styles.itemLinha}>
      <Text style={styles.itemQuantidade}>{item.quantidade}x</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome}>{item.descricaoSnapshot}</Text>
        <Text style={styles.itemPrecoUnitario}>{formatarMoeda((item.valorUnitarioSnapshot || 0) * 100)} cada</Text>
      </View>
      <Text style={styles.itemTotal}>{formatarMoeda(((item.quantidade || 0) * (item.valorUnitarioSnapshot || 0)) * 100)}</Text>
    </View>
  );

  if (carregando || !venda) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.secao}>
        <View style={styles.card}>
          <View style={styles.linha}>
            <Text style={styles.label}>Código da Venda</Text>
            <Text style={styles.valorDestaque}>{venda.codigoVenda}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.valor}>{formatarData(venda.dataEmissao)}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.valor}>{venda.clienteSnapshot.nome}</Text>
          </View>
          <View style={[styles.linha, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Status</Text>
            <View style={[styles.statusBadge, {backgroundColor: venda.status === 'Cancelada' ? tema.cores.cinzaClaro : '#E6F4EA'}]}>
              <Text style={[styles.statusTexto, {color: venda.status === 'Cancelada' ? tema.cores.cinza : tema.cores.verde}]}>{venda.status}</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Itens Vendidos</Text>
        <View style={styles.card}>
          <FlatList
            data={venda.itens}
            keyExtractor={(item, index) => item.produtoId + index}
            renderItem={renderItemDoCarrinho}
            scrollEnabled={false}
          />
        </View>
      </View>
      
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Resumo Financeiro</Text>
        <View style={styles.card}>
          <View style={styles.linha}>
            <Text style={styles.label}>Subtotal dos produtos</Text>
            <Text style={styles.valor}>{formatarMoeda((venda.subtotalProdutos || 0) * 100)}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Frete</Text>
            <Text style={styles.valor}>{formatarMoeda((venda.valorFrete || 0) * 100)}</Text>
          </View>
          <View style={styles.linha}>
            <Text style={styles.label}>Desconto Total</Text>
            <Text style={styles.valorVermelho}>- {formatarMoeda((venda.valorDesconto || 0) * 100)}</Text>
          </View>
          <View style={[styles.linha, styles.linhaTotal]}>
            <Text style={styles.labelTotal}>VALOR TOTAL</Text>
            <Text style={styles.valorTotal}>{formatarMoeda((venda.valorTotalVenda || 0) * 100)}</Text>
          </View>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Pagamentos</Text>
        <View style={styles.card}>
          {(venda.pagamentos && venda.pagamentos.length > 0) ? (
            venda.pagamentos.map((p, index) => (
              <View key={index} style={[styles.linha, {borderBottomWidth: index === venda.pagamentos.length - 1 ? 0 : 1}]}>
                <Text style={styles.label}>{p.forma}</Text>
                <Text style={styles.valor}>{formatarMoeda((p.valor || 0) * 100)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.textoVazio}>Nenhum pagamento registrado.</Text>
          )}
        </View>
      </View>
      
      {venda.status !== 'Cancelada' && (
        <View style={styles.footer}>
          <Botao 
            titulo="Cancelar Venda"
            onPress={handleCancelarVenda}
            tipo="secundario"
            icone="x-circle"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  secao: { marginBottom: tema.espacamento.pequeno, paddingHorizontal: tema.espacamento.medio },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: tema.cores.preto, marginBottom: tema.espacamento.pequeno, marginTop: tema.espacamento.medio },
  card: { backgroundColor: tema.cores.branco, borderRadius: 8, padding: tema.espacamento.medio, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, shadowOffset: {width: 0, height: 1}},
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: tema.espacamento.medio, borderBottomWidth: 1, borderBottomColor: tema.cores.secundaria },
  label: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.cinza },
  valor: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.preto, fontWeight: '500' },
  valorDestaque: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.primaria, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusTexto: { fontWeight: 'bold' },
  itemLinha: { flexDirection: 'row', paddingVertical: tema.espacamento.medio, borderBottomWidth: 1, borderBottomColor: tema.cores.secundaria, alignItems: 'center' },
  itemQuantidade: { fontSize: tema.fontes.tamanhoMedio, fontWeight: 'bold', color: tema.cores.primaria, marginRight: tema.espacamento.medio },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.preto },
  itemPrecoUnitario: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.cinza },
  itemTotal: { fontSize: tema.fontes.tamanhoMedio, fontWeight: 'bold' },
  valorVermelho: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.vermelho, fontWeight: '500' },
  linhaTotal: { borderTopWidth: 2, borderTopColor: tema.cores.primaria, marginTop: tema.espacamento.medio, paddingTop: tema.espacamento.medio, borderBottomWidth: 0 },
  labelTotal: { fontSize: tema.fontes.tamanhoMedio, fontWeight: 'bold', color: tema.cores.primaria },
  valorTotal: { fontSize: 22, fontWeight: 'bold', color: tema.cores.primaria },
  textoVazio: { color: tema.cores.cinza, paddingVertical: 10 },
  footer: { paddingHorizontal: tema.espacamento.medio, paddingVertical: tema.espacamento.grande, },
});

export default DetalhesVendaTela;
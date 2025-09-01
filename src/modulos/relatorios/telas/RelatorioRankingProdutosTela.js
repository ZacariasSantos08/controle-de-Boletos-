import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRelatorioRankingProdutos } from '../hooks/useRelatorioRankingProdutos';
import SeletorDeData from '../../../componentes/SeletorDeData';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const OPCOES_RANKING = [
    { id: 'VALOR', nome: 'Por Valor (R$)' },
    { id: 'QUANTIDADE', nome: 'Por Quantidade (Un)' },
];

const ItemRankingProduto = ({ item, index, rankingPor }) => {
  const metrica = rankingPor === 'VALOR' 
    ? formatarMoeda(item.valorTotalVendido * 100)
    : `${item.quantidadeVendida} Un`;

  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemPosicao}>#{index + 1}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
      </View>
      <Text style={styles.itemMetrica}>{metrica}</Text>
    </View>
  );
};

const RelatorioRankingProdutosTela = () => {
  const hook = useRelatorioRankingProdutos();

  const CabecalhoRelatorio = () => (
    <View style={styles.cabecalhoContainer}>
      <View style={styles.filtrosContainer}>
        <View style={styles.seletorData}>
          <SeletorDeData label="De" data={hook.dataInicial} aoMudarData={hook.setDataInicial}/>
        </View>
        <View style={styles.seletorData}>
          <SeletorDeData label="Até" data={hook.dataFinal} aoMudarData={hook.setDataFinal}/>
        </View>
      </View>
      <GrupoDeBotoes 
        label="Rankear por:"
        opcoes={OPCOES_RANKING}
        selecionado={hook.rankingPor}
        aoSelecionar={hook.setRankingPor}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {hook.carregando ? (
        <ActivityIndicator size="large" color={tema.cores.primaria} style={{marginTop: 50}}/>
      ) : (
        <FlatList
          data={hook.ranking}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ItemRankingProduto item={item} index={index} rankingPor={hook.rankingPor} />
          )}
          ListHeaderComponent={CabecalhoRelatorio}
          ListEmptyComponent={
            <View style={styles.centralizado}>
              <Text style={styles.textoVazio}>Nenhuma venda de produtos encontrada para o período selecionado.</Text>
            </View>
          }
          contentContainerStyle={styles.lista}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  lista: { padding: tema.espacamento.medio },
  textoVazio: { fontSize: 16, color: tema.cores.cinza, textAlign: 'center' },
  cabecalhoContainer: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
  },
  seletorData: { flex: 1 },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tema.cores.branco,
    padding: tema.espacamento.medio,
    borderRadius: 8,
    marginBottom: tema.espacamento.pequeno,
  },
  itemPosicao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: tema.cores.cinza,
    width: 40,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    color: tema.cores.preto,
  },
  itemMetrica: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.primaria,
  },
});

export default RelatorioRankingProdutosTela;
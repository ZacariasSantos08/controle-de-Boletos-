import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRelatorioVendasPorCliente } from '../hooks/useRelatorioVendasPorCliente';
import SeletorDeData from '../../../componentes/SeletorDeData';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const ItemRankingCliente = ({ item, index }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemPosicao}>#{index + 1}</Text>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.itemSubtexto}>{item.quantidadeVendas} compra(s) no período</Text>
      </View>
      <Text style={styles.itemMetrica}>{formatarMoeda(item.totalComprado * 100)}</Text>
    </View>
  );
};

const RelatorioVendasPorClienteTela = () => {
  const hook = useRelatorioVendasPorCliente();

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
            <ItemRankingCliente item={item} index={index} />
          )}
          ListHeaderComponent={CabecalhoRelatorio}
          ListEmptyComponent={
            <View style={styles.centralizado}>
              <Text style={styles.textoVazio}>Nenhuma venda encontrada para o período selecionado.</Text>
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
    fontWeight: 'bold',
  },
  itemSubtexto: {
    fontSize: 12,
    color: tema.cores.cinza,
  },
  itemMetrica: {
    fontSize: 16,
    fontWeight: 'bold',
    color: tema.cores.verde,
  },
});

export default RelatorioVendasPorClienteTela;
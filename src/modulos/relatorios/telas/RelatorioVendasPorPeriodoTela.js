import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useRelatorioVendas } from '../hooks/useRelatorioVendas';
import SeletorDeData from '../../../componentes/SeletorDeData';
import CardVenda from '../../../modulos/vendas/componentes/CardVenda';
import ResumoFinanceiroWidget from '../../contas/componentes/ResumoFinanceiroWidget';
import tema from '../../../estilos/tema';

const RelatorioVendasPorPeriodoTela = ({ navigation }) => {
  const hook = useRelatorioVendas();

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
      <View style={styles.widgetsContainer}>
        <ResumoFinanceiroWidget 
          titulo="Total Vendido"
          valor={hook.totalVendido}
          icone="dollar-sign"
          cor={tema.cores.verde}
          carregando={hook.carregando}
        />
        <ResumoFinanceiroWidget 
          titulo="Ticket Médio"
          valor={hook.ticketMedio}
          icone="bar-chart-2"
          cor={tema.cores.primaria}
          carregando={hook.carregando}
        />
      </View>
       <Text style={styles.subtituloLista}>
          {hook.numeroDeVendas} venda(s) encontrada(s) no período
        </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={hook.vendasFiltradas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardVenda
            venda={item}
            aoPressionar={() => navigation.navigate('Vendas', { screen: 'DetalhesVenda', params: { venda: item } })}
          />
        )}
        ListHeaderComponent={CabecalhoRelatorio}
        ListEmptyComponent={
          !hook.carregando && (
            <View style={styles.centralizado}>
              <Text style={styles.textoVazio}>Nenhuma venda encontrada para o período selecionado.</Text>
            </View>
          )
        }
        contentContainerStyle={styles.lista}
      />
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
  widgetsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tema.espacamento.medio,
    marginTop: tema.espacamento.grande,
  },
  subtituloLista: {
    marginTop: tema.espacamento.grande,
    fontSize: 14,
    color: tema.cores.cinza,
    fontWeight: 'bold',
  }
});

export default RelatorioVendasPorPeriodoTela;
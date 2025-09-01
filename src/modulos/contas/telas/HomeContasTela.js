import React from 'react';
// NOVO: Importa o Dimensions para obter a largura da tela
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
// NOVO: Importa o componente de gráfico
import { BarChart } from 'react-native-chart-kit';
import { useHomeContas } from '../hooks/useHomeContas';
import ResumoFinanceiroWidget from '../componentes/ResumoFinanceiroWidget';
import CardOpcao from '../../../componentes/CardOpcao';
import tema from '../../../estilos/tema';

const HomeContasTela = ({ navigation }) => {
  // NOVO: Obtém os dados do gráfico do hook
  const { metricas, dadosGrafico, carregando } = useHomeContas();

  // NOVO: Configurações de estilo para o nosso gráfico
  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: tema.cores.primaria,
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel Financeiro</Text>
        <Text style={styles.subtitulo}>Resumo das suas movimentações.</Text>
      </View>

      <View style={styles.widgetsContainer}>
        <View style={styles.linhaWidget}>
          <ResumoFinanceiroWidget 
            titulo="A Receber (Aberto)"
            valor={metricas.totalAReceber}
            icone="arrow-down-circle"
            cor={tema.cores.primaria}
            carregando={carregando}
          />
          <ResumoFinanceiroWidget 
            titulo="A Pagar (Aberto)"
            valor={metricas.totalAPagar}
            icone="arrow-up-circle"
            cor={tema.cores.vermelho}
            carregando={carregando}
          />
        </View>
        <View style={styles.linhaWidget}>
          <ResumoFinanceiroWidget 
            titulo="Recebido no Mês"
            valor={metricas.recebidoNoMes}
            icone="trending-up"
            cor={tema.cores.verde}
            carregando={carregando}
          />
           <ResumoFinanceiroWidget 
            titulo="Saldo do Mês"
            valor={metricas.saldoDoMes}
            icone="dollar-sign"
            cor={metricas.saldoDoMes >= 0 ? tema.cores.verde : tema.cores.vermelho}
            carregando={carregando}
          />
        </View>
      </View>

      {/* NOVO: Seção para o gráfico de barras */}
      <View style={styles.graficoContainer}>
        <Text style={styles.graficoTitulo}>Receitas vs. Despesas (Últimos 6 Meses)</Text>
        {!carregando && (
          <BarChart
            data={dadosGrafico}
            width={screenWidth - (tema.espacamento.medio * 2)}
            height={220}
            chartConfig={chartConfig}
            verticalLabelRotation={30}
            fromZero
            showValuesOnTopOfBars
          />
        )}
      </View>

      <View style={styles.content}>
        <CardOpcao
          icone="arrow-down-left"
          titulo="Contas a Receber"
          descricao="Vendas a prazo e outras entradas"
          onPress={() => navigation.navigate('ContasAReceber')}
        />
        <CardOpcao
          icone="arrow-up-right"
          titulo="Contas a Pagar"
          descricao="Compras e despesas do negócio"
          onPress={() => navigation.navigate('ContasAPagar')}
        />
        <CardOpcao
          icone="activity"
          titulo="Fluxo de Caixa"
          descricao="Visualize todas as movimentações"
          onPress={() => navigation.navigate('FluxoDeCaixa')}
        />
        <CardOpcao
          icone="plus-circle"
          titulo="Novo Lançamento Manual"
          descricao="Cadastre uma despesa ou receita avulsa"
          onPress={() => navigation.navigate('LancamentoManual')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    header: { backgroundColor: tema.cores.primaria, padding: tema.espacamento.grande, paddingBottom: tema.espacamento.grande * 3 },
    titulo: { fontSize: tema.fontes.tamanhoTitulo, color: tema.cores.branco, fontWeight: 'bold' },
    subtitulo: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.branco, opacity: 0.8, marginTop: tema.espacamento.pequeno / 2 },
    widgetsContainer: {
      paddingHorizontal: tema.espacamento.medio,
      marginTop: -tema.espacamento.grande * 2,
    },
    linhaWidget: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tema.espacamento.medio,
      gap: tema.espacamento.medio,
    },
    // NOVO: Estilos para o container do gráfico
    graficoContainer: {
        backgroundColor: tema.cores.branco,
        borderRadius: 8,
        marginHorizontal: tema.espacamento.medio,
        padding: tema.espacamento.medio,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        alignItems: 'center',
    },
    graficoTitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: tema.espacamento.medio,
        color: tema.cores.preto,
    },
    content: { 
      padding: tema.espacamento.medio,
    },
});

export default HomeContasTela;
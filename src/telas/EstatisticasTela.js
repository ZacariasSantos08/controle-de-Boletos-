import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { BarChart, PieChart } from "react-native-chart-kit"; // NOVO: Importando os componentes de gráfico
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';

const screenWidth = Dimensions.get("window").width;

const EstatisticasTela = () => {
  const { boletos } = useContext(ContextoBoletos);

  // NOVO: Lógica para preparar os dados para o Gráfico de Pizza (Gastos por Emissor)
  const dadosGraficoPizza = useMemo(() => {
    const boletosPagos = boletos.filter(b => b.status === 'pago');
    if (boletosPagos.length === 0) return [];

    const gastosPorEmissor = boletosPagos.reduce((acc, boleto) => {
      acc[boleto.emissor] = (acc[boleto.emissor] || 0) + (boleto.valorPago || 0);
      return acc;
    }, {});

    // Gera uma cor aleatória para cada fatia do gráfico
    const gerarCor = () => `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;

    return Object.entries(gastosPorEmissor)
      .map(([nome, valor]) => ({
        name: nome,
        population: parseFloat(valor.toFixed(2)),
        color: gerarCor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 14
      }))
      .sort((a, b) => b.population - a.population); // Ordena do maior para o menor
  }, [boletos]);

  // NOVO: Lógica para preparar os dados para o Gráfico de Barras (Pagamentos por Mês)
  const dadosGraficoBarras = useMemo(() => {
    const boletosPagos = boletos.filter(b => b.status === 'pago');
    if (boletosPagos.length === 0) return { labels: [], datasets: [{ data: [] }] };
    
    const pagamentosPorMes = boletosPagos.reduce((acc, boleto) => {
        const mesAno = format(parseISO(boleto.dataPagamento), 'MMM/yy', { locale: ptBR });
        acc[mesAno] = (acc[mesAno] || 0) + (boleto.valorPago || 0);
        return acc;
    }, {});

    const labels = Object.keys(pagamentosPorMes).reverse(); // Meses mais recentes primeiro
    const data = labels.map(label => pagamentosPorMes[label]);

    return {
      labels,
      datasets: [{ data }]
    };
  }, [boletos]);


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.titulo}>Análise Gráfica</Text>

        {/* GRÁFICO DE BARRAS */}
        <View style={styles.containerGrafico}>
          <Text style={styles.tituloGrafico}>Total Pago por Mês</Text>
          {dadosGraficoBarras.labels.length > 0 ? (
            <BarChart
              data={dadosGraficoBarras}
              width={screenWidth - tema.espacamento.grande * 2}
              height={220}
              yAxisLabel="R$ "
              chartConfig={chartConfig}
              verticalLabelRotation={30}
              fromZero
            />
          ) : (
            <Text style={styles.textoVazio}>Nenhum boleto pago para exibir no gráfico.</Text>
          )}
        </View>

        {/* GRÁFICO DE PIZZA */}
        <View style={styles.containerGrafico}>
          <Text style={styles.tituloGrafico}>Gastos por Emissor</Text>
          {dadosGraficoPizza.length > 0 ? (
            <PieChart
              data={dadosGraficoPizza}
              width={screenWidth - tema.espacamento.grande * 2}
              height={220}
              chartConfig={chartConfig}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
            />
          ) : (
            <Text style={styles.textoVazio}>Nenhum boleto pago para exibir no gráfico.</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

// NOVO: Objeto de configuração para o estilo dos gráficos
const chartConfig = {
  backgroundColor: tema.cores.primaria,
  backgroundGradientFrom: tema.cores.secundaria,
  backgroundGradientTo: tema.cores.primaria,
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: tema.cores.primaria
  }
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo, },
  contentContainer: { padding: tema.espacamento.grande, },
  titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.grande, textAlign: 'center', },
  containerGrafico: {
    backgroundColor: '#FFFFFF',
    borderRadius: tema.raioBorda.grande,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.grande,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  tituloGrafico: {
    ...tema.tipografia.subtitulo,
    color: tema.cores.primaria,
    marginBottom: tema.espacamento.medio,
  },
  textoVazio: {
    ...tema.tipografia.corpo,
    color: tema.cores.cinza,
    padding: tema.espacamento.grande,
    textAlign: 'center',
  }
});

export default EstatisticasTela;
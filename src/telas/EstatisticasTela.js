import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Dimensions, Share } from 'react-native';
import { BarChart, PieChart } from "react-native-chart-kit";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Toast from 'react-native-toast-message';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';
import { Ionicons } from '@expo/vector-icons';
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';

const screenWidth = Dimensions.get("window").width;

// Componente para os cards de resumo rápido
const InfoBox = ({ icone, titulo, valor }) => (
  <View style={styles.infoBox}>
    <Ionicons name={icone} size={30} color={tema.cores.primaria} />
    <Text style={styles.infoBoxTitulo}>{titulo}</Text>
    <Text style={styles.infoBoxValor}>{valor}</Text>
  </View>
);

const EstatisticasTela = () => {
  const { boletos } = useContext(ContextoBoletos);

  // Lógica para preparar os dados para os cards de resumo
  const dadosEstatisticos = useMemo(() => {
    if (!boletos || boletos.length === 0) {
      return { totalBoletos: 0, totalPagos: 0, totalPendentes: 0, percentualPago: 0, totalPago: 0, totalPendente: 0, valorMedioBoleto: 0 };
    }
    const totalBoletos = boletos.length;
    const pagos = boletos.filter(b => b.status === 'pago');
    const pendentes = boletos.filter(b => b.status !== 'pago');
    const totalPago = pagos.reduce((acc, b) => acc + (b.valorPago || 0), 0);
    const totalPendente = pendentes.reduce((acc, b) => acc + (b.valor || 0), 0);
    const valorMedioBoleto = totalBoletos > 0 ? (totalPago + totalPendente) / totalBoletos : 0;
    return {
      totalBoletos, totalPagos: pagos.length, totalPendentes: pendentes.length,
      percentualPago: totalBoletos > 0 ? (pagos.length / totalBoletos) * 100 : 0,
      totalPago, totalPendente, valorMedioBoleto,
    };
  }, [boletos]);

  // Lógica para preparar os dados para o Gráfico de Pizza
  const dadosGraficoPizza = useMemo(() => {
    const boletosPagos = boletos.filter(b => b.status === 'pago');
    if (boletosPagos.length === 0) return [];
    const totalPago = boletosPagos.reduce((acc, b) => acc + (b.valorPago || 0), 0);
    if (totalPago === 0) return [];
    const gastosPorEmissor = boletosPagos.reduce((acc, boleto) => {
      acc[boleto.emissor] = (acc[boleto.emissor] || 0) + (boleto.valorPago || 0);
      return acc;
    }, {});
    const gerarCor = () => `rgba(${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 155) + 100}, ${Math.floor(Math.random() * 255)}, 1)`;
    return Object.entries(gastosPorEmissor)
      .map(([nome, valor]) => ({
        name: nome.length > 15 ? `${nome.substring(0, 12)}...` : nome,
        population: parseFloat(valor.toFixed(2)),
        color: gerarCor(),
        legendFontColor: "#7F7F7F",
        legendFontSize: 14,
        percentage: ((valor / totalPago) * 100).toFixed(1)
      }))
      .sort((a, b) => b.population - a.population);
  }, [boletos]);

  // Lógica para preparar os dados para o Gráfico de Barras
  const dadosGraficoBarras = useMemo(() => {
    const boletosPagos = boletos.filter(b => b.status === 'pago');
    if (boletosPagos.length === 0) return { labels: [], datasets: [{ data: [] }] };
    const pagamentosPorMes = {};
    boletosPagos.sort((a, b) => new Date(a.dataPagamento) - new Date(b.dataPagamento));
    boletosPagos.forEach(boleto => {
        const mesAno = format(parseISO(boleto.dataPagamento), 'MMM/yy', { locale: ptBR });
        pagamentosPorMes[mesAno] = (pagamentosPorMes[mesAno] || 0) + (boleto.valorPago || 0);
    });
    const labels = Object.keys(pagamentosPorMes).slice(-6);
    const data = labels.map(label => pagamentosPorMes[label]);
    return { labels, datasets: [{ data }] };
  }, [boletos]);

  const barChartWidth = Math.max(screenWidth, (dadosGraficoBarras.labels?.length || 0) * 80);

  const handleBackup = async () => {
    if (boletos.length === 0) { Toast.show({ type: 'error', text1: 'Atenção', text2: 'Não há dados para fazer backup.' }); return; }
    try {
      const dadosEmJson = JSON.stringify(boletos, null, 2);
      await Share.share({ message: dadosEmJson, title: `Backup Boletos - ${new Date().toLocaleDateString('pt-BR')}.json` });
    } catch (error) { Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível compartilhar o backup.' }); }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.titulo}>Estatísticas e Análise</Text>

        <View style={styles.grid}>
          <InfoBox icone="document-text-outline" titulo="Total de Boletos" valor={dadosEstatisticos.totalBoletos} />
          <InfoBox icone="checkmark-done-outline" titulo="Boletos Pagos" valor={dadosEstatisticos.totalPagos} />
          <InfoBox icone="hourglass-outline" titulo="Boletos Pendentes" valor={dadosEstatisticos.totalPendentes} />
          <InfoBox icone="trending-up-outline" titulo="% de Boletos Pagos" valor={`${dadosEstatisticos.percentualPago.toFixed(1)}%`} />
        </View>

        <View style={styles.containerGrafico}>
          <Text style={styles.tituloGrafico}>Total Pago por Mês (Últimos 6 meses)</Text>
          {(dadosGraficoBarras.labels?.length || 0) > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <BarChart
                data={dadosGraficoBarras}
                width={barChartWidth}
                height={220}
                formatYLabel={(yLabel) => `R$ ${yLabel}`}
                chartConfig={chartConfig}
                fromZero
                showValuesOnTopOfBars
              />
            </ScrollView>
          ) : ( <Text style={styles.textoVazio}>Nenhum boleto pago para exibir o gráfico.</Text> )}
        </View>

        <View style={styles.containerGrafico}>
          <Text style={styles.tituloGrafico}>Gastos por Emissor</Text>
          {dadosGraficoPizza.length > 0 ? (
            <>
              <PieChart data={dadosGraficoPizza} width={screenWidth} height={220} chartConfig={chartConfig} accessor={"population"} backgroundColor={"transparent"} paddingLeft={"0"} center={[screenWidth / 4, 0]} hasLegend={false} />
              <View style={styles.legendContainer}>
                {dadosGraficoPizza.map(item => (
                  <View key={item.name} style={styles.legendItem}>
                    <View style={[styles.colorSwatch, { backgroundColor: item.color }]} />
                    <Text style={styles.legendText}>{item.name} ({item.percentage}%)</Text>
                  </View>
                ))}
              </View>
            </>
          ) : ( <Text style={styles.textoVazio}>Nenhum boleto pago para exibir o gráfico.</Text> )}
        </View>

        <View style={styles.fullWidthCard}>
          <Ionicons name="cash-outline" size={30} color={tema.cores.sucesso} />
          <Text style={styles.fullWidthTitle}>Valor Total Pago</Text>
          <Text style={styles.fullWidthValue}>R$ {dadosEstatisticos.totalPago.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.fullWidthCard}>
          <Ionicons name="alert-circle-outline" size={30} color={tema.cores.erro} />
          <Text style={styles.fullWidthTitle}>Valor Total Pendente</Text>
          <Text style={styles.fullWidthValue}>R$ {dadosEstatisticos.totalPendente.toFixed(2).replace('.', ',')}</Text>
        </View>

        <View style={styles.backupContainer}>
          <Ionicons name="save-outline" size={30} color={tema.cores.primaria} />
          <Text style={styles.backupTitulo}>Exportar Dados (Backup)</Text>
          <BotaoPersonalizado titulo="Fazer Backup Agora" onPress={handleBackup} tipo="secundario" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#FFFFFF',
  backgroundGradientTo: '#FFFFFF',
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 87, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: tema.cores.secundaria
  },
  propsForBackgroundLines: {
      stroke: tema.cores.borda,
  }
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  contentContainer: { paddingVertical: tema.espacamento.grande, paddingHorizontal: tema.espacamento.medio },
  titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.grande, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: tema.espacamento.medio },
  infoBox: { backgroundColor: '#FFF', width: '48%', paddingVertical: tema.espacamento.medio, borderRadius: tema.raioBorda.medio, alignItems: 'center', marginBottom: tema.espacamento.medio, elevation: 2 },
  infoBoxTitulo: { fontSize: 14, color: tema.cores.cinza, textAlign: 'center', marginTop: 8 },
  infoBoxValor: { ...tema.tipografia.subtitulo, color: tema.cores.primaria, marginTop: 4 },
  containerGrafico: { backgroundColor: '#FFFFFF', borderRadius: tema.raioBorda.grande, paddingVertical: tema.espacamento.medio, marginBottom: tema.espacamento.grande, alignItems: 'center', elevation: 3 },
  tituloGrafico: { ...tema.tipografia.subtitulo, color: tema.cores.primaria, marginBottom: tema.espacamento.medio },
  textoVazio: { ...tema.tipografia.corpo, color: tema.cores.cinza, padding: tema.espacamento.grande, textAlign: 'center' },
  fullWidthCard: { backgroundColor: '#FFF', borderRadius: tema.raioBorda.medio, padding: tema.espacamento.grande, alignItems: 'center', marginBottom: tema.espacamento.medio, elevation: 2 },
  fullWidthTitle: { fontSize: 16, color: tema.cores.cinza, marginTop: 8 },
  fullWidthValue: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginTop: 4 },
  backupContainer: { backgroundColor: '#FFFFFF', borderRadius: tema.raioBorda.medio, padding: tema.espacamento.grande, marginTop: tema.espacamento.medio, elevation: 2, alignItems: 'center' },
  backupTitulo: { ...tema.tipografia.subtitulo, color: tema.cores.primaria, textAlign: 'center', marginVertical: tema.espacamento.pequeno },
  legendContainer: { width: '100%', paddingHorizontal: tema.espacamento.grande, marginTop: tema.espacamento.medio, },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: tema.espacamento.pequeno, },
  colorSwatch: { width: 14, height: 14, borderRadius: 7, marginRight: tema.espacamento.pequeno, },
  legendText: { ...tema.tipografia.legenda, color: tema.cores.cinza, },
});

export default EstatisticasTela;
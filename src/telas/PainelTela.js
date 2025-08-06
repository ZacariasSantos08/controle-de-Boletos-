import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';
import { isAfter, parseISO, differenceInCalendarDays, subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale'; // CORREÇÃO AQUI
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const CardResumo = ({ icone, titulo, valor, cor, filtro, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress(filtro)}>
    <View style={[styles.iconeContainer, { backgroundColor: cor }]}>
      <Ionicons name={icone} size={24} color="#FFF" />
    </View>
    <View>
      <Text style={styles.cardTitulo}>{titulo}</Text>
      <Text style={styles.cardValor}>{valor}</Text>
    </View>
  </TouchableOpacity>
);

const ItemProximoVencimento = ({ item, navigation }) => {
  
  const formatarDataVencimento = (data) => {
    const hoje = new Date();
    const dataVenc = parseISO(data);
    const diasParaVencer = differenceInCalendarDays(dataVenc, hoje);

    if (diasParaVencer === 0) {
      return { texto: 'Vence hoje', cor: tema.cores.aviso };
    }
    if (diasParaVencer === 1) {
      return { texto: 'Vence amanhã', cor: tema.cores.aviso };
    }
    if (diasParaVencer > 1) {
      return { texto: `Vence em ${diasParaVencer} dias`, cor: tema.cores.primaria };
    }
    return { texto: 'Vencido', cor: tema.cores.erro };
  };

  const { texto, cor } = formatarDataVencimento(item.vencimento);
  const valorFormatado = (item.valor || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <TouchableOpacity 
      style={styles.itemVencimentoContainer}
      onPress={() => navigation.navigate('Boletos', { screen: 'FormularioBoleto', params: { boletoId: item.id } })}
    >
      <View style={styles.itemVencimentoIcone}>
        <Ionicons name="document-text-outline" size={24} color={tema.cores.primaria} />
      </View>
      <View style={styles.itemVencimentoInfo}>
        <Text style={styles.itemVencimentoDescricao} numberOfLines={1}>{item.descricao}</Text>
        <Text style={styles.itemVencimentoEmissor} numberOfLines={1}>{item.emissor}</Text>
      </View>
      <View style={styles.itemVencimentoValores}>
        <Text style={styles.itemVencimentoValor}>R$ {valorFormatado}</Text>
        <Text style={[styles.itemVencimentoData, { color: cor }]}>{texto}</Text>
      </View>
    </TouchableOpacity>
  );
};

const chartConfig = {
  backgroundGradientFrom: tema.cores.superficie,
  backgroundGradientTo: tema.cores.superficie,
  decimalPlaces: 2,
  color: (opacity = 1) => `rgba(0, 87, 146, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
  style: { borderRadius: tema.raioBorda.medio },
  propsForDots: { r: "6", strokeWidth: "2", stroke: tema.cores.secundaria },
  propsForBackgroundLines: { stroke: tema.cores.borda }
};

const PainelTela = () => {
  const { boletos } = useContext(ContextoBoletos);
  const navigation = useNavigation();

  const dadosPainel = useMemo(() => {
    const pendentes = boletos.filter(b => b.status !== 'pago');
    const vencidos = pendentes.filter(b => b.status === 'vencido');
    const vencendo = pendentes.filter(b => b.status === 'vencendo');
    const pagos = boletos.filter(b => b.status === 'pago');
    const totalAberto = pendentes.reduce((acc, b) => acc + (b.valor || 0), 0);
    const totalVencido = vencidos.reduce((acc, b) => acc + (b.valor || 0), 0);
    const totalVencendo = vencendo.reduce((acc, b) => acc + (b.valor || 0), 0);
    const totalPago = pagos.reduce((acc, b) => acc + (b.valorPago || 0), 0);
    return { totalAberto, totalVencido, totalVencendo, totalPago };
  }, [boletos]);

  const proximosVencimentos = useMemo(() => {
    const hoje = new Date();
    return boletos
      .filter(b => 
        b.status !== 'pago' && isAfter(parseISO(b.vencimento), subDays(hoje, 1))
      )
      .sort((a, b) => new Date(a.vencimento).getTime() - new Date(b.vencimento).getTime())
      .slice(0, 5);
  }, [boletos]);

  const dadosGraficoResumo = useMemo(() => {
    const boletosPagos = boletos.filter(b => b.status === 'pago');
    if (boletosPagos.length === 0) return { labels: [], datasets: [{ data: [] }] };
    
    const pagamentosPorMes = {};
    boletosPagos.sort((a, b) => new Date(a.dataPagamento).getTime() - new Date(b.dataPagamento).getTime());

    boletosPagos.forEach(boleto => {
      const mesAno = format(parseISO(boleto.dataPagamento), 'MMM/yy', { locale: ptBR });
      pagamentosPorMes[mesAno] = (pagamentosPorMes[mesAno] || 0) + (boleto.valorPago || 0);
    });

    const labels = Object.keys(pagamentosPorMes).slice(-4);
    const data = labels.map(label => pagamentosPorMes[label]);
    return { labels, datasets: [{ data }] };
  }, [boletos]);

  const navegarParaLista = (filtro) => {
    navigation.navigate('Boletos', { screen: 'ListaBoletos', params: { filtro } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.titulo}>Resumo Financeiro</Text>

        <CardResumo icone="wallet-outline" titulo="Total em Aberto" valor={`R$ ${dadosPainel.totalAberto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} cor={tema.cores.primaria} filtro="pendentes" onPress={navegarParaLista} />
        <CardResumo icone="alert-circle-outline" titulo="Total Vencendo" valor={`R$ ${dadosPainel.totalVencendo.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} cor={tema.cores.aviso} filtro="vencendo" onPress={navegarParaLista} />
        <CardResumo icone="close-circle-outline" titulo="Total Vencido" valor={`R$ ${dadosPainel.totalVencido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} cor={tema.cores.erro} filtro="vencido" onPress={navegarParaLista} />
        <CardResumo icone="checkmark-circle-outline" titulo="Total Pago" valor={`R$ ${dadosPainel.totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} cor={tema.cores.sucesso} filtro="pago" onPress={navegarParaLista} />

        <View style={styles.secaoVencimentos}>
          <Text style={styles.tituloSecao}>Próximos Vencimentos</Text>
          {proximosVencimentos.length > 0 ? (
            <FlatList data={proximosVencimentos} keyExtractor={item => item.id} renderItem={({ item }) => <ItemProximoVencimento item={item} navigation={navigation} />} scrollEnabled={false}/>
          ) : (
            <View style={styles.semVencimentosContainer}><Text style={styles.semVencimentosTexto}>Nenhum boleto a vencer nos próximos dias.</Text><Text style={styles.semVencimentosSubtexto}>Você está em dia!</Text></View>
          )}
        </View>

        <View style={styles.secaoGrafico}>
            <Text style={styles.tituloSecao}>Resumo dos Últimos Meses</Text>
            {dadosGraficoResumo.labels.length > 0 ? (
                <BarChart
                    data={dadosGraficoResumo}
                    width={screenWidth - tema.espacamento.grande * 2}
                    height={220}
                    chartConfig={chartConfig}
                    fromZero
                    showValuesOnTopOfBars
                    yAxisLabel="R$ "
                    style={{ borderRadius: tema.raioBorda.medio }}
                />
            ) : (
                <View style={styles.semVencimentosContainer}>
                    <Text style={styles.semVencimentosTexto}>Não há dados de pagamentos.</Text>
                    <Text style={styles.semVencimentosSubtexto}>Pague um boleto para ver o resumo.</Text>
                </View>
            )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
    contentContainer: { padding: tema.espacamento.grande, },
    titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.grande, textAlign: 'center', },
    card: { backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, padding: tema.espacamento.medio, flexDirection: 'row', alignItems: 'center', marginBottom: tema.espacamento.medio, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, },
    iconeContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: tema.espacamento.medio, },
    cardTitulo: { ...tema.tipografia.subtitulo, fontSize: 16, color: tema.cores.texto, },
    cardValor: { ...tema.tipografia.corpo, fontWeight: 'bold', color: tema.cores.primaria, marginTop: 4, },
    secaoVencimentos: { marginTop: tema.espacamento.grande, },
    tituloSecao: { ...tema.tipografia.subtitulo, color: tema.cores.texto, marginBottom: tema.espacamento.medio, },
    itemVencimentoContainer: { backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, padding: tema.espacamento.medio, flexDirection: 'row', alignItems: 'center', marginBottom: tema.espacamento.pequeno, elevation: 2, },
    itemVencimentoIcone: { marginRight: tema.espacamento.medio, },
    itemVencimentoInfo: { flex: 1, },
    itemVencimentoDescricao: { ...tema.tipografia.corpo, color: tema.cores.texto, fontWeight: 'bold', },
    itemVencimentoEmissor: { ...tema.tipografia.legenda, color: tema.cores.cinza, },
    itemVencimentoValores: { alignItems: 'flex-end', },
    itemVencimentoValor: { ...tema.tipografia.corpo, color: tema.cores.texto, fontWeight: 'bold', },
    itemVencimentoData: { ...tema.tipografia.legenda, fontWeight: 'bold', },
    semVencimentosContainer: { backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, padding: tema.espacamento.grande, alignItems: 'center', },
    semVencimentosTexto: { ...tema.tipografia.corpo, color: tema.cores.texto, fontWeight: 'bold', textAlign: 'center', },
    semVencimentosSubtexto: { ...tema.tipografia.legenda, color: tema.cores.cinza, marginTop: tema.espacamento.pequeno, },
    secaoGrafico: { marginTop: tema.espacamento.grande, },
});

export default PainelTela;
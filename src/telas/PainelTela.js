import React, { useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import { tema } from '../estilos/tema';

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

const PainelTela = () => {
  const { boletos } = useContext(ContextoBoletos);
  const navigation = useNavigation();

  const dadosPainel = useMemo(() => {
    const pendentes = boletos.filter(b => b.status !== 'pago');
    const vencidos = pendentes.filter(b => b.status === 'vencido');
    const vencendo = pendentes.filter(b => b.status === 'vencendo');
    const pagos = boletos.filter(b => b.status === 'pago');
    const totalAberto = pendentes.reduce((acc, b) => acc + b.valor, 0);
    const totalVencido = vencidos.reduce((acc, b) => acc + b.valor, 0);
    const totalVencendo = vencendo.reduce((acc, b) => acc + b.valor, 0);
    const totalPago = pagos.reduce((acc, b) => acc + (b.valorPago || 0), 0);
    return { totalAberto, totalVencido, totalVencendo, totalPago, };
  }, [boletos]);

  const navegarParaLista = (filtro) => {
    navigation.navigate('Boletos', { screen: 'ListaBoletos', params: { filtro }, });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.titulo}>Resumo Financeiro</Text>
        <CardResumo icone="wallet-outline" titulo="Total em Aberto" valor={`R$ ${dadosPainel.totalAberto.toFixed(2).replace('.', ',')}`} cor={tema.cores.primaria} filtro="pendentes" onPress={navegarParaLista} />
        <CardResumo icone="alert-circle-outline" titulo="Total Vencendo" valor={`R$ ${dadosPainel.totalVencendo.toFixed(2).replace('.', ',')}`} cor={tema.cores.aviso} filtro="vencendo" onPress={navegarParaLista} />
        <CardResumo icone="close-circle-outline" titulo="Total Vencido" valor={`R$ ${dadosPainel.totalVencido.toFixed(2).replace('.', ',')}`} cor={tema.cores.erro} filtro="vencido" onPress={navegarParaLista} />
        <CardResumo icone="checkmark-circle-outline" titulo="Total Pago" valor={`R$ ${dadosPainel.totalPago.toFixed(2).replace('.', ',')}`} cor={tema.cores.sucesso} filtro="pago" onPress={navegarParaLista} />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: tema.cores.fundo, top: 30 },
    contentContainer: { padding: tema.espacamento.grande, },
    titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.grande, textAlign: 'center', },
    card: { backgroundColor: '#FFF', borderRadius: tema.raioBorda.medio, padding: tema.espacamento.grande, flexDirection: 'row', alignItems: 'center', marginBottom: tema.espacamento.medio, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, },
    iconeContainer: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: tema.espacamento.medio, },
    cardTitulo: { ...tema.tipografia.subtitulo, fontSize: 16, color: tema.cores.texto, },
    cardValor: { ...tema.tipografia.corpo, fontWeight: 'bold', color: tema.cores.primaria, marginTop: 4, },
});
export default PainelTela;
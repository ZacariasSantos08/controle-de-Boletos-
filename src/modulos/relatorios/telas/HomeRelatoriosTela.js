import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import tema from '../../../estilos/tema';
import CardOpcao from '../../../componentes/CardOpcao';

const HomeRelatoriosTela = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Central de Relatórios</Text>
        <Text style={styles.subtitulo}>Analise a performance do seu negócio.</Text>
      </View>
      <View style={styles.content}>
        <CardOpcao
          icone="file-text"
          titulo="Demonstrativo de Resultados (DRE)"
          descricao="Veja o lucro ou prejuízo do período"
          onPress={() => navigation.navigate('RelatorioDRE')}
        />
        <CardOpcao
          icone="calendar"
          titulo="Vendas por Período"
          descricao="Filtre e analise as vendas por data"
          onPress={() => navigation.navigate('RelatorioVendasPorPeriodo')}
        />
        <CardOpcao
          icone="bar-chart-2"
          titulo="Ranking de Produtos"
          descricao="Veja os produtos mais vendidos"
          onPress={() => navigation.navigate('RelatorioRankingProdutos')}
        />
         <CardOpcao
          icone="users"
          titulo="Vendas por Cliente"
          descricao="Identifique seus principais clientes"
          onPress={() => navigation.navigate('RelatorioVendasPorCliente')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    header: { backgroundColor: tema.cores.primaria, padding: tema.espacamento.grande, paddingBottom: tema.espacamento.grande * 2 },
    titulo: { fontSize: tema.fontes.tamanhoTitulo, color: tema.cores.branco, fontWeight: 'bold' },
    subtitulo: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.branco, opacity: 0.8, marginTop: tema.espacamento.pequeno / 2 },
    content: { padding: tema.espacamento.medio, marginTop: -tema.espacamento.grande },
});

export default HomeRelatoriosTela;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tema from '../../../estilos/tema';
// ALTERADO: Importando o componente do novo local centralizado
import CardOpcao from '../../../componentes/CardOpcao';

const HomeVendasTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Vendas</Text>
        <Text style={styles.subtitulo}>Inicie uma nova venda ou consulte seu histórico.</Text>
      </View>
      <View style={styles.content}>
        <CardOpcao
          icone="plus-square"
          titulo="Realizar Nova Venda"
          descricao="Acesse o PDV para adicionar produtos e clientes"
          onPress={() => navigation.navigate('Pdv')}
        />
        <CardOpcao
          icone="clock"
          titulo="Ver Histórico de Vendas"
          descricao="Consulte, filtre e analise todas as suas vendas"
          onPress={() => navigation.navigate('HistoricoVendas')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    header: { backgroundColor: tema.cores.primaria, padding: tema.espacamento.grande, paddingBottom: tema.espacamento.grande * 2 },
    titulo: { fontSize: tema.fontes.tamanhoTitulo, color: tema.cores.branco, fontWeight: 'bold' },
    subtitulo: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.branco, opacity: 0.8, marginTop: tema.espacamento.pequeno / 2 },
    content: { padding: tema.espacamento.medio, marginTop: -tema.espacamento.grande },
});

export default HomeVendasTela;
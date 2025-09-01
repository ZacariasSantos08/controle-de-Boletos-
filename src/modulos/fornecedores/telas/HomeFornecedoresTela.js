import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tema from '../../../estilos/tema';
// ALTERADO: Importando o componente do novo local centralizado
import CardOpcao from '../../../componentes/CardOpcao';

const HomeFornecedoresTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gerenciar Fornecedores</Text>
        <Text style={styles.subtitulo}>Acesse sua lista ou crie um novo fornecedor.</Text>
      </View>
      <View style={styles.content}>
        <CardOpcao
          icone="list"
          titulo="Ver Lista de Fornecedores"
          descricao="Visualize, edite e gerencie seus fornecedores"
          onPress={() => navigation.navigate('ListaFornecedores')}
        />
        <CardOpcao
          icone="plus-square"
          titulo="Cadastrar Novo Fornecedor"
          descricao="Adicione um novo parceiro de negócios"
          onPress={() => navigation.navigate('CadastroFornecedor')}
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
export default HomeFornecedoresTela;
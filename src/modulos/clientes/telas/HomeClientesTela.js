import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tema from '../../../estilos/tema';
// ALTERADO: Importando o componente do novo local centralizado
import CardOpcao from '../../../componentes/CardOpcao';

const HomeClientesTela = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Gerenciar Clientes</Text>
        <Text style={styles.subtitulo}>Acesse sua lista ou cadastre um novo cliente.</Text>
      </View>
      <View style={styles.content}>
        <CardOpcao
          icone="list"
          titulo="Ver Lista de Clientes"
          descricao="Visualize, edite e gerencie seus clientes"
          onPress={() => navigation.navigate('ListaClientes')}
        />
        <CardOpcao
          icone="plus-square"
          titulo="Cadastrar Novo Cliente"
          descricao="Adicione um novo cliente à sua base de dados"
          onPress={() => navigation.navigate('CadastroCliente')}
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
export default HomeClientesTela;
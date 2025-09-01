import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useListaContas } from '../hooks/useListaContas';
import CardConta from '../componentes/CardConta';
import BarraDeBusca from '../../../modulos/produtos/componentes/BarraDeBusca';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const ContasAPagarTela = ({ navigation }) => {
  const { contas, carregando, termoBusca, setTermoBusca } = useListaContas('PAGAR');

  if (carregando) {
    return (
      <View style={styles.centralizado}>
        <ActivityIndicator size="large" color={tema.cores.primaria} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarraDeBusca
        valor={termoBusca}
        aoMudarTexto={setTermoBusca}
        placeholder="Buscar por fornecedor ou descrição..."
      />
      <FlatList
        data={contas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CardConta
            conta={item}
            onPress={() => {
              navigation.navigate('DetalhesConta', { contaId: item.id });
            }}
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          !carregando && (
            <EstadoVazio
              icone="arrow-up-right"
              titulo="Nenhuma Conta a Pagar"
              subtitulo="Você pode adicionar despesas e outras contas manualmente através do Hub Financeiro."
              textoBotao="Adicionar Lançamento"
              onPressBotao={() => navigation.navigate('LancamentoManual')}
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tema.cores.secundaria,
  },
  centralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    flexGrow: 1,
    padding: tema.espacamento.medio,
  },
});

export default ContasAPagarTela;
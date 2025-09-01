import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useListaContas } from '../hooks/useListaContas';
import CardConta from '../componentes/CardConta';
import BarraDeBusca from '../../../modulos/produtos/componentes/BarraDeBusca';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const ContasAReceberTela = ({ navigation }) => {
  const { contas, carregando, termoBusca, setTermoBusca } = useListaContas('RECEBER');

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
        placeholder="Buscar por cliente ou descrição..."
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
              icone="arrow-down-left"
              titulo="Nenhuma Conta a Receber"
              subtitulo="As contas a receber são criadas automaticamente quando você realiza uma venda a prazo."
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

export default ContasAReceberTela;
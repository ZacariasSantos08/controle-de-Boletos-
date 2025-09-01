import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useFluxoDeCaixa } from '../hooks/useFluxoDeCaixa';
import CardMovimentacao from '../componentes/CardMovimentacao';
import SeletorDeData from '../../../componentes/SeletorDeData';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const OPCOES_TIPO = [
    { id: 'TODOS', nome: 'Todos' },
    { id: 'ENTRADA', nome: 'Entradas' },
    { id: 'SAIDA', nome: 'Saídas' },
];

const CabecalhoFluxoCaixa = ({
  hook,
}) => {
  return (
    <View style={styles.cabecalhoContainer}>
      <View style={styles.filtrosContainer}>
        <View style={styles.seletorData}>
          <SeletorDeData label="De" data={hook.filtroDataInicial} aoMudarData={hook.setFiltroDataInicial}/>
        </View>
        <View style={styles.seletorData}>
          <SeletorDeData label="Até" data={hook.filtroDataFinal} aoMudarData={hook.setFiltroDataFinal}/>
        </View>
      </View>
      <GrupoDeBotoes opcoes={OPCOES_TIPO} selecionado={hook.filtroTipo} aoSelecionar={hook.setFiltroTipo}/>
      
      <View style={styles.resumoContainer}>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Entradas</Text>
          <Text style={[styles.resumoValor, {color: tema.cores.verde}]}>{formatarMoeda(hook.totalEntradas * 100)}</Text>
        </View>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Saídas</Text>
          <Text style={[styles.resumoValor, {color: tema.cores.vermelho}]}>{formatarMoeda(hook.totalSaidas * 100)}</Text>
        </View>
        <View style={styles.resumoItem}>
          <Text style={styles.resumoLabel}>Saldo do Período</Text>
          <Text style={[styles.resumoValor, {color: hook.saldoPeriodo >= 0 ? tema.cores.primaria : tema.cores.vermelho}]}>
            {formatarMoeda(hook.saldoPeriodo * 100)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const FluxoDeCaixaTela = () => {
  const hook = useFluxoDeCaixa();

  if (hook.carregando) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={hook.movimentacoes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CardMovimentacao movimentacao={item} />}
        contentContainerStyle={styles.lista}
        ListHeaderComponent={<CabecalhoFluxoCaixa hook={hook} />}
        ListEmptyComponent={
          !hook.carregando && (
            <EstadoVazio
              icone="activity"
              titulo="Nenhuma Movimentação"
              subtitulo="Nenhuma transação foi encontrada para os filtros selecionados."
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
    padding: 20,
  },
  lista: {
    flexGrow: 1,
    paddingBottom: tema.espacamento.grande,
  },
  cabecalhoContainer: {
    backgroundColor: tema.cores.branco,
    padding: tema.espacamento.medio,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  filtrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
  },
  seletorData: {
    flex: 1,
  },
  resumoContainer: {
    marginTop: tema.espacamento.grande,
    padding: tema.espacamento.medio,
    backgroundColor: tema.cores.secundaria,
    borderRadius: 8,
  },
  resumoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  resumoLabel: {
    fontSize: 14,
    color: tema.cores.cinza,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FluxoDeCaixaTela;
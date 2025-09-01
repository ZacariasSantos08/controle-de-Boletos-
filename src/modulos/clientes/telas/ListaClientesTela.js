import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useListaClientes } from '../hooks/useListaClientes';
import CardCliente from '../componentes/CardCliente';
import LinhaTabelaCliente from '../componentes/LInhaTabelaCliente';
import BarraDeBusca from '../../produtos/componentes/BarraDeBusca';
import CabecalhoListaClientes from '../componentes/CabecalhoListaClientes';
import CabecalhoContextualAcoes from '../../produtos/componentes/CabecalhoContextualAcoes';
import ModalSelecao from '../../../componentes/ModalSelecao';
import FiltrosModalClientes from '../componentes/FiltrosModalClientes';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const CabecalhoTabela = () => (
    <View style={styles.cabecalhoTabela}>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Código</Text>
      <Text style={[styles.textoCabecalho, {width: 200}]}>Nome / Fantasia</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>CPF / CNPJ</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>Telefone</Text>
      <Text style={[styles.textoCabecalho, {width: 200}]}>Cidade - UF</Text>
      <Text style={[styles.textoCabecalho, {width: 100}]}>Status</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Cliente Desde</Text>
    </View>
);

const ListaClientesTela = ({ navigation }) => {
  const hook = useListaClientes();

  useFocusEffect(
    React.useCallback(() => {
      hook.recarregar();
    }, [])
  );

  const lidarComEditar = (cliente) => {
    navigation.navigate('CadastroCliente', { clienteParaEditar: cliente });
  };

  const lidarInativar = () => {
    Alert.alert(
      `Inativar ${hook.itensSelecionados.length} cliente(s)`,
      "Esta ação não pode ser desfeita diretamente. Deseja continuar?",
      [
        { text: "Cancelar" },
        { text: "Inativar", onPress: hook.lidarInativarSelecionados, style: 'destructive' }
      ]
    );
  };

  const opcoesOrdenacao = [
    { id: 'nome_asc', nome: 'Nome (A-Z)', campo: 'nomeCompleto', direcao: 'asc' },
    { id: 'nome_desc', nome: 'Nome (Z-A)', campo: 'nomeCompleto', direcao: 'desc' },
  ];

  const aplicarFiltros = (novosFiltros) => {
    hook.setFiltrosAtivos(novosFiltros);
    hook.setFiltrosModalVisivel(false);
  };

  const renderItem = ({ item, index }) => {
    const isSelecionado = hook.itensSelecionados.includes(item.id);
    const handlePress = () => {
      if (hook.selectionModeAtivo) hook.toggleSelecao(item.id);
    };
    const handleLongPress = () => !hook.selectionModeAtivo && hook.iniciarModoSelecao(item.id);
    
    // O render item é o mesmo para FlatList de card e de tabela
    if (hook.modoVisualizacao === 'card') {
      return (
        <CardCliente
          cliente={item}
          isSelecionado={isSelecionado}
          selectionModeAtivo={hook.selectionModeAtivo}
          aoPressionar={handlePress}
          aoPressionarLongo={handleLongPress}
        />
      );
    }
    
    return (
      <LinhaTabelaCliente
        cliente={item}
        isSelecionado={isSelecionado}
        selectionModeAtivo={hook.selectionModeAtivo}
        onPress={handlePress}
        onLongPress={handleLongPress}
        isZebrada={index % 2 !== 0}
      />
    );
  };

  if (hook.carregando) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  }

  const renderFooter = () => {
    if (!hook.carregandoMais) return null;
    return <View style={{ paddingVertical: 20 }}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  };
  
  const TabelaCompleta = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <CabecalhoTabela />
        <FlatList
            data={hook.clientes}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} enabled={false} />}
            extraData={{itens: hook.itensSelecionados}}
            onEndReached={hook.carregarMaisClientes}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <BarraDeBusca valor={hook.termoBusca} aoMudarTexto={hook.setTermoBusca} placeholder="Buscar por nome, CPF ou CNPJ..." />

      {hook.selectionModeAtivo ? (
        <CabecalhoContextualAcoes
          totalSelecionado={hook.itensSelecionados.length}
          onLimparSelecao={hook.limparSelecao}
          onSelecionarTodos={hook.selecionarTodos}
          onExcluir={lidarInativar}
          onEditar={() => {
            if (hook.itensSelecionados.length === 1) {
              const clienteSelecionado = hook.clientes.find(c => c.id === hook.itensSelecionados[0]);
              hook.limparSelecao();
              lidarComEditar(clienteSelecionado);
            }
          }}
        />
      ) : (
        <CabecalhoListaClientes
          totalItens={hook.totalClientes}
          setFiltrosModalVisivel={hook.setFiltrosModalVisivel}
          setOrdenacaoModalVisivel={hook.setOrdenacaoModalVisivel}
          isFiltroAtivo={hook.isFiltroAtivo}
          modoVisualizacao={hook.modoVisualizacao}
          setModoVisualizacao={hook.setModoVisualizacao}
        />
      )}
      
      {hook.clientes.length === 0 ? (
        <EstadoVazio
            icone={hook.termoBusca || hook.isFiltroAtivo ? "search" : "users"}
            titulo={hook.termoBusca || hook.isFiltroAtivo ? "Nenhum Cliente Encontrado" : "Nenhum Cliente Cadastrado"}
            subtitulo={hook.termoBusca || hook.isFiltroAtivo ? "Tente ajustar sua busca ou filtros para encontrar o que procura." : "Clique no botão abaixo para adicionar seu primeiro cliente!"}
            textoBotao={hook.termoBusca || hook.isFiltroAtivo ? "Limpar Filtros" : "Cadastrar Novo Cliente"}
            onPressBotao={() => {
                if (hook.termoBusca || hook.isFiltroAtivo) {
                hook.setFiltrosAtivos({ status: 'Ativo' });
                hook.setTermoBusca('');
                } else {
                navigation.navigate('CadastroCliente');
                }
            }}
        />
      ) : hook.modoVisualizacao === 'card' ? (
        <FlatList
          data={hook.clientes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listaCard}
          refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} />}
          extraData={{ itens: hook.itensSelecionados }}
          onEndReached={hook.carregarMaisClientes}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <TabelaCompleta />
      )}
      
      <FiltrosModalClientes
        visivel={hook.filtrosModalVisivel}
        aoFechar={() => hook.setFiltrosModalVisivel(false)}
        aoAplicar={aplicarFiltros}
        filtrosIniciais={hook.filtrosAtivos}
      />

      <ModalSelecao
        visivel={hook.ordenacaoModalVisivel}
        titulo="Ordenar Por"
        dados={opcoesOrdenacao}
        aoFechar={() => hook.setOrdenacaoModalVisivel(false)}
        aoSelecionarItem={(ordem) => {
          hook.setOrdenacao({ campo: ordem.campo, direcao: ordem.direcao });
          hook.setOrdenacaoModalVisivel(false);
        }}
        desabilitarCriacao
        desabilitarExclusao
        desabilitarBusca
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listaCard: { flexGrow: 1, padding: tema.espacamento.medio, },
  cabecalhoTabela: {
    flexDirection: 'row',
    paddingVertical: tema.espacamento.pequeno,
    paddingHorizontal: 8,
    backgroundColor: '#E9ECEF',
    borderBottomWidth: 2,
    borderBottomColor: '#DEE2E6',
  },
  textoCabecalho: { fontWeight: 'bold', fontSize: 13, color: '#495057', paddingHorizontal: tema.espacamento.pequeno },
});

export default ListaClientesTela;
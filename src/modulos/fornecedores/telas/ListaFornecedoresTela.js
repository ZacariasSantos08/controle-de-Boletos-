import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, RefreshControl, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useListaFornecedores } from '../hooks/useListaFornecedores';
import CardFornecedor from '../componentes/CardFornecedor';
import LinhaTabelaFornecedor from '../componentes/LInhaTabelaFornecedor';
import BarraDeBusca from '../../produtos/componentes/BarraDeBusca';
import CabecalhoContextualAcoes from '../../produtos/componentes/CabecalhoContextualAcoes';
import CabecalhoListaFornecedores from '../componentes/CabecalhoListaFornecedores';
import FiltrosModalFornecedores from '../componentes/FiltrosModalFornecedores';
import ModalSelecao from '../../../componentes/ModalSelecao';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const CabecalhoTabela = () => (
    <View style={styles.cabecalhoTabela}>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Código</Text>
        <Text style={[styles.textoCabecalho, {width: 200}]}>Nome / Fantasia</Text>
        <Text style={[styles.textoCabecalho, {width: 150}]}>CPF / CNPJ</Text>
        <Text style={[styles.textoCabecalho, {width: 150}]}>Contato Principal</Text>
        <Text style={[styles.textoCabecalho, {width: 200}]}>Cidade - UF</Text>
        <Text style={[styles.textoCabecalho, {width: 100}]}>Status</Text>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Criado em</Text>
    </View>
);

const ListaFornecedoresTela = ({ navigation }) => {
  const hook = useListaFornecedores();

  useFocusEffect(
    React.useCallback(() => {
      hook.recarregar();
    }, [])
  );

  const lidarComEditar = (fornecedor) => {
    navigation.navigate('CadastroFornecedor', { fornecedorParaEditar: fornecedor });
  };

  const lidarInativar = () => {
    Alert.alert(`Inativar ${hook.itensSelecionados.length} fornecedor(es)`, "Deseja continuar?",
      [ { text: "Cancelar" }, { text: "Inativar", onPress: hook.lidarInativarSelecionados, style: 'destructive' } ]);
  };

  const aplicarFiltros = (novosFiltros) => {
    hook.setFiltrosAtivos(novosFiltros);
    hook.setFiltrosModalVisivel(false);
  };

  const opcoesOrdenacao = [
    { id: 'razaoSocial_asc', nome: 'Razão Social (A-Z)', campo: 'razaoSocial', direcao: 'asc' },
    { id: 'razaoSocial_desc', nome: 'Razão Social (Z-A)', campo: 'razaoSocial', direcao: 'desc' },
  ];

  const renderItem = ({ item, index }) => {
    const isSelecionado = hook.itensSelecionados.includes(item.id);
    const handlePress = () => {
      if (hook.selectionModeAtivo) hook.toggleSelecao(item.id);
    };
    const handleLongPress = () => !hook.selectionModeAtivo && hook.iniciarModoSelecao(item.id);

    if (hook.modoVisualizacao === 'card') {
        return (
            <CardFornecedor
                fornecedor={item}
                aoPressionar={handlePress}
                aoPressionarLongo={handleLongPress}
                isSelecionado={isSelecionado}
                selectionModeAtivo={hook.selectionModeAtivo}
            />
        );
    }

    return (
        <LinhaTabelaFornecedor
            fornecedor={item}
            onPress={handlePress}
            onLongPress={handleLongPress}
            isSelecionado={isSelecionado}
            selectionModeAtivo={hook.selectionModeAtivo}
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
            data={hook.fornecedores}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} enabled={false} />}
            extraData={{itens: hook.itensSelecionados}}
            onEndReached={hook.carregarMaisFornecedores}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <BarraDeBusca
        valor={hook.termoBusca}
        aoMudarTexto={(text) => hook.setTermoBusca(text)}
        placeholder="Buscar por nome ou CNPJ..."
        onEndEditing={() => hook.buscarEFiltrar(1, true)}
      />
      
      {hook.selectionModeAtivo ? (
        <CabecalhoContextualAcoes
            totalSelecionado={hook.itensSelecionados.length}
            onLimparSelecao={hook.limparSelecao}
            onSelecionarTodos={hook.selecionarTodos}
            onExcluir={lidarInativar}
            onEditar={() => {
                if (hook.itensSelecionados.length === 1) {
                    const selecionado = hook.fornecedores.find(f => f.id === hook.itensSelecionados[0]);
                    hook.limparSelecao();
                    lidarComEditar(selecionado);
                }
            }}
        />
      ) : (
        <CabecalhoListaFornecedores
          totalItens={hook.totalFornecedores}
          setFiltrosModalVisivel={hook.setFiltrosModalVisivel}
          setOrdenacaoModalVisivel={hook.setOrdenacaoModalVisivel}
          isFiltroAtivo={hook.isFiltroAtivo}
          modoVisualizacao={hook.modoVisualizacao}
          setModoVisualizacao={hook.setModoVisualizacao}
        />
      )}

      {hook.fornecedores.length === 0 ? (
        <EstadoVazio
          icone={hook.termoBusca || hook.isFiltroAtivo ? "search" : "truck"}
          titulo={hook.termoBusca || hook.isFiltroAtivo ? "Nenhum Fornecedor Encontrado" : "Nenhum Fornecedor Cadastrado"}
          subtitulo={hook.termoBusca || hook.isFiltroAtivo ? "Tente ajustar sua busca ou filtros." : "Clique no botão abaixo para adicionar seu primeiro fornecedor!"}
          textoBotao={hook.termoBusca || hook.isFiltroAtivo ? "Limpar Filtros" : "Cadastrar Novo Fornecedor"}
          onPressBotao={() => {
            if (hook.termoBusca || hook.isFiltroAtivo) {
              hook.setFiltrosAtivos({ status: 'Ativo' });
              hook.setTermoBusca('');
              hook.buscarEFiltrar(1, true);
            } else {
              navigation.navigate('CadastroFornecedor');
            }
          }}
        />
      ) : hook.modoVisualizacao === 'card' ? (
        <FlatList
          data={hook.fornecedores}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listaCard}
          refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} />}
          extraData={{itens: hook.itensSelecionados}}
          onEndReached={hook.carregarMaisFornecedores}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <TabelaCompleta />
      )}

      <FiltrosModalFornecedores
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
        desabilitarCriacao desabilitarExclusao desabilitarBusca
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tema.espacamento.grande },
    listaCard: { flexGrow: 1, padding: tema.espacamento.medio, paddingTop: 0 },
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

export default ListaFornecedoresTela;
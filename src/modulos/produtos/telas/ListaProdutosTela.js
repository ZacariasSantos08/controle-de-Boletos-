import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, Alert, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useListaProdutos } from '../hooks/useListaProdutos';
import CardProduto from '../componentes/CardProduto';
import LinhaTabelaProduto from '../componentes/LinhaTabelaProduto';
import BarraDeBusca from '../componentes/BarraDeBusca';
import CabecalhoLista from '../componentes/CabecalhoLista';
import CabecalhoContextualAcoes from '../componentes/CabecalhoContextualAcoes';
import FiltrosModal from '../componentes/FiltrosModal';
import ModalSelecao from '../../../componentes/ModalSelecao';
import SalvarFiltroModal from '../componentes/SalvarFiltroModal';
import CarregarFiltroModal from '../componentes/CarregarFiltroModal';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const CabecalhoTabela = () => (
    <View style={styles.cabecalhoTabela}>
      <Text style={[styles.textoCabecalho, {width: 60, paddingHorizontal: 4}]}>Img</Text>
      <Text style={[styles.textoCabecalho, {width: 200}]}>Nome</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Código</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>Cód. Barras</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>Categoria</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>Marca</Text>
      <Text style={[styles.textoCabecalho, {width: 150}]}>Fornecedor</Text>
      <Text style={[styles.textoCabecalho, {width: 80}]}>Est. Disp.</Text>
      <Text style={[styles.textoCabecalho, {width: 80}]}>Est. Mín.</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Vl. Custo</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Vl. Venda</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Criado em</Text>
      <Text style={[styles.textoCabecalho, {width: 120}]}>Atualizado</Text>
    </View>
);

const ListaProdutosTela = () => {
  const navigation = useNavigation();
  const hook = useListaProdutos();

  // CORREÇÃO: A lógica async foi movida para dentro do useCallback
  useFocusEffect(
    React.useCallback(() => {
      async function carregarDados() {
        await hook.recarregar();
      }
      carregarDados();
    }, []) // O hook.recarregar foi removido das dependências para evitar loops indesejados
  );

  const lidarComEditar = (produto) => {
    navigation.navigate('CadastroProduto', { produtoParaEditar: produto });
  };

  const lidarInativar = () => {
    Alert.alert(
      `Inativar ${hook.itensSelecionados.length} produto(s)`,
      "Esta ação não pode ser desfeita diretamente. Deseja continuar?",
      [
        { text: "Cancelar" },
        { text: "Inativar", onPress: hook.lidarInativarSelecionados, style: 'destructive' }
      ]
    );
  };
  
  const aplicarFiltros = (novosFiltros) => {
    hook.setFiltrosAtivos(novosFiltros);
    hook.setFiltrosModalVisivel(false);
  };

  const opcoesOrdenacao = [
    { id: 'nome_asc', nome: 'Nome (A-Z)', campo: 'nome', direcao: 'asc' },
    { id: 'nome_desc', nome: 'Nome (Z-A)', campo: 'nome', direcao: 'desc' },
  ];

  const renderItem = ({ item, index }) => {
    const isSelecionado = hook.itensSelecionados.includes(item.id);
    const handlePress = () => {
      if (hook.selectionModeAtivo) hook.toggleSelecao(item.id);
    };
    const handleLongPress = () => !hook.selectionModeAtivo && hook.iniciarModoSelecao(item.id);

    if (hook.modoVisualizacao === 'card') {
      return (
        <CardProduto
          produto={item}
          isSelecionado={isSelecionado}
          selectionModeAtivo={hook.selectionModeAtivo}
          onPress={handlePress}
          onLongPress={handleLongPress}
        />
      );
    }
    return (
      <LinhaTabelaProduto
        produto={item}
        isSelecionado={isSelecionado}
        selectionModeAtivo={hook.selectionModeAtivo}
        onPress={handlePress}
        onLongPress={handleLongPress}
        isZebrada={index % 2 !== 0}
      />
    );
  };

  if (hook.carregando) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>
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
            data={hook.produtos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} enabled={false} />}
            extraData={{itens: hook.itensSelecionados}}
            onEndReached={hook.carregarMaisProdutos}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <BarraDeBusca valor={hook.termoBusca} aoMudarTexto={hook.setTermoBusca} placeholder="Buscar por nome ou codigo..."/>

      {hook.selectionModeAtivo ? (
        <CabecalhoContextualAcoes
            totalSelecionado={hook.itensSelecionados.length}
            onLimparSelecao={hook.limparSelecao}
            onSelecionarTodos={hook.selecionarTodos}
            onExcluir={lidarInativar}
            onEditar={() => {
                if (hook.itensSelecionados.length === 1) {
                    const produtoSelecionado = hook.produtos.find(p => p.id === hook.itensSelecionados[0]);
                    hook.limparSelecao();
                    lidarComEditar(produtoSelecionado);
                }
            }}
        />
      ) : (
        <CabecalhoLista {...hook} totalItens={hook.totalProdutos} />
      )}
      
      {hook.produtos.length === 0 ? (
        <EstadoVazio
            icone={hook.termoBusca || hook.isFiltroAtivo ? "search" : "package"}
            titulo={hook.termoBusca || hook.isFiltroAtivo ? "Nenhum Produto Encontrado" : "Nenhum Produto Cadastrado"}
            subtitulo={hook.termoBusca || hook.isFiltroAtivo ? "Tente ajustar sua busca ou filtros." : "Clique no botão abaixo para adicionar seu primeiro produto!"}
            textoBotao={hook.termoBusca || hook.isFiltroAtivo ? "Limpar Filtros" : "Cadastrar Novo Produto"}
            onPressBotao={() => {
                if (hook.termoBusca || hook.isFiltroAtivo) {
                hook.setFiltrosAtivos({ status: 'Ativo' });
                hook.setTermoBusca('');
                } else {
                navigation.navigate('CadastroProduto');
                }
            }}
        />
      ) : hook.modoVisualizacao === 'card' ? (
        <FlatList
          data={hook.produtos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listaCard}
          refreshControl={<RefreshControl refreshing={hook.atualizando} onRefresh={hook.onAtualizar} />}
          extraData={{itens: hook.itensSelecionados}}
          onEndReached={hook.carregarMaisProdutos}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      ) : (
        <TabelaCompleta />
      )}

      <FiltrosModal visivel={hook.filtrosModalVisivel} aoFechar={() => hook.setFiltrosModalVisivel(false)} aoAplicar={aplicarFiltros} filtrosIniciais={hook.filtrosAtivos} listasDeFiltro={{ abrirModal: (tipo) => { hook.setFiltrosModalVisivel(false); hook.setModalAtributoVisivel({ visivel: true, tipo }); } }} contagemResultados={hook.totalProdutos} onSalvarFiltro={() => { hook.setFiltrosModalVisivel(false); hook.setSalvarFiltroModalVisivel(true); }} atualizacaoEmTempoReal={hook.atualizacaoEmTempoReal} onMudarAtualizacaoTempoReal={hook.setAtualizacaoEmTempoReal} />
      <ModalSelecao visivel={hook.modalAtributoVisivel.visivel} titulo={`Selecionar ${hook.modalAtributoVisivel.tipo?.slice(0, -1)}(s)`} dados={hook.listasParaFiltro[hook.modalAtributoVisivel.tipo]} aoFechar={() => { hook.setModalAtributoVisivel({ visivel: false, tipo: ''}); hook.setFiltrosModalVisivel(true); }} selecaoMultipla={true} itensSelecionados={hook.filtrosAtivos.categorias || []} aoConfirmarSelecaoMultipla={(itens) => { hook.setFiltrosAtivos(prev => ({...prev, categorias: itens })); hook.setModalAtributoVisivel({ visivel: false, tipo: ''}); hook.setFiltrosModalVisivel(true); }} desabilitarCriacao desabilitarExclusao />
      <ModalSelecao visivel={hook.ordenacaoModalVisivel} titulo="Ordenar Por" dados={opcoesOrdenacao} aoFechar={() => hook.setOrdenacaoModalVisivel(false)} aoSelecionarItem={(ordem) => { hook.setOrdenacao({ campo: ordem.campo, direcao: ordem.direcao }); hook.setOrdenacaoModalVisivel(false); }} desabilitarCriacao desabilitarExclusao desabilitarBusca />
      <SalvarFiltroModal visivel={hook.salvarFiltroModalVisivel} aoFechar={() => hook.setSalvarFiltroModalVisivel(false)} aoSalvar={hook.salvarFiltroAtual} />
      <CarregarFiltroModal visivel={hook.carregarFiltroModalVisivel} aoFechar={() => hook.setCarregarFiltroModalVisivel(false)} filtrosSalvos={hook.filtrosSalvos} onCarregarFiltro={hook.carregarFiltro} onExcluirFiltro={hook.excluirFiltro} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: tema.espacamento.grande },
  listaCard: { flexGrow: 1, paddingTop: tema.espacamento.medio, paddingHorizontal: tema.espacamento.medio, paddingBottom: tema.espacamento.medio, },
  cabecalhoTabela: { flexDirection: 'row', paddingVertical: tema.espacamento.pequeno, paddingHorizontal: 8, backgroundColor: '#E9ECEF', borderBottomWidth: 2, borderBottomColor: '#DEE2E6', },
  textoCabecalho: { fontWeight: 'bold', fontSize: 13, color: '#495057', paddingHorizontal: tema.espacamento.pequeno },
});

export default ListaProdutosTela;
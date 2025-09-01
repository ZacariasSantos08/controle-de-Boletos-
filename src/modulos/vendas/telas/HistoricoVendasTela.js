import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useHistoricoVendas } from '../hooks/useHistoricoVendas';
import CardVenda from '../componentes/CardVenda';
import LinhaTabelaVenda from '../componentes/LinhaTabelaVenda';
import BarraDeBusca from '../../produtos/componentes/BarraDeBusca';
import CabecalhoListaVendas from '../componentes/CabecalhoListaVendas';
import FiltrosModalVendas from '../componentes/FiltrosModalVendas';
import ModalSelecao from '../../../componentes/ModalSelecao';
import EstadoVazio from '../../../componentes/EstadoVazio';
import tema from '../../../estilos/tema';

const FORMAS_PAGAMENTO = [
    { id: 'Dinheiro', nome: 'Dinheiro' },
    { id: 'Cartão de Crédito', nome: 'Cartão de Crédito' },
    { id: 'Cartão de Débito', nome: 'Cartão de Débito' },
    { id: 'Pix', nome: 'Pix' },
    { id: 'A Prazo (Promissória)', nome: 'A Prazo (Promissória)' },
];

const CabecalhoTabela = () => (
    <View style={styles.cabecalhoTabela}>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Código</Text>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Data</Text>
        <Text style={[styles.textoCabecalho, {width: 200}]}>Cliente</Text>
        <Text style={[styles.textoCabecalho, {width: 80}]}>Itens</Text>
        <Text style={[styles.textoCabecalho, {width: 150}]}>Pagamento</Text>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Subtotal</Text>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Desconto</Text>
        <Text style={[styles.textoCabecalho, {width: 120}]}>Total</Text>
        <Text style={[styles.textoCabecalho, {width: 100}]}>Status</Text>
    </View>
);

const HistoricoVendasTela = ({ navigation }) => {
  const hook = useHistoricoVendas();
  
  const [filtrosModalVisivel, setFiltrosModalVisivel] = useState(false);
  const [ordenacaoModalVisivel, setOrdenacaoModalVisivel] = useState(false);
  const [modalDeSelecao, setModalDeSelecao] = useState({ visivel: false, tipo: '', dados: [] });

  useFocusEffect(
    React.useCallback(() => {
      hook.recarregar();
    }, [])
  );
  
  const opcoesOrdenacao = [
    { id: 'data_desc', nome: 'Mais Recentes', campo: 'dataEmissao', direcao: 'desc' },
    { id: 'data_asc', nome: 'Mais Antigas', campo: 'dataEmissao', direcao: 'asc' },
    { id: 'valor_desc', nome: 'Maior Valor', campo: 'valorTotalVenda', direcao: 'desc' },
    { id: 'valor_asc', nome: 'Menor Valor', campo: 'valorTotalVenda', direcao: 'asc' },
  ];

  const abrirModalDeSelecao = (tipo) => {
    const dadosPorTipo = {
      clientes: hook.listasParaFiltro.clientes,
      produtos: hook.listasParaFiltro.produtos,
      fornecedores: hook.listasParaFiltro.fornecedores,
      tipoPagamento: FORMAS_PAGAMENTO,
    };
    setFiltrosModalVisivel(false);
    setModalDeSelecao({ visivel: true, tipo, dados: dadosPorTipo[tipo] });
  };
  
  const onSelecionarItemFiltro = (item) => {
    const chave = modalDeSelecao.tipo.slice(0, -1);
    hook.setFiltrosAtivos(prev => ({...prev, [chave]: item}));
    setModalDeSelecao({ visivel: false, tipo: '', dados: [] });
    setFiltrosModalVisivel(true);
  };

  const renderItem = ({ item, index }) => {
    if (hook.modoVisualizacao === 'card') {
      return (
        <CardVenda
          venda={item}
          aoPressionar={() => navigation.navigate('DetalhesVenda', { vendaId: item.id })}
        />
      );
    }
    return (
      <LinhaTabelaVenda
        venda={item}
        onPress={() => navigation.navigate('DetalhesVenda', { vendaId: item.id })}
        isZebrada={index % 2 !== 0}
      />
    );
  };

  const TabelaCompleta = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
      <View>
        <CabecalhoTabela />
        <FlatList
          data={hook.vendas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 50 }}
          extraData={hook.modoVisualizacao}
        />
      </View>
    </ScrollView>
  );

  if (hook.carregando) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  }

  return (
    <View style={styles.container}>
      <BarraDeBusca
        valor={hook.termoBusca}
        aoMudarTexto={hook.setTermoBusca}
        placeholder="Buscar por cód. da venda ou cliente..."
      />
      <CabecalhoListaVendas 
        totalItens={hook.vendas.length}
        isFiltroAtivo={hook.isFiltroAtivo}
        setFiltrosModalVisivel={setFiltrosModalVisivel}
        setOrdenacaoModalVisivel={setOrdenacaoModalVisivel}
        modoVisualizacao={hook.modoVisualizacao}
        setModoVisualizacao={hook.setModoVisualizacao}
      />
      
      {hook.vendas.length === 0 ? (
        <EstadoVazio
            icone={hook.termoBusca || hook.isFiltroAtivo ? "search" : "shopping-cart"}
            titulo={hook.termoBusca || hook.isFiltroAtivo ? "Nenhuma Venda Encontrada" : "Nenhuma Venda Realizada"}
            subtitulo={hook.termoBusca || hook.isFiltroAtivo ? "Tente ajustar sua busca ou filtros." : "Clique no botão abaixo para registrar sua primeira venda!"}
            textoBotao={hook.termoBusca || hook.isFiltroAtivo ? "Limpar Filtros" : "Realizar Nova Venda"}
            onPressBotao={() => {
            if (hook.termoBusca || hook.isFiltroAtivo) {
                hook.setFiltrosAtivos({});
                hook.setTermoBusca('');
            } else {
                navigation.navigate('Pdv');
            }
            }}
        />
      ) : hook.modoVisualizacao === 'card' ? (
        <FlatList
          data={hook.vendas}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listaCard}
          extraData={hook.modoVisualizacao}
        />
      ) : (
        <TabelaCompleta />
      )}
      
      <FiltrosModalVendas
        visivel={filtrosModalVisivel}
        aoFechar={() => setFiltrosModalVisivel(false)}
        aoAplicar={(novosFiltros) => {
            hook.setFiltrosAtivos(novosFiltros);
            setFiltrosModalVisivel(false);
        }}
        filtrosIniciais={hook.filtrosAtivos}
        abrirModalDeSelecao={abrirModalDeSelecao}
      />

      <ModalSelecao
        visivel={modalDeSelecao.visivel}
        titulo={`Selecionar ${modalDeSelecao.tipo.slice(0,-1)}`}
        dados={modalDeSelecao.dados}
        renderItemNome={(item) => item.nome || (item.nomeFantasia || item.razaoSocial)}
        aoFechar={() => {
            setModalDeSelecao({ visivel: false, tipo: '', dados: [] });
            setFiltrosModalVisivel(true);
        }}
        aoSelecionarItem={onSelecionarItemFiltro}
        desabilitarCriacao desabilitarExclusao
      />
      
      <ModalSelecao
        visivel={ordenacaoModalVisivel}
        titulo="Ordenar Vendas Por"
        dados={opcoesOrdenacao}
        aoFechar={() => setOrdenacaoModalVisivel(false)}
        aoSelecionarItem={(ordem) => {
            hook.setOrdenacao({ campo: ordem.campo, direcao: ordem.direcao });
            setOrdenacaoModalVisivel(false);
        }}
        desabilitarBusca desabilitarCriacao desabilitarExclusao
      />
    </View>
  );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listaCard: { flexGrow: 1, padding: tema.espacamento.medio },
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
export default HistoricoVendasTela;
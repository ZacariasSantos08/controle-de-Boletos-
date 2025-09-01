import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Button, SafeAreaView, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { buscarTodosClientes } from '../../../api/clientes.api';
import { buscarTodosProdutos } from '../../../api/produtos.api';
import ItemCarrinho from '../componentes/ItemCarrinho';
import EditarItemCarrinhoModal from '../componentes/EditarItemCarrinhoModal';
import ModalSelecao from '../../../componentes/ModalSelecao';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const PdvTela = ({ navigation, route }) => {
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [modalClientesVisivel, setModalClientesVisivel] = useState(false);
  const [modalProdutosVisivel, setModalProdutosVisivel] = useState(false);
  const [listaClientes, setListaClientes] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [buscaCliente, setBuscaCliente] = useState('');
  const [buscaProduto, setBuscaProduto] = useState('');
  const [itemParaEditar, setItemParaEditar] = useState(null);

  const carregarDados = async () => {
    setListaClientes((await buscarTodosClientes()).filter(c => c.status === 'Ativo'));
    setListaProdutos((await buscarTodosProdutos()).filter(p => p.status === 'Ativo'));
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params?.clienteSelecionado) {
        setClienteSelecionado(route.params.clienteSelecionado);
        navigation.setParams({ clienteSelecionado: null });
      }
    }, [route.params?.clienteSelecionado])
  );

  useFocusEffect(
    useCallback(() => {
      carregarDados();
    }, [])
  );

  const clientesFiltrados = useMemo(() => {
    const termoBusca = buscaCliente.toLowerCase();
    if (!termoBusca) return listaClientes;
    return listaClientes.filter(cliente => {
      const nome = cliente.tipoPessoa === 'Fisica' 
        ? (cliente.detalhesPessoaFisica?.nomeCompleto || '')
        : (cliente.detalhesPessoaJuridica?.nomeFantasia || cliente.detalhesPessoaJuridica?.razaoSocial || '');
      return nome.toLowerCase().includes(termoBusca);
    });
  }, [buscaCliente, listaClientes]);

  const produtosFiltrados = useMemo(() => {
    const termoBusca = buscaProduto.toLowerCase();
    if (!termoBusca) return listaProdutos;
    return listaProdutos.filter(produto => 
      produto.nome.toLowerCase().includes(termoBusca) || 
      produto.codigoProduto?.toLowerCase().includes(termoBusca)
    );
  }, [buscaProduto, listaProdutos]);

  const lidarSelecionarCliente = (cliente) => {
    setClienteSelecionado(cliente);
    setModalClientesVisivel(false);
    setBuscaCliente('');
  };

  const lidarAdicionarProduto = (produto) => {
    if(!produto.estoqueDisponivel || produto.estoqueDisponivel <= 0){
        Alert.alert("Produto sem estoque", "Este produto não pode ser adicionado pois não há estoque disponível.");
        return;
    }
    setCarrinho(carrinhoAtual => {
      const itemExistente = carrinhoAtual.find(item => item.id === produto.id);
      if (itemExistente) {
        if(itemExistente.quantidade < produto.estoqueDisponivel){
            return carrinhoAtual.map(item =>
                item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
            );
        } else {
            Alert.alert("Estoque máximo atingido", `Você já adicionou a quantidade máxima em estoque (${produto.estoqueDisponivel}) para este item.`);
            return carrinhoAtual;
        }
      }
      return [...carrinhoAtual, { ...produto, quantidade: 1, tipoDesconto: 'R$', valorDesconto: 0, valorDescontoFormatado: '' }];
    });
    setModalProdutosVisivel(false);
    setBuscaProduto('');
  };

  const lidarAtualizarItem = (itemAtualizado) => {
    setCarrinho(carrinhoAtual =>
      carrinhoAtual.map(item =>
        item.id === itemAtualizado.id ? itemAtualizado : item
      )
    );
  };
  
  const lidarRemoverItem = (produtoId) => {
    setCarrinho(carrinhoAtual => carrinhoAtual.filter(item => item.id !== produtoId));
  };
  
  const totalCarrinho = useMemo(() => {
    return carrinho.reduce((total, item) => {
      const subtotal = item.valorVenda * item.quantidade;
      const descontoFinal = item.tipoDesconto === 'R$' 
        ? (item.valorDesconto || 0)
        : subtotal * ((item.valorDesconto || 0) / 100);
      return total + (subtotal - descontoFinal);
    }, 0);
  }, [carrinho]);

  const renderizarItemCliente = (item) => {
    const nome = item.tipoPessoa === 'Fisica' 
      ? item.detalhesPessoaFisica?.nomeCompleto
      : (item.detalhesPessoaJuridica?.nomeFantasia || item.detalhesPessoaJuridica?.razaoSocial);
    return nome;
  };

  const renderizarItemProduto = (item) => {
    return `${item.nome}\n${formatarMoeda(item.valorVenda * 100)} | Estoque: ${item.estoqueDisponivel}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Cliente</Text>
        <TouchableOpacity style={styles.seletor} onPress={() => setModalClientesVisivel(true)}>
          <Text style={styles.seletorTexto} numberOfLines={1}>
            {clienteSelecionado 
              ? renderizarItemCliente(clienteSelecionado)
              : 'Selecionar cliente *'}
          </Text>
          <Feather name="user-check" size={24} color={clienteSelecionado ? tema.cores.verde : tema.cores.primaria} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.secao, styles.secaoCarrinho]}>
        <View style={styles.headerCarrinho}>
          <Text style={styles.tituloSecao}>Carrinho</Text>
          <TouchableOpacity style={styles.botaoAddProduto} onPress={() => setModalProdutosVisivel(true)}>
            <Feather name="plus" size={20} color={tema.cores.branco} />
            <Text style={styles.botaoAddProdutoTexto}>Adicionar Produto</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={carrinho}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ItemCarrinho 
              item={item} 
              aoPressionar={() => setItemParaEditar(item)}
              aoRemover={() => lidarRemoverItem(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.carrinhoVazio}>O carrinho está vazio.</Text>}
          contentContainerStyle={{ paddingHorizontal: tema.espacamento.medio }}
        />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.linhaResumo}>
          <Text style={styles.resumoLabel}>Subtotal</Text>
          <Text style={styles.resumoValor}>{formatarMoeda(totalCarrinho * 100)}</Text>
        </View>
        <Button 
          title="Finalizar Venda" 
          onPress={() => navigation.navigate('FinalizarVenda', {
            cliente: clienteSelecionado,
            carrinho: carrinho,
            total: totalCarrinho,
          })} 
          color={tema.cores.verde} 
          disabled={carrinho.length === 0 || !clienteSelecionado}
        />
      </View>

      <ModalSelecao
        visivel={modalClientesVisivel}
        titulo="Selecionar Cliente"
        dados={clientesFiltrados}
        aoFechar={() => setModalClientesVisivel(false)}
        aoSelecionarItem={lidarSelecionarCliente}
        renderItemNome={renderizarItemCliente}
        buscaValor={buscaCliente}
        aoMudarBusca={setBuscaCliente}
        placeholderBusca="Buscar por nome..."
        desabilitarCriacao={false}
        aoAdicionarNovo={() => {
            setModalClientesVisivel(false);
            navigation.navigate('Clientes', {
                screen: 'CadastroCliente',
                params: { origin: 'PdvTela' }
            });
        }}
      />

      <ModalSelecao
        visivel={modalProdutosVisivel}
        titulo="Adicionar Produto"
        dados={produtosFiltrados}
        aoFechar={() => setModalProdutosVisivel(false)}
        aoSelecionarItem={lidarAdicionarProduto}
        renderItemNome={renderizarItemProduto}
        buscaValor={buscaProduto}
        aoMudarBusca={setBuscaProduto}
        placeholderBusca="Buscar por nome ou código..."
        desabilitarCriacao={true}
      />

      <EditarItemCarrinhoModal
        visivel={!!itemParaEditar}
        aoFechar={() => setItemParaEditar(null)}
        item={itemParaEditar}
        onConfirmar={lidarAtualizarItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  secao: { paddingBottom: tema.espacamento.medio, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  secaoCarrinho: { flex: 1, borderBottomWidth: 0 },
  tituloSecao: { fontSize: 18, fontWeight: 'bold', color: tema.cores.preto, marginBottom: tema.espacamento.pequeno, paddingHorizontal: tema.espacamento.medio, paddingTop: tema.espacamento.medio },
  seletor: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: tema.cores.branco, padding: tema.espacamento.medio, marginHorizontal: tema.espacamento.medio, borderRadius: 8, borderWidth: 1, borderColor: '#EEE' },
  seletorTexto: { flex: 1, fontSize: tema.fontes.tamanhoMedio, marginRight: tema.espacamento.pequeno },
  headerCarrinho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tema.espacamento.pequeno },
  botaoAddProduto: { flexDirection: 'row', backgroundColor: tema.cores.primaria, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', marginRight: tema.espacamento.medio },
  botaoAddProdutoTexto: { color: tema.cores.branco, fontWeight: 'bold', marginLeft: 8 },
  carrinhoVazio: { textAlign: 'center', color: tema.cores.cinza, marginTop: 50 },
  footer: { padding: tema.espacamento.medio, borderTopWidth: 1, borderColor: '#DDD', backgroundColor: tema.cores.branco },
  linhaResumo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: tema.espacamento.medio },
  resumoLabel: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.cinza },
  resumoValor: { fontSize: tema.fontes.tamanhoGrande, fontWeight: 'bold', color: tema.cores.preto },
});

export default PdvTela;
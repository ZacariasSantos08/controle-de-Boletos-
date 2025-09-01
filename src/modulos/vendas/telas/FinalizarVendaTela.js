import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import Toast from 'react-native-toast-message';
import ResumoFinanceiroCard from '../componentes/ResumoFinanceiroCard';
import DetalhesAdicionaisCard from '../componentes/DetalhesAdicionaisCard';
import PagamentosMultiplosCard from '../componentes/PagamentosMultiplosCard';
import AdicionarPagamentoModal from '../componentes/AdicionarPagamentoModal';
import { salvarVenda } from '../../../api/vendas.api';
import tema from '../../../estilos/tema';
import { desformatarParaCentavos, formatarMoeda } from '../../../utilitarios/formatadores';

const FinalizarVendaTela = ({ route, navigation }) => {
  const { cliente, carrinho, total: subtotalProdutosBruto } = route.params;

  const [salvando, setSalvando] = useState(false);
  const [descontoTotalInput, setDescontoTotalInput] = useState('');
  const [dataEntrega, setDataEntrega] = useState(null);
  const [observacoes, setObservacoes] = useState('');
  const [pagamentos, setPagamentos] = useState([]);
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  
  const descontosNosItens = useMemo(() => {
    return carrinho.reduce((acc, item) => {
        const subtotalItem = item.valorVenda * item.quantidade;
        const desconto = item.tipoDesconto === 'R$' 
            ? (item.valorDesconto || 0)
            : subtotalItem * ((item.valorDesconto || 0) / 100);
        return acc + desconto;
    }, 0);
  }, [carrinho]);
  
  // O subtotal real é o bruto menos os descontos já aplicados nos itens
  const subtotalProdutosLiquido = subtotalProdutosBruto - descontosNosItens;
  const descontoGeral = desformatarParaCentavos(descontoTotalInput) / 100;

  const totalFinal = useMemo(() => {
    const frete = 0;
    // O total final é o subtotal líquido (com descontos de itens) menos o desconto geral
    return (subtotalProdutosLiquido - descontoGeral) + frete;
  }, [subtotalProdutosLiquido, descontoGeral]);

  useEffect(() => {
    // Define o pagamento inicial apenas se o total for calculado e nenhum pagamento foi adicionado ainda
    if (totalFinal > 0 && pagamentos.length === 0) {
        setPagamentos([
            {
                id: uuidv4(),
                forma: 'Dinheiro',
                valor: totalFinal,
                parcelas: 1,
            }
        ]);
    }
  }, [totalFinal]);

  const valorRestante = useMemo(() => {
      const valorPago = pagamentos.reduce((acc, p) => acc + p.valor, 0);
      return totalFinal - valorPago;
  }, [totalFinal, pagamentos]);

  const handleAdicionarPagamento = (pagamentoCompleto) => {
    setPagamentos(anteriores => [...anteriores, { ...pagamentoCompleto, id: uuidv4() }]);
  };

  const handleRemoverPagamento = (pagamentoId) => {
    setPagamentos(anteriores => anteriores.filter(p => p.id !== pagamentoId));
  };
  
  const lidarConfirmarVenda = async () => {
    if (salvando) return;
    if (Math.abs(valorRestante) > 0.001) {
        Toast.show({ type: 'error', text1: 'Pagamento Incompleto', text2: 'O valor pago deve ser igual ao total da venda.' });
        return;
    }
    if (pagamentos.length === 0) {
        Toast.show({ type: 'error', text1: 'Pagamento Inválido', text2: 'Adicione pelo menos uma forma de pagamento.' });
        return;
    }
    setSalvando(true);

    const dadosParaApi = {
      cliente: cliente,
      itens: carrinho,
      desconto: descontoGeral + descontosNosItens, // Salva a soma de todos os descontos
      frete: 0,
      pagamentos: pagamentos.map(({id, ...resto}) => resto),
      dataEntrega: dataEntrega ? dataEntrega.getTime() : null,
      observacoes: observacoes,
    };

    try {
      const vendaSalva = await salvarVenda(dadosParaApi);
      Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Venda salva e estoque atualizado.' });
      navigation.replace('ReciboVenda', { venda: vendaSalva });
    } catch (error) {
      console.error("Erro ao salvar a venda:", error);
      Toast.show({ type: 'error', text1: 'Erro ao Salvar', text2: 'Não foi possível concluir a venda.' });
      setSalvando(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* ALTERADO: Passando as props de desconto separadamente */}
        <ResumoFinanceiroCard 
          subtotal={subtotalProdutosBruto}
          frete={0}
          descontosItens={descontosNosItens}
          descontoGeral={descontoGeral}
          totalFinal={totalFinal}
        />
        
        {/* ALTERADO: A ordem dos cards foi invertida */}
        <DetalhesAdicionaisCard
          descontoTotal={descontoTotalInput}
          setDescontoTotal={setDescontoTotalInput}
          dataEntrega={dataEntrega}
          setDataEntrega={setDataEntrega}
          observacoes={observacoes}
          setObservacoes={setObservacoes}
        />

        <PagamentosMultiplosCard
            pagamentos={pagamentos}
            aoRemover={handleRemoverPagamento}
            aoAdicionar={() => setModalPagamentoVisivel(true)}
            totalAPagar={totalFinal}
        />
        
        <View style={styles.botaoContainer}>
          <Button 
            title="Confirmar e Salvar Venda" 
            onPress={lidarConfirmarVenda} 
            color={tema.cores.primaria}
            disabled={salvando || Math.abs(valorRestante) > 0.001 || pagamentos.length === 0}
          />
          {salvando && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={tema.cores.branco} />
            </View>
          )}
        </View>
      </ScrollView>

      <AdicionarPagamentoModal
        visivel={modalPagamentoVisivel}
        aoFechar={() => setModalPagamentoVisivel(false)}
        aoAdicionar={handleAdicionarPagamento}
        valorRestante={valorRestante}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: tema.cores.secundaria },
  contentContainer: { padding: tema.espacamento.medio },
  botaoContainer: { marginTop: tema.espacamento.grande, marginBottom: 50, position: 'relative' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 4 },
});

export default FinalizarVendaTela;
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { buscarContaPorId, registrarPagamentoConta } from '../api/contas.api';
import BaixaPagamentoModal from '../componentes/BaixaPagamentoModal';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarData, formatarMoeda } from '../../../utilitarios/formatadores';

const LinhaDetalhe = ({ label, valor, corValor = tema.cores.preto }) => (
  <View style={styles.linhaDetalhe}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.valor, {color: corValor}]}>{valor}</Text>
  </View>
);

const DetalhesContaTela = ({ route, navigation }) => {
  const { contaId } = route.params;
  const [conta, setConta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modalVisivel, setModalVisivel] = useState(false);

  const carregarDetalhes = useCallback(async () => {
    setCarregando(true);
    const dadosConta = await buscarContaPorId(contaId);
    if (dadosConta) {
      setConta(dadosConta);
      navigation.setOptions({ title: `Conta: ${dadosConta.descricao.substring(0,15)}...`});
    } else {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível encontrar a conta.'});
      navigation.goBack();
    }
    setCarregando(false);
  }, [contaId, navigation]);

  useFocusEffect(carregarDetalhes);

  const handleConfirmarBaixa = async (valor, forma) => {
    try {
      await registrarPagamentoConta(conta.id, valor, forma);
      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Pagamento registrado!' });
      carregarDetalhes(); // Recarrega os dados para mostrar o novo saldo
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível registrar o pagamento.' });
    }
  };

  if (carregando || !conta) {
    return <View style={styles.centralizado}><ActivityIndicator size="large" color={tema.cores.primaria} /></View>;
  }

  const valorRestante = conta.valorTotal - conta.valorPago;

  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.tituloCard}>Detalhes da Conta</Text>
          <LinhaDetalhe label="Descrição" valor={conta.descricao} />
          <LinhaDetalhe label="Cliente" valor={conta.associado.nome} />
          <LinhaDetalhe label="Venda de Origem" valor={conta.origem.codigo} />
          <LinhaDetalhe label="Status" valor={conta.status} />
          <LinhaDetalhe label="Data de Vencimento" valor={formatarData(conta.dataVencimento)} />
        </View>

        <View style={styles.card}>
          <Text style={styles.tituloCard}>Resumo Financeiro</Text>
          <LinhaDetalhe label="Valor Total" valor={formatarMoeda(conta.valorTotal * 100)} />
          <LinhaDetalhe label="Valor Pago" valor={formatarMoeda(conta.valorPago * 100)} corValor={tema.cores.verde} />
          <View style={styles.divisor} />
          <LinhaDetalhe label="Saldo Devedor" valor={formatarMoeda(valorRestante * 100)} corValor={tema.cores.vermelho} />
        </View>

        <View style={styles.card}>
            <Text style={styles.tituloCard}>Histórico de Pagamentos</Text>
            {conta.movimentacoes.length === 0 ? (
                <Text style={styles.textoVazio}>Nenhum pagamento registrado.</Text>
            ) : (
                conta.movimentacoes.map(mov => (
                    <LinhaDetalhe 
                        key={mov.id} 
                        label={`${formatarData(mov.data)} (${mov.forma})`} 
                        valor={formatarMoeda(mov.valor * 100)} 
                    />
                ))
            )}
        </View>
      </ScrollView>

      {conta.status !== 'PAGA' && (
        <View style={styles.footer}>
          <Botao 
            titulo="Registrar Pagamento (Dar Baixa)" 
            onPress={() => setModalVisivel(true)} 
            icone="check"
          />
        </View>
      )}

      <BaixaPagamentoModal
        visivel={modalVisivel}
        aoFechar={() => setModalVisivel(false)}
        aoConfirmar={handleConfirmarBaixa}
        conta={conta}
      />
    </>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    centralizado: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { backgroundColor: tema.cores.branco, borderRadius: 12, padding: tema.espacamento.medio, margin: tema.espacamento.medio, elevation: 2 },
    tituloCard: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: tema.cores.preto },
    linhaDetalhe: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    label: { fontSize: 16, color: tema.cores.cinza },
    valor: { fontSize: 16, fontWeight: '500' },
    divisor: { height: 1.5, backgroundColor: '#F0F0F0', marginVertical: 8 },
    footer: { padding: tema.espacamento.medio, backgroundColor: tema.cores.branco, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
    textoVazio: { color: tema.cores.cinza, textAlign: 'center', marginVertical: 10 },
});

export default DetalhesContaTela;
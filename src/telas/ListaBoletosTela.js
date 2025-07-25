import React, { useState, useContext, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

import { ContextoBoletos } from '../contexto/ContextoBoletos';
import CartaoBoleto from '../componentes/CartaoBoleto';
import ModalPagamento from '../componentes/ModalPagamento';
import { tema } from '../estilos/tema';
import ModalFiltro from '../componentes/ModalFiltro';
import LinhaTabelaBoleto, { LARGURA_COLUNAS } from '../componentes/LinhaTabelaBoleto';

const opcoesFiltro = [ { label: 'Mostrar Tudo', value: 'mostrar_tudo' }, { label: 'Todos os Pendentes', value: 'pendentes' }, { label: 'A Pagar', value: 'aPagar' }, { label: 'Vencendo', value: 'vencendo' }, { label: 'Vencidos', value: 'vencido' }, { label: 'Pagos', value: 'pago' }, ];
const LARGURA_TOTAL_TABELA = Object.values(LARGURA_COLUNAS).reduce((a, b) => a + b, 0);

const SkeletonCard = () => ( <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonCard} /> );
const SkeletonRow = () => ( <ShimmerPlaceholder LinearGradient={LinearGradient} style={[styles.skeletonRow, {width: LARGURA_TOTAL_TABELA}]} /> );

const ListaBoletosTela = ({ navigation }) => {
  const { boletos, estaCarregando, removerBoleto, marcarComoPago, desmarcarComoPago } = useContext(ContextoBoletos);
  const [filtroAtivo, setFiltroAtivo] = useState('mostrar_tudo');
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
  const [boletoSelecionado, setBoletoSelecionado] = useState(null);
  const [modalFiltroVisivel, setModalFiltroVisivel] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState('card');
  const [termoBusca, setTermoBusca] = useState('');
  const route = useRoute();
  
  useFocusEffect(useCallback(() => { if (route.params?.filtro) setFiltroAtivo(route.params.filtro); }, [route.params?.filtro]));

  const boletosFiltrados = useMemo(() => {
    let boletosProcessados = [...boletos];
    if (filtroAtivo !== 'mostrar_tudo') {
      if (filtroAtivo === 'pendentes') { boletosProcessados = boletosProcessados.filter(b => b.status !== 'pago'); } 
      else { boletosProcessados = boletosProcessados.filter(b => b.status === filtroAtivo); }
    }
    if (termoBusca.trim() !== '') {
      const termo = termoBusca.toLowerCase();
      boletosProcessados = boletosProcessados.filter(b => b.emissor.toLowerCase().includes(termo) || b.descricao.toLowerCase().includes(termo) || b.valor.toString().replace('.',',').includes(termo) || b.numeroBoleto?.toLowerCase().includes(termo));
    }
    return boletosProcessados.sort((a, b) => new Date(b.vencimento) - new Date(a.vencimento));
  }, [boletos, filtroAtivo, termoBusca]);

  const totalFiltrado = useMemo(() => {
    return boletosFiltrados.reduce((acc, boleto) => {
      const valor = (boleto.status === 'pago') ? (boleto.valorPago || 0) : boleto.valor;
      return acc + valor;
    }, 0);
  }, [boletosFiltrados]);

  const handleEditar = useCallback((boleto) => navigation.navigate('FormularioBoleto', { boletoId: boleto.id }), [navigation]);
  const handlePagar = useCallback((boleto) => { setBoletoSelecionado(boleto); setModalPagamentoVisivel(true); }, []);
  const handleFecharModalPagamento = useCallback(() => { setModalPagamentoVisivel(false); setBoletoSelecionado(null); }, []);
  const handleDesmarcar = useCallback((idBoleto) => Alert.alert("Confirmar Ação", "Deseja desmarcar este boleto como pago?", [{ text: "Cancelar" }, { text: "Confirmar", onPress: () => desmarcarComoPago(idBoleto), style: "destructive" }]), [desmarcarComoPago]);
  const handleExcluir = useCallback((idBoleto) => Alert.alert("Confirmar Exclusão", "Deseja excluir este boleto?", [{ text: "Cancelar" }, { text: "Excluir", onPress: () => { removerBoleto(idBoleto); Toast.show({type: 'info', text1: 'Boleto removido.'}) }, style: "destructive" }]), [removerBoleto]);

  const labelFiltroAtual = opcoesFiltro.find(opt => opt.value === filtroAtivo)?.label;

  const CabecalhoTabela = () => (
    <View style={styles.cabecalhoTabela}>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.emissor}]}>Emissor</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.descricao}]}>Descrição</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.valor, textAlign: 'right'}]}>Valor</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.data, textAlign: 'center'}]}>Data</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.juros, textAlign: 'right'}]}>Juros/Multa</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.numeroBoleto}]}>Número</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.status, textAlign: 'center'}]}>Status</Text>
      <Text style={[styles.textoCabecalho, {width: LARGURA_COLUNAS.acoes, textAlign: 'center'}]}>Ações</Text>
    </View>
  );

  const RenderListaVazia = () => (
    <View style={modoVisualizacao === 'card' ? styles.listaVaziaContainer : [styles.listaVaziaContainerTabela, {width: LARGURA_TOTAL_TABELA}]}>
        <Ionicons name="cloud-offline-outline" size={60} color={tema.cores.cinza} />
        <Text style={styles.listaVaziaTexto}>Nenhum boleto encontrado.</Text>
        <Text style={styles.listaVaziaSubtexto}>Tente alterar os filtros ou adicione um novo boleto.</Text>
    </View>
  );

  if (estaCarregando) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ padding: 16 }}>
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.cabecalhoControles}>
        <TouchableOpacity style={styles.seletorFiltro} onPress={() => setModalFiltroVisivel(true)}>
          <Text style={styles.seletorFiltroTexto}>{labelFiltroAtual}</Text>
          <Ionicons name="chevron-down" size={20} color={tema.cores.primaria} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botaoVisualizacao} onPress={() => setModoVisualizacao(m => m === 'card' ? 'table' : 'card')}>
          <Ionicons name={modoVisualizacao === 'card' ? 'grid-outline' : 'list-outline'} size={24} color={tema.cores.primaria} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color={tema.cores.cinza} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Pesquisar..." placeholderTextColor={tema.cores.cinza} value={termoBusca} onChangeText={setTermoBusca}/>
      </View>
      <View style={styles.containerTotal}>
        <Text style={styles.textoTotal}>Total: </Text>
        <Text style={styles.valorTotal}>R$ {totalFiltrado.toFixed(2).replace('.', ',')}</Text>
      </View>

      <ModalFiltro visivel={modalFiltroVisivel} aoFechar={() => setModalFiltroVisivel(false)} opcoes={opcoesFiltro} filtroAtual={filtroAtivo} onSelecionarFiltro={(f) => setFiltroAtivo(f)} />

      {modoVisualizacao === 'card' ? (
        <FlatList data={boletosFiltrados} keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CartaoBoleto boleto={item} onPagar={handlePagar} onEditar={handleEditar} onExcluir={handleExcluir} onDesmarcar={handleDesmarcar} />}
          ListEmptyComponent={RenderListaVazia} contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <ScrollView horizontal>
          <View>
            <CabecalhoTabela />
            <FlatList data={boletosFiltrados} keyExtractor={(item) => item.id}
              renderItem={({ item }) => <LinhaTabelaBoleto boleto={item} onPagar={handlePagar} onEditar={handleEditar} onExcluir={handleExcluir} onDesmarcar={handleDesmarcar} />}
              ListEmptyComponent={RenderListaVazia}
            />
          </View>
        </ScrollView>
      )}

      {boletoSelecionado && <ModalPagamento visivel={modalPagamentoVisivel} aoFechar={handleFecharModalPagamento} aoConfirmar={marcarComoPago} boleto={boletoSelecionado} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
  cabecalhoControles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: tema.espacamento.medio, paddingTop: tema.espacamento.medio, },
  seletorFiltro: { flex: 1, backgroundColor: '#FFF', borderRadius: tema.raioBorda.medio, borderWidth: 1, borderColor: tema.cores.borda, paddingHorizontal: tema.espacamento.medio, height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: tema.espacamento.pequeno },
  seletorFiltroTexto: { fontSize: 16, color: tema.cores.primaria, fontWeight: 'bold' },
  botaoVisualizacao: { padding: 10, backgroundColor: '#FFF', borderRadius: tema.raioBorda.medio, borderWidth: 1, borderColor: tema.cores.borda, height: 48, justifyContent: 'center' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: tema.raioBorda.medio, marginHorizontal: tema.espacamento.medio, marginTop: tema.espacamento.pequeno, paddingHorizontal: tema.espacamento.pequeno, borderWidth: 1, borderColor: tema.cores.borda, height: 48 },
  searchIcon: { marginHorizontal: 5, },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: tema.cores.texto, },
  containerTotal: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: tema.espacamento.medio, paddingVertical: tema.espacamento.pequeno, },
  textoTotal: { fontSize: 14, color: tema.cores.cinza },
  valorTotal: { fontSize: 16, fontWeight: 'bold', color: tema.cores.primaria },
  listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  listaVaziaContainerTabela: { height: 200, justifyContent: 'center', alignItems: 'center' },
  listaVaziaTexto: { fontSize: 18, fontWeight: 'bold', color: tema.cores.cinza, marginBottom: 8 },
  listaVaziaSubtexto: { fontSize: 14, color: tema.cores.cinza, textAlign: 'center' },
  cabecalhoTabela: { flexDirection: 'row', backgroundColor: '#E9EEF2', borderBottomWidth: 2, borderBottomColor: tema.cores.primaria, paddingVertical: tema.espacamento.pequeno, paddingLeft: tema.espacamento.pequeno, },
  textoCabecalho: { color: tema.cores.primaria, fontWeight: 'bold', fontSize: 14, paddingHorizontal: tema.espacamento.pequeno, justifyContent: 'center' },
  skeletonCard: { height: 150, width: '100%', borderRadius: tema.raioBorda.medio, marginBottom: tema.espacamento.medio, },
  skeletonRow: { height: 60, width: '100%', marginBottom: 2, }
});

export default ListaBoletosTela;
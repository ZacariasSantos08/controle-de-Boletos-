import React, { useState, useContext, useMemo, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, Alert, TouchableOpacity, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import { isWithinInterval, parseISO, startOfDay, endOfDay } from 'date-fns';
import { ContextoBoletos } from '../contexto/ContextoBoletos';
import CartaoBoleto from '../componentes/CartaoBoleto';
import ModalPagamento from '../componentes/ModalPagamento';
import ModalAnexo from '../componentes/ModalAnexo';
import { tema } from '../estilos/tema';
import ModalFiltro from '../componentes/ModalFiltro';
import ModalFiltroAvancado from '../componentes/ModalFiltroAvancado';
import LinhaTabelaBoleto, { LARGURA_COLUNAS } from '../componentes/LinhaTabelaBoleto';

const opcoesFiltro = [ { label: 'Mostrar Tudo', value: 'mostrar_tudo' }, { label: 'Todos os Pendentes', value: 'pendentes' }, { label: 'A Pagar', value: 'aPagar' }, { label: 'Vencendo', value: 'vencendo' }, { label: 'Vencidos', value: 'vencido' }, { label: 'Pagos', value: 'pago' }];
let LARGURA_TABELA_COMPLETA = Object.values(LARGURA_COLUNAS).reduce((a, b) => a + b, 0);
let LARGURA_TABELA_SELECAO = LARGURA_TABELA_COMPLETA;
if (LARGURA_COLUNAS.selecao) {
    LARGURA_TABELA_COMPLETA -= LARGURA_COLUNAS.selecao;
}


const SkeletonCard = () => ( <ShimmerPlaceholder LinearGradient={LinearGradient} style={styles.skeletonCard} /> );
const SkeletonRow = () => ( <ShimmerPlaceholder LinearGradient={LinearGradient} style={[styles.skeletonRow, { width: LARGURA_TABELA_COMPLETA }]} /> );

const ListaBoletosTela = () => {
    const { boletos, estaCarregando, removerBoleto, marcarComoPago, desmarcarComoPago, todosEmissoresUnicos, todosPagadoresUnicos, removerBoletosEmMassa } = useContext(ContextoBoletos);
    
    const [filtroAtivo, setFiltroAtivo] = useState('mostrar_tudo');
    const [modalFiltroVisivel, setModalFiltroVisivel] = useState(false);
    const [modoVisualizacao, setModoVisualizacao] = useState('card');
    const [termoBusca, setTermoBusca] = useState('');
    const [filtrosAvancados, setFiltrosAvancados] = useState({ dataInicial: null, dataFinal: null, emissor: null, pagador: null });
    const [modalFiltroAvancadoVisivel, setModalFiltroAvancadoVisivel] = useState(false);
    const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false);
    const [boletoSelecionado, setBoletoSelecionado] = useState(null);
    const [modalAnexoVisivel, setModalAnexoVisivel] = useState(false);
    const [uriAnexoSelecionado, setUriAnexoSelecionado] = useState(null);
    const [modoSelecao, setModoSelecao] = useState(false);
    const [idsSelecionados, setIdsSelecionados] = useState([]);

    const route = useRoute();
    const navigation = useNavigation();

    const toggleModoSelecao = useCallback(() => {
        const novoModo = !modoSelecao;
        setModoSelecao(novoModo);
        if (!novoModo) {
            setIdsSelecionados([]);
        }
    }, [modoSelecao]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <TouchableOpacity onPress={toggleModoSelecao} style={{ marginRight: tema.espacamento.medio }}>
                        <Ionicons name={modoSelecao ? "close-circle" : "checkmark-circle-outline"} size={26} color={tema.cores.textoClaro} />
                    </TouchableOpacity>
                    {!modoSelecao && (
                        <TouchableOpacity onPress={() => navigation.navigate('Configuracoes')} style={{ marginRight: tema.espacamento.medio }}>
                            <Ionicons name="settings-outline" size={24} color={tema.cores.textoClaro} />
                        </TouchableOpacity>
                    )}
                </View>
            ),
        });
    }, [navigation, modoSelecao, toggleModoSelecao]);

    useFocusEffect(useCallback(() => { if (route.params?.filtro) { setFiltroAtivo(route.params.filtro); } }, [route.params?.filtro]));

    const boletosFiltrados = useMemo(() => {
        let boletosProcessados = [...boletos];
        if (filtroAtivo !== 'mostrar_tudo') {
            if (filtroAtivo === 'pendentes') {
                boletosProcessados = boletosProcessados.filter(b => b.status !== 'pago');
            } else {
                boletosProcessados = boletosProcessados.filter(b => b.status === filtroAtivo);
            }
        }
        if (filtrosAvancados.emissor) { boletosProcessados = boletosProcessados.filter(b => b.emissor === filtrosAvancados.emissor); }
        if (filtrosAvancados.pagador) { boletosProcessados = boletosProcessados.filter(b => b.pagador === filtrosAvancados.pagador); }
        if (filtrosAvancados.dataInicial && filtrosAvancados.dataFinal) {
            const intervalo = { start: startOfDay(filtrosAvancados.dataInicial), end: endOfDay(filtrosAvancados.dataFinal) };
            boletosProcessados = boletosProcessados.filter(b => b.vencimento && isWithinInterval(parseISO(b.vencimento), intervalo));
        }
        if (termoBusca && termoBusca.trim() !== '') {
            const termo = termoBusca.toLowerCase();
            boletosProcessados = boletosProcessados.filter(b => (b.emissor?.toLowerCase().includes(termo)) || (b.pagador?.toLowerCase().includes(termo)) || (b.descricao?.toLowerCase().includes(termo)) || (b.linhaDigitavel?.toLowerCase().includes(termo)) || (b.numeroDocumento?.toLowerCase().includes(termo)));
        }
        return boletosProcessados.sort((a, b) => new Date(b.vencimento).getTime() - new Date(a.vencimento).getTime());
    }, [boletos, filtroAtivo, termoBusca, filtrosAvancados]);
    
    const totalFiltrado = useMemo(() => { return boletosFiltrados.reduce((acc, boleto) => { const valor = (boleto.status === 'pago') ? (boleto.valorPago || 0) : boleto.valor; return acc + valor; }, 0); }, [boletosFiltrados]);

    const handleVerAnexo = useCallback((uri) => { setUriAnexoSelecionado(uri); setModalAnexoVisivel(true); }, []);
    const handleFecharModalAnexo = useCallback(() => { setModalAnexoVisivel(false); setUriAnexoSelecionado(null); }, []);
    const handleEditar = useCallback((boleto) => { navigation.navigate('FormularioBoleto', { boletoId: boleto.id }); }, [navigation]);
    const handlePagar = useCallback((boleto) => { setBoletoSelecionado(boleto); setModalPagamentoVisivel(true); }, []);
    const handleFecharModalPagamento = useCallback(() => { setModalPagamentoVisivel(false); setBoletoSelecionado(null); }, []);
    const handleDesmarcar = useCallback((idBoleto) => { Alert.alert( "Confirmar Ação", "Deseja desmarcar este boleto como pago?", [{ text: "Cancelar" }, { text: "Confirmar", onPress: () => desmarcarComoPago(idBoleto), style: "destructive" }] ); }, [desmarcarComoPago]);
    const handleExcluir = useCallback((idBoleto) => { Alert.alert( "Confirmar Exclusão", "Deseja excluir este boleto?", [{ text: "Cancelar" }, { text: "Excluir", onPress: () => { removerBoleto(idBoleto); Toast.show({ type: 'info', text1: 'Boleto removido.' }); }, style: "destructive" }] ); }, [removerBoleto]);

    const handleToggleSelecaoItem = (id) => {
        setIdsSelecionados(prevIds => {
            const set = new Set(prevIds);
            if (set.has(id)) { set.delete(id); } else { set.add(id); }
            return Array.from(set);
        });
    };

    const handleRemoverSelecionados = () => {
        if (idsSelecionados.length === 0) return;
        Alert.alert( `Excluir ${idsSelecionados.length} Boletos`, "Esta ação não pode ser desfeita. Você tem certeza?",
            [ { text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: () => {
                removerBoletosEmMassa(idsSelecionados);
                toggleModoSelecao();
                Toast.show({type: 'info', text1: `${idsSelecionados.length} boletos foram removidos.`});
            }}]
        );
    };
    
    const isFiltroAvancadoAtivo = filtrosAvancados.dataInicial || filtrosAvancados.emissor || filtrosAvancados.pagador;
    const labelFiltroAtual = opcoesFiltro.find(opt => opt.value === filtroAtivo)?.label;

    const CabecalhoTabela = () => (
        <View style={styles.cabecalhoTabela}>
          {modoSelecao && <View style={{width: LARGURA_COLUNAS.selecao}} />}
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.emissor }]}>Emissor</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.pagador }]}>Pagador</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.descricao }]}>Descrição</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.valor, textAlign: 'right' }]}>Valor</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.data, textAlign: 'center' }]}>Data</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.juros, textAlign: 'right' }]}>Juros/Multa</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.numeroDocumento, textAlign: 'center' }]}>Nº Doc</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.anexo, textAlign: 'center' }]}>Anexo</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.status, textAlign: 'center' }]}>Status</Text>
          <Text style={[styles.textoCabecalho, { width: LARGURA_COLUNAS.acoes, textAlign: 'center' }]}>Ações</Text>
        </View>
    );

    const RenderListaVazia = () => ( <View style={modoVisualizacao === 'card' ? styles.listaVaziaContainer : [styles.listaVaziaContainerTabela, { width: modoSelecao ? LARGURA_TABELA_SELECAO : LARGURA_TABELA_COMPLETA  }]}><Ionicons name="cloud-offline-outline" size={60} color={tema.cores.cinza} /><Text style={styles.listaVaziaTexto}>Nenhum boleto encontrado.</Text><Text style={styles.listaVaziaSubtexto}>Tente alterar os filtros ou adicione um novo boleto.</Text></View> );

    if (estaCarregando) { return ( <SafeAreaView style={styles.safeArea}><View style={{ padding: 16 }}>{[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}</View></SafeAreaView> ); }

    return (
        <SafeAreaView style={styles.safeArea}>
            {!modoSelecao && (
                <>
                    <View style={styles.cabecalhoControles}><TouchableOpacity style={styles.seletorFiltro} onPress={() => setModalFiltroVisivel(true)}><Text style={styles.seletorFiltroTexto}>{labelFiltroAtual}</Text><Ionicons name="chevron-down" size={20} color={tema.cores.primaria} /></TouchableOpacity><TouchableOpacity style={styles.botaoIcone} onPress={() => setModalFiltroAvancadoVisivel(true)}><Ionicons name="funnel-outline" size={24} color={tema.cores.primaria} />{isFiltroAvancadoAtivo && <View style={styles.filtroAtivoBadge} />}</TouchableOpacity><TouchableOpacity style={styles.botaoIcone} onPress={() => setModoVisualizacao(m => m === 'card' ? 'table' : 'card')}><Ionicons name={modoVisualizacao === 'card' ? 'grid-outline' : 'list-outline'} size={24} color={tema.cores.primaria} /></TouchableOpacity></View>
                    <View style={styles.searchBarContainer}><Ionicons name="search" size={20} color={tema.cores.cinza} style={styles.searchIcon} /><TextInput style={styles.searchInput} placeholder="Pesquisar..." placeholderTextColor={tema.cores.cinza} value={termoBusca} onChangeText={setTermoBusca}/></View>
                    <View style={styles.containerTotal}><Text style={styles.textoTotal}>Total Exibido: </Text><Text style={styles.valorTotal}>R$ {totalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text></View>
                </>
            )}

            {modoSelecao && (
                <View style={styles.barraAcoes}>
                    <Text style={styles.textoAcoes}>{`${idsSelecionados.length} selecionado(s)`}</Text>
                    <TouchableOpacity onPress={handleRemoverSelecionados} disabled={idsSelecionados.length === 0}>
                        <Ionicons name="trash-outline" size={26} color={idsSelecionados.length > 0 ? tema.cores.erro : tema.cores.cinza} />
                    </TouchableOpacity>
                </View>
            )}

            {modoVisualizacao === 'card' ? (
                <FlatList data={boletosFiltrados} keyExtractor={(item) => item.id} renderItem={({ item }) => ( <CartaoBoleto boleto={item} modoSelecao={modoSelecao} isSelecionado={idsSelecionados.includes(item.id)} onToggleSelecao={handleToggleSelecaoItem} onPagar={handlePagar} onEditar={handleEditar} onExcluir={handleExcluir} onDesmarcar={handleDesmarcar} onVerAnexo={handleVerAnexo} /> )} ListEmptyComponent={RenderListaVazia} contentContainerStyle={{ paddingBottom: 80 }} />
            ) : (
                <ScrollView horizontal>
                    <View>
                        <CabecalhoTabela />
                        <FlatList data={boletosFiltrados} keyExtractor={(item) => item.id} renderItem={({ item }) => ( <LinhaTabelaBoleto boleto={item} modoSelecao={modoSelecao} isSelecionado={idsSelecionados.includes(item.id)} onToggleSelecao={handleToggleSelecaoItem} onPagar={handlePagar} onEditar={handleEditar} onExcluir={handleExcluir} onDesmarcar={handleDesmarcar} onVerAnexo={handleVerAnexo}/> )} ListEmptyComponent={RenderListaVazia} />
                    </View>
                </ScrollView>
            )}

            <ModalFiltro visivel={modalFiltroVisivel} aoFechar={() => setModalFiltroVisivel(false)} opcoes={opcoesFiltro} filtroAtual={filtroAtivo} onSelecionarFiltro={(f) => setFiltroAtivo(f)}/>
            <ModalFiltroAvancado visivel={modalFiltroAvancadoVisivel} aoFechar={() => setModalFiltroAvancadoVisivel(false)} aplicarFiltros={setFiltrosAvancados} filtrosAtuais={filtrosAvancados} emissores={todosEmissoresUnicos} pagadores={todosPagadoresUnicos} />
            {boletoSelecionado && ( <ModalPagamento visivel={modalPagamentoVisivel} aoFechar={handleFecharModalPagamento} aoConfirmar={marcarComoPago} boleto={boletoSelecionado}/> )}
            <ModalAnexo visivel={modalAnexoVisivel} aoFechar={handleFecharModalAnexo} uri={uriAnexoSelecionado}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: tema.cores.fundo },
    cabecalhoControles: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: tema.espacamento.medio, paddingTop: tema.espacamento.pequeno },
    seletorFiltro: { flex: 1, backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, borderWidth: 1, borderColor: tema.cores.borda, paddingHorizontal: tema.espacamento.medio, height: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    botaoIcone: { padding: 10, backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, borderWidth: 1, borderColor: tema.cores.borda, height: 48, justifyContent: 'center', marginLeft: tema.espacamento.pequeno, },
    filtroAtivoBadge: { position: 'absolute', top: 5, right: 5, width: 10, height: 10, borderRadius: 5, backgroundColor: tema.cores.secundaria, borderWidth: 1, borderColor: tema.cores.superficie },
    seletorFiltroTexto: { fontSize: 16, color: tema.cores.primaria, fontWeight: 'bold' },
    searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, marginHorizontal: tema.espacamento.medio, marginTop: tema.espacamento.pequeno, paddingHorizontal: tema.espacamento.pequeno, borderWidth: 1, borderColor: tema.cores.borda, height: 48 },
    searchIcon: { marginHorizontal: 5 },
    searchInput: { flex: 1, height: '100%', fontSize: 16, color: tema.cores.texto },
    containerTotal: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: tema.espacamento.medio, paddingVertical: tema.espacamento.pequeno, borderBottomWidth: 1, borderBottomColor: tema.cores.borda },
    textoTotal: { fontSize: 14, color: tema.cores.cinza },
    valorTotal: { fontSize: 16, fontWeight: 'bold', color: tema.cores.primaria },
    barraAcoes: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: tema.espacamento.medio, backgroundColor: tema.cores.superficie, borderBottomWidth: 1, borderBottomColor: tema.cores.borda, },
    textoAcoes: { ...tema.tipografia.subtitulo, color: tema.cores.texto, },
    listaVaziaContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
    listaVaziaContainerTabela: { height: 200, justifyContent: 'center', alignItems: 'center' },
    listaVaziaTexto: { fontSize: 18, fontWeight: 'bold', color: tema.cores.cinza, marginBottom: 8 },
    listaVaziaSubtexto: { fontSize: 14, color: tema.cores.cinza, textAlign: 'center' },
    cabecalhoTabela: { flexDirection: 'row', backgroundColor: '#E9EEF2', borderBottomWidth: 2, borderBottomColor: tema.cores.primaria, paddingVertical: tema.espacamento.pequeno, paddingLeft: tema.espacamento.pequeno, alignItems: 'center' },
    textoCabecalho: { color: tema.cores.primaria, fontWeight: 'bold', fontSize: 14, paddingHorizontal: tema.espacamento.pequeno, justifyContent: 'center' },
    skeletonCard: { height: 180, width: '100%', borderRadius: tema.raioBorda.medio, marginBottom: tema.espacamento.medio },
    skeletonRow: { height: 60, width: '100%', marginBottom: 2 },
});

export default ListaBoletosTela;
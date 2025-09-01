import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import InputFormulario from '../../../componentes/InputFormulario';
import Botao from '../../../componentes/Botao';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import BotaoCircular from '../../../componentes/BotaoCircular';
import SeletorDeData from '../../../componentes/SeletorDeData';
import tema from '../../../estilos/tema';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const OPCOES_ESTOQUE = [
    { id: 'todos', nome: 'Todos', icone: 'grid' },
    { id: 'positivo', nome: 'Em Estoque', icone: 'check-circle' },
    { id: 'baixo', nome: 'Estoque Baixo', icone: 'alert-triangle' },
    { id: 'zerado', nome: 'Sem Estoque', icone: 'x-circle' },
];

const OPCOES_CATEGORIA = [
    { id: 'com', nome: 'Com Categoria' },
    { id: 'sem', nome: 'Sem Categoria' },
];

// NOVO: Opções para o filtro de status
const OPCOES_STATUS = [
    { id: 'Ativo', nome: 'Ativos' },
    { id: 'Inativo', nome: 'Inativos' },
    { id: 'Todos', nome: 'Todos' },
];

const SecaoFiltro = ({ titulo, icone, children }) => (
    <View style={styles.secao}>
        <View style={styles.headerSecao}>
            <Feather name={icone} size={24} color={tema.cores.primaria} />
            <Text style={styles.subtitulo}>{titulo}</Text>
        </View>
        {children}
    </View>
);

const Chip = ({ texto, onRemove }) => (
    <View style={styles.chip}>
        <Text style={styles.chipTexto}>{texto}</Text>
        <TouchableOpacity onPress={onRemove} style={styles.chipRemove}>
            <Feather name="x" size={14} color={tema.cores.primaria} />
        </TouchableOpacity>
    </View>
);

const FiltrosModal = ({ 
  visivel, 
  aoFechar, 
  aoAplicar, 
  filtrosIniciais,
  listasDeFiltro,
  contagemResultados,
  onSalvarFiltro,
  atualizacaoEmTempoReal,
  onMudarAtualizacaoTempoReal,
}) => {
  const [filtros, setFiltros] = useState(filtrosIniciais || {});

  useEffect(() => { setFiltros(filtrosIniciais || {}); }, [filtrosIniciais]);

  const setFiltro = (chave, valor) => {
    let novosFiltros;
    if (valor === null || valor === undefined || (Array.isArray(valor) && valor.length === 0)) {
      novosFiltros = { ...filtros };
      delete novosFiltros[chave];
    } else {
      novosFiltros = { ...filtros, [chave]: valor };
    }
    setFiltros(novosFiltros);
    if (atualizacaoEmTempoReal) {
      aoAplicar(novosFiltros);
    }
  };

  const limparFiltros = () => {
    const filtrosPadrao = { status: 'Ativo' };
    setFiltros(filtrosPadrao);
    aoAplicar(filtrosPadrao);
    aoFechar();
  };

  const removerItemDoFiltroMultiplo = (chave, itemParaRemover) => {
    const listaAtual = filtros[chave] || [];
    const novaLista = listaAtual.filter(item => item.id !== itemParaRemover.id);
    setFiltro(chave, novaLista);
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={aoFechar}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={aoFechar} />
      <SafeAreaView style={styles.containerModal} edges={['bottom']}>
        <View style={styles.modalContent}>
            <View style={styles.headerModal}>
                <Text style={styles.titulo}>Filtrar e Refinar</Text>
                <TouchableOpacity onPress={onSalvarFiltro}>
                <Feather name="bookmark" size={24} color={tema.cores.primaria} />
                </TouchableOpacity>
            </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* NOVO: Seção para o filtro de status */}
            <SecaoFiltro titulo="Status" icone="toggle-right">
                <GrupoDeBotoes 
                    opcoes={OPCOES_STATUS}
                    selecionado={filtros.status || 'Ativo'}
                    aoSelecionar={(id) => setFiltro('status', id)}
                />
            </SecaoFiltro>

            <SecaoFiltro titulo="Atributos" icone="tag">
                <GrupoDeBotoes
                    opcoes={OPCOES_CATEGORIA}
                    selecionado={filtros.statusCategoria}
                    aoSelecionar={(id) => setFiltro('statusCategoria', id)}
                />
                {filtros.statusCategoria === 'com' && (
                    <View style={{marginTop: tema.espacamento.pequeno}}>
                        <Text style={styles.labelChips}>Categorias Selecionadas:</Text>
                        <View style={styles.chipsContainer}>
                            {(filtros.categorias || []).map(cat => (
                                <Chip key={cat.id} texto={cat.nome} onRemove={() => removerItemDoFiltroMultiplo('categorias', cat)} />
                            ))}
                            <TouchableOpacity onPress={() => listasDeFiltro.abrirModal('categorias')}>
                                <Text style={styles.botaoAdicionar}>+ Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SecaoFiltro>

            <SecaoFiltro titulo="Preço" icone="dollar-sign">
                <View style={styles.containerPreco}>
                    <InputFormulario label="Preço Mínimo" valor={filtros.precoMinimo || ''} aoMudarTexto={v => setFiltro('precoMinimo', v)} tipoTeclado="numeric" formatador={formatarMoeda} />
                    <InputFormulario label="Preço Máximo" valor={filtros.precoMaximo || ''} aoMudarTexto={v => setFiltro('precoMaximo', v)} tipoTeclado="numeric" formatador={formatarMoeda} />
                </View>
            </SecaoFiltro>
            <SecaoFiltro titulo="Estoque" icone="archive">
                <GrupoDeBotoes opcoes={OPCOES_ESTOQUE} selecionado={filtros.statusEstoque} aoSelecionar={(id) => setFiltro('statusEstoque', id)}/>
            </SecaoFiltro>
             <SecaoFiltro titulo="Data de Cadastro" icone="calendar">
                <View style={styles.containerDatas}>
                <View style={{flex: 1}}>
                    <SeletorDeData
                    label="De"
                    data={filtros.dataInicial}
                    aoMudarData={(data) => setFiltro('dataInicial', data)}
                    />
                </View>
                <View style={{width: tema.espacamento.medio}} />
                <View style={{flex: 1}}>
                    <SeletorDeData
                    label="Até"
                    data={filtros.dataFinal}
                    aoMudarData={(data) => setFiltro('dataFinal', data)}
                    />
                </View>
                </View>
            </SecaoFiltro>
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Atualizar em tempo real</Text>
                <Switch
                    value={atualizacaoEmTempoReal}
                    onValueChange={onMudarAtualizacaoTempoReal}
                    trackColor={{ false: "#E0E0E0", true: "#D5B6E9" }}
                    thumbColor={atualizacaoEmTempoReal ? tema.cores.primaria : "#f4f3f4"}
                />
            </View>
            <View style={styles.botoesContainer}>
              <Text style={styles.contadorResultados}>{contagemResultados} produto(s)</Text>
              {!atualizacaoEmTempoReal && (
                <View style={styles.botoesFooter}>
                    <BotaoCircular titulo="Limpar" tipo="secundario" onPress={limparFiltros} />
                    <BotaoCircular titulo="Aplicar" tipo="primario" onPress={() => aoAplicar(filtros)} />
                </View>
              )}
            </View>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
    containerModal: { backgroundColor: 'transparent' },
    modalContent: {
      backgroundColor: tema.cores.secundaria,
      padding: tema.espacamento.medio,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '85%',
    },
    headerModal: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: tema.espacamento.grande },
    titulo: { flex: 1, fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: tema.cores.preto, marginLeft: 24 },
    secao: {
      backgroundColor: tema.cores.branco,
      borderRadius: 12,
      padding: tema.espacamento.medio,
      marginBottom: tema.espacamento.medio,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 5,
    },
    headerSecao: { flexDirection: 'row', alignItems: 'center', marginBottom: tema.espacamento.medio },
    subtitulo: { fontSize: 18, fontWeight: 'bold', color: tema.cores.preto, marginLeft: tema.espacamento.medio },
    containerPreco: { gap: tema.espacamento.medio },
    containerDatas: { flexDirection: 'row' },
    labelChips: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.preto, marginBottom: tema.espacamento.pequeno, fontWeight: 'bold' },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: tema.espacamento.pequeno },
    chip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E9D5FF', borderRadius: 16, paddingVertical: 4, paddingHorizontal: 10 },
    chipTexto: { color: tema.cores.primaria, fontWeight: 'bold', marginRight: 6 },
    chipRemove: { backgroundColor: '#fff', borderRadius: 10 },
    botaoAdicionar: { color: tema.cores.primaria, fontWeight: 'bold', padding: 8 },
    footer: { paddingTop: tema.espacamento.medio, backgroundColor: tema.cores.secundaria },
    switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: tema.espacamento.medio, paddingHorizontal: 4},
    switchLabel: { fontSize: 14, color: tema.cores.cinza },
    botoesContainer: { alignItems: 'center' },
    contadorResultados: { fontSize: 14, color: tema.cores.cinza, marginBottom: tema.espacamento.pequeno },
    botoesFooter: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
});

export default FiltrosModal;
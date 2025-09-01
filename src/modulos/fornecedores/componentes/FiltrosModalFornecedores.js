import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView } from 'react-native';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';

const OPCOES_TIPO = [
    { id: null, nome: 'Todos' }, // Alterado 'todos' para null para facilitar a limpeza do filtro
    { id: 'Juridica', nome: 'Pessoa Jurídica' },
    { id: 'Fisica', nome: 'Pessoa Física' },
];

// NOVO: Opções para o filtro de status
const OPCOES_STATUS = [
    { id: 'Ativo', nome: 'Ativos' },
    { id: 'Inativo', nome: 'Inativos' },
    { id: 'Todos', nome: 'Todos' },
];

const FiltrosModalFornecedores = ({ visivel, aoFechar, aoAplicar, filtrosIniciais }) => {
  const [filtros, setFiltros] = useState(filtrosIniciais || {});

  useEffect(() => {
    setFiltros(filtrosIniciais || { status: 'Ativo' });
  }, [filtrosIniciais]);

  const setFiltro = (chave, valor) => {
    setFiltros(prev => ({ ...prev, [chave]: valor }));
  };

  const limparFiltros = () => {
    const filtrosPadrao = { status: 'Ativo' };
    setFiltros(filtrosPadrao);
    aoAplicar(filtrosPadrao);
    aoFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={aoFechar}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.titulo}>Filtrar Fornecedores</Text>
          {/* NOVO: Seção de Status */}
          <GrupoDeBotoes
            label="Status"
            opcoes={OPCOES_STATUS}
            selecionado={filtros.status || 'Ativo'}
            aoSelecionar={(id) => setFiltro('status', id)}
          />
          <View style={{height: 16}}/>
          <GrupoDeBotoes
            label="Tipo de Pessoa"
            opcoes={OPCOES_TIPO}
            selecionado={filtros.tipoPessoa || null}
            aoSelecionar={(id) => setFiltro('tipoPessoa', id)}
          />
          <View style={styles.footer}>
            <Botao titulo="Limpar" tipo="secundario" onPress={limparFiltros} />
            <View style={{width: tema.espacamento.medio}} />
            <Botao titulo="Aplicar Filtros" tipo="primario" onPress={() => aoAplicar(filtros)} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)', },
  modalContent: { backgroundColor: tema.cores.secundaria, padding: tema.espacamento.medio, borderTopLeftRadius: 16, borderTopRightRadius: 16, },
  titulo: { fontSize: tema.fontes.tamanhoGrande, fontWeight: 'bold', marginBottom: tema.espacamento.grande, textAlign: 'center', },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: tema.espacamento.grande, borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: tema.espacamento.medio, },
});

export default FiltrosModalFornecedores;
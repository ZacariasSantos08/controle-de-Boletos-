import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';

const OPCOES_TIPO = [
    { id: 'todos', nome: 'Todos', icone: 'users' },
    { id: 'Fisica', nome: 'Pessoa Física', icone: 'user' },
    { id: 'Juridica', nome: 'Pessoa Jurídica', icone: 'briefcase' },
];

// NOVO: Opções para o filtro de status
const OPCOES_STATUS = [
    { id: 'Ativo', nome: 'Ativos' },
    { id: 'Inativo', nome: 'Inativos' },
    { id: 'Todos', nome: 'Todos' },
];


const FiltrosModalClientes = ({ visivel, aoFechar, aoAplicar, filtrosIniciais }) => {
  const [filtros, setFiltros] = useState(filtrosIniciais || {});

  useEffect(() => {
    setFiltros(filtrosIniciais || {});
  }, [filtrosIniciais]);

  const setFiltro = (chave, valor) => {
    setFiltros(prev => ({ ...prev, [chave]: valor }));
  };

  const limparFiltros = () => {
    setFiltros({ status: 'Ativo' }); // Volta ao padrão de ver apenas ativos
    aoAplicar({ status: 'Ativo' });
    aoFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={aoFechar}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={aoFechar} />
      <SafeAreaView style={styles.containerModal}>
        <View style={styles.modalContent}>
          <View style={styles.headerModal}>
            <Text style={styles.titulo}>Filtrar Clientes</Text>
            <TouchableOpacity onPress={aoFechar} style={{ padding: 4 }}>
              <Feather name="x" size={24} color={tema.cores.cinza} />
            </TouchableOpacity>
          </View>
          
          <ScrollView>
            {/* NOVO: Seção para o filtro de status */}
            <View style={styles.secao}>
              <GrupoDeBotoes
                label="Status"
                opcoes={OPCOES_STATUS}
                selecionado={filtros.status || 'Ativo'}
                aoSelecionar={(id) => setFiltro('status', id)}
              />
            </View>

            <View style={styles.secao}>
              <GrupoDeBotoes
                label="Tipo de Pessoa"
                opcoes={OPCOES_TIPO}
                selecionado={filtros.tipoPessoa || 'todos'}
                aoSelecionar={(id) => setFiltro('tipoPessoa', id)}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Botao titulo="Limpar" tipo="secundario" onPress={limparFiltros} />
            <View style={{ width: tema.espacamento.medio }} />
            <Botao titulo="Aplicar Filtros" tipo="primario" onPress={() => aoAplicar(filtros)} />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', },
  containerModal: { backgroundColor: 'transparent', },
  modalContent: {
    backgroundColor: tema.cores.secundaria,
    padding: tema.espacamento.medio,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  headerModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: tema.espacamento.grande, },
  titulo: { fontSize: 24, fontWeight: 'bold', color: tema.cores.preto, textAlign: 'center', flex: 1, marginLeft: 28, },
  secao: { backgroundColor: tema.cores.branco, borderRadius: 12, padding: tema.espacamento.medio, marginBottom: tema.espacamento.medio, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: tema.espacamento.grande, borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: tema.espacamento.medio, },
});

export default FiltrosModalClientes;
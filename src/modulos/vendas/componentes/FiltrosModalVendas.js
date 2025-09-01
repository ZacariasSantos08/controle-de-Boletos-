import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import InputSelecao from '../../../componentes/InputSelecao';
import Botao from '../../../componentes/Botao';
import SeletorDeData from '../../../componentes/SeletorDeData';
import tema from '../../../estilos/tema';

const FORMAS_PAGAMENTO = [
    { id: 'Dinheiro', nome: 'Dinheiro' },
    { id: 'Cartão de Crédito', nome: 'Cartão de Crédito' },
    { id: 'Cartão de Débito', nome: 'Cartão de Débito' },
    { id: 'Pix', nome: 'Pix' },
];

const FiltrosModalVendas = ({ 
  visivel, 
  aoFechar, 
  aoAplicar, 
  filtrosIniciais,
  abrirModalDeSelecao
}) => {
  const [filtros, setFiltros] = useState(filtrosIniciais || {});

  useEffect(() => { setFiltros(filtrosIniciais || {}); }, [filtrosIniciais]);

  const setFiltro = (chave, valor) => {
    setFiltros(prev => ({ ...prev, [chave]: valor }));
  };
  
  const limparFiltros = () => {
    setFiltros({});
    aoAplicar({});
    aoFechar();
  };

  const getNome = (chave) => {
    if (!filtros[chave]) return null;
    return filtros[chave].nome || (filtros[chave].nomeFantasia || filtros[chave].razaoSocial);
  }

  return (
    <Modal visible={visivel} animationType="slide" transparent={true} onRequestClose={aoFechar}>
      <SafeAreaView style={styles.container}>
        <View style={styles.modalContent}>
          <Text style={styles.titulo}>Filtrar Vendas</Text>
          <ScrollView>
            <InputSelecao
              label="Cliente"
              valor={getNome('cliente')}
              placeholder="Todos os clientes"
              onPress={() => abrirModalDeSelecao('clientes')}
            />
            <InputSelecao
              label="Produto"
              valor={getNome('produto')}
              placeholder="Todos os produtos"
              onPress={() => abrirModalDeSelecao('produtos')}
            />
            <InputSelecao
              label="Fornecedor"
              valor={getNome('fornecedor')}
              placeholder="Todos os fornecedores"
              onPress={() => abrirModalDeSelecao('fornecedores')}
            />
            <InputSelecao
              label="Tipo de Pagamento"
              valor={getNome('tipoPagamento')}
              placeholder="Todos os tipos"
              onPress={() => abrirModalDeSelecao('tipoPagamento')}
            />
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
          </ScrollView>
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
    container: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: tema.cores.secundaria, padding: tema.espacamento.medio, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    titulo: { fontSize: tema.fontes.tamanhoGrande, fontWeight: 'bold', marginBottom: tema.espacamento.grande, textAlign: 'center' },
    containerDatas: { flexDirection: 'row', marginTop: tema.espacamento.medio },
    footer: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: tema.espacamento.grande, borderTopWidth: 1, borderTopColor: '#E0E0E0', marginTop: tema.espacamento.medio },
});

export default FiltrosModalVendas;
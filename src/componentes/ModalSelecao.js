import React from 'react';
import { Modal, View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, FlatList, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Botao from './Botao';
import tema from '../estilos/tema';

const ItemDaLista = ({ item, isSelecionado, onSelect, selecaoMultipla, renderItemNome }) => (
  <TouchableOpacity style={styles.itemContainer} onPress={onSelect}>
    <Text style={styles.itemModalTexto}>{renderItemNome ? renderItemNome(item) : item.nome}</Text>
    {selecaoMultipla && (
      <View style={[styles.checkboxBase, isSelecionado && styles.checkboxChecked]}>
        {isSelecionado && <Feather name="check" size={16} color="white" />}
      </View>
    )}
  </TouchableOpacity>
);

const ModalSelecao = ({
  visivel,
  titulo,
  dados,
  aoFechar,
  aoSelecionarItem,
  selecaoMultipla = false,
  itensSelecionados = [],
  aoConfirmarSelecaoMultipla,
  renderItemNome,
  itemKey = 'id',
  aoExcluirItem,
  aoAdicionarNovo,
  buscaValor,
  aoMudarBusca,
  placeholderBusca,
  desabilitarExclusao = false,
  desabilitarCriacao = false,
  desabilitarBusca = false,
}) => {
  const [selecionadosTemp, setSelecionadosTemp] = React.useState(itensSelecionados);

  React.useEffect(() => {
    if (visivel) {
      setSelecionadosTemp(itensSelecionados);
    }
  }, [visivel, itensSelecionados]);

  const handleSelectItem = (item) => {
    if (selecaoMultipla) {
      setSelecionadosTemp(prev => {
        const isSelecionado = prev.some(selecionado => selecionado[itemKey] === item[itemKey]);
        if (isSelecionado) {
          return prev.filter(selecionado => selecionado[itemKey] !== item[itemKey]);
        }
        return [...prev, item];
      });
    } else {
      aoSelecionarItem(item);
    }
  };

  const renderizarItem = ({ item }) => (
    <ItemDaLista
      item={item}
      isSelecionado={selecionadosTemp.some(selecionado => selecionado[itemKey] === item[itemKey])}
      onSelect={() => handleSelectItem(item)}
      selecaoMultipla={selecaoMultipla}
      renderItemNome={renderItemNome}
    />
  );

  const handleConfirmar = () => {
    if (aoConfirmarSelecaoMultipla) {
      aoConfirmarSelecaoMultipla(selecionadosTemp);
    }
    aoFechar();
  };

  const handleFechar = () => {
    setSelecionadosTemp(itensSelecionados); // Reseta para o estado inicial ao fechar
    aoFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={handleFechar}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitulo}>{titulo}</Text>
          <TouchableOpacity onPress={handleFechar}>
            <Feather name="x" size={30} color={tema.cores.cinza} />
          </TouchableOpacity>
        </View>
        {!desabilitarBusca && (
          <TextInput
            style={styles.buscaInput}
            placeholder={placeholderBusca || "Buscar..."}
            value={buscaValor}
            onChangeText={aoMudarBusca}
          />
        )}
        <FlatList
          data={dados}
          keyExtractor={(item) => item[itemKey]}
          renderItem={renderizarItem}
          ListEmptyComponent={<Text style={styles.listaVazia}>Nenhum item encontrado.</Text>}
        />
        {!desabilitarCriacao && (
          <TouchableOpacity style={styles.footerBotao} onPress={aoAdicionarNovo}>
            <Feather name="plus-circle" size={22} color={tema.cores.primaria} />
            <Text style={styles.footerBotaoTexto}>Adicionar Novo</Text>
          </TouchableOpacity>
        )}
        {selecaoMultipla && (
          <View style={styles.footerSelecaoMultipla}>
            <Botao titulo="Confirmar Seleção" onPress={handleConfirmar} />
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: tema.cores.secundaria },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: tema.espacamento.medio, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  modalTitulo: { fontSize: tema.fontes.tamanhoGrande, fontWeight: 'bold' },
  buscaInput: { height: 45, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, paddingHorizontal: tema.espacamento.medio, margin: tema.espacamento.medio, backgroundColor: tema.cores.branco },
  itemContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center', padding: tema.espacamento.medio },
  itemModalTexto: { flex: 1, fontSize: tema.fontes.tamanhoMedio },
  checkboxBase: { width: 24, height: 24, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: tema.cores.primaria, borderRadius: 4 },
  checkboxChecked: { backgroundColor: tema.cores.primaria },
  listaVazia: { textAlign: 'center', marginTop: 40, color: tema.cores.cinza },
  footerBotao: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: tema.espacamento.medio, borderTopWidth: 1, borderTopColor: '#DDD', backgroundColor: '#F8F8F8' },
  footerBotaoTexto: { marginLeft: tema.espacamento.pequeno, fontSize: tema.fontes.tamanhoMedio, color: tema.cores.primaria, fontWeight: 'bold' },
  footerSelecaoMultipla: { padding: tema.espacamento.medio, borderTopWidth: 1, borderTopColor: '#DDD' },
});

export default ModalSelecao;
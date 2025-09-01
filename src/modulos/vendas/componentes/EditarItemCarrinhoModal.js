import React, { useState, useEffect, useMemo } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import InputFormulario from '../../../componentes/InputFormulario';
import GrupoDeBotoes from '../../../componentes/GrupoDeBotoes';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarMoeda, desformatarParaCentavos } from '../../../utilitarios/formatadores';

const OPCOES_DESCONTO = [
    { id: 'R$', nome: 'R$' },
    { id: '%', nome: '%' },
];

const EditarItemCarrinhoModal = ({ visivel, aoFechar, item, onConfirmar }) => {
  if (!visivel || !item) return null;

  const [quantidade, setQuantidade] = useState(String(item.quantidade));
  const [tipoDesconto, setTipoDesconto] = useState(item.tipoDesconto || 'R$');
  const [valorDesconto, setValorDesconto] = useState(item.valorDescontoFormatado || '');

  useEffect(() => {
    setQuantidade(String(item.quantidade));
    setTipoDesconto(item.tipoDesconto || 'R$');
    setValorDesconto(item.valorDescontoFormatado || '');
  }, [item]);

  const subtotalItem = useMemo(() => item.valorVenda * (parseInt(quantidade, 10) || 0), [item, quantidade]);

  // CORREÇÃO: Lógica de cálculo de desconto em % ajustada
  const totalDesconto = useMemo(() => {
    if (tipoDesconto === 'R$') {
      return desformatarParaCentavos(valorDesconto) / 100;
    }
    if (tipoDesconto === '%') {
      const percentual = parseFloat(String(valorDesconto).replace(',', '.')) || 0;
      return subtotalItem * (percentual / 100);
    }
    return 0;
  }, [valorDesconto, tipoDesconto, subtotalItem]);
  
  const totalFinalItem = useMemo(() => subtotalItem - totalDesconto, [subtotalItem, totalDesconto]);

  const handleMudarQuantidade = (texto) => {
    const numeros = texto.replace(/[^0-9]/g, '');
    if (numeros === '') {
      setQuantidade('');
      return;
    }

    const novaQtd = parseInt(numeros, 10);
    
    if (novaQtd > item.estoqueDisponivel) {
      Alert.alert(
        "Estoque máximo atingido", 
        `A quantidade não pode exceder o estoque disponível (${item.estoqueDisponivel}).`
      );
      setQuantidade(String(item.estoqueDisponivel));
    } else {
      setQuantidade(numeros);
    }
  };
  
  const handleBlurQuantidade = () => {
    const qtdNum = parseInt(quantidade, 10);
    if (isNaN(qtdNum) || qtdNum <= 0) {
      setQuantidade('1');
    }
  };

  const handleConfirmar = () => {
    const quantidadeFinal = Math.max(1, parseInt(quantidade, 10) || 1);
    const valorDescontoFinal = tipoDesconto === 'R$'
        ? desformatarParaCentavos(valorDesconto) / 100
        : parseFloat(String(valorDesconto).replace(',', '.')) || 0;

    onConfirmar({
      ...item,
      quantidade: quantidadeFinal,
      tipoDesconto,
      valorDesconto: valorDescontoFinal,
      valorDescontoFormatado: valorDesconto,
    });
    aoFechar();
  };

  const handleAumentarQtd = () => {
    const qtdAtual = parseInt(quantidade || '0', 10);
    if (qtdAtual + 1 > item.estoqueDisponivel) {
      Alert.alert("Estoque máximo atingido", `A quantidade não pode exceder o estoque disponível (${item.estoqueDisponivel}).`);
    } else {
      setQuantidade(String(qtdAtual + 1));
    }
  };

  const handleDiminuirQtd = () => {
    setQuantidade(q => String(Math.max(1, parseInt(q || '1', 10) - 1)));
  };

  return (
    <Modal visible={visivel} animationType="fade" transparent={true} onRequestClose={aoFechar}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.titulo} numberOfLines={1}>{item.nome}</Text>
          <Text style={styles.subtitulo}>Preço Unitário: {formatarMoeda(item.valorVenda * 100)}</Text>

          <View style={styles.secao}>
            <Text style={styles.label}>Quantidade (Estoque: {item.estoqueDisponivel})</Text>
            <View style={styles.controleQtdContainer}>
              <TouchableOpacity onPress={handleDiminuirQtd} style={styles.botaoQtd}>
                <Feather name="minus" size={24} color={tema.cores.primaria} />
              </TouchableOpacity>
              <TextInput
                style={styles.textoQtdInput}
                value={quantidade}
                onChangeText={handleMudarQuantidade}
                onBlur={handleBlurQuantidade}
                keyboardType="numeric"
                textAlign="center"
              />
              <TouchableOpacity onPress={handleAumentarQtd} style={styles.botaoQtd}>
                <Feather name="plus" size={24} color={tema.cores.primaria} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.secao}>
            <GrupoDeBotoes
              label="Tipo de Desconto"
              opcoes={OPCOES_DESCONTO}
              selecionado={tipoDesconto}
              aoSelecionar={setTipoDesconto}
            />
            <InputFormulario
              label="Valor do Desconto"
              valor={valorDesconto}
              aoMudarTexto={setValorDesconto}
              tipoTeclado="numeric"
              formatador={tipoDesconto === 'R$' ? formatarMoeda : (val) => val.replace(/[^0-9,.]/g, '')}
              placeholder={tipoDesconto === 'R$' ? 'R$ 0,00' : '0'}
            />
          </View>
          
          <View style={styles.resumoContainer}>
            <Text style={styles.resumoLabel}>Total do Item</Text>
            <Text style={styles.resumoValor}>{formatarMoeda(totalFinalItem * 100)}</Text>
          </View>
          
          <View style={styles.botoesContainer}>
            <Botao titulo="Cancelar" tipo="secundario" onPress={aoFechar} />
            <View style={{width: 8}} />
            <Botao titulo="Confirmar" tipo="primario" onPress={handleConfirmar} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContainer: { width: '90%', backgroundColor: tema.cores.branco, borderRadius: 12, padding: tema.espacamento.grande },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: tema.cores.preto },
    subtitulo: { fontSize: 14, color: tema.cores.cinza, textAlign: 'center', marginBottom: tema.espacamento.grande },
    secao: { marginVertical: tema.espacamento.medio },
    label: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.preto, fontWeight: 'bold', marginBottom: 8 },
    controleQtdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: tema.cores.cinzaClaro,
        borderRadius: 8,
        alignSelf: 'center',
    },
    botaoQtd: {
        padding: tema.espacamento.medio,
    },
    textoQtdInput: {
        fontSize: 22, 
        fontWeight: 'bold', 
        width: 100, 
        paddingVertical: tema.espacamento.pequeno,
        color: tema.cores.preto,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: tema.cores.cinzaClaro,
    },
    resumoContainer: { backgroundColor: tema.cores.secundaria, padding: tema.espacamento.medio, borderRadius: 8, marginTop: tema.espacamento.grande, alignItems: 'center' },
    resumoLabel: { color: tema.cores.cinza, fontWeight: 'bold' },
    resumoValor: { fontSize: 24, fontWeight: 'bold', color: tema.cores.preto, marginTop: 4 },
    botoesContainer: { flexDirection: 'row', marginTop: tema.espacamento.grande },
});

export default EditarItemCarrinhoModal;
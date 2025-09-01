import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Alert, Button } from 'react-native';
import InputFormulario from '../../../componentes/InputFormulario';
import InputSelecao from '../../../componentes/InputSelecao';
import ModalSelecao from '../../../componentes/ModalSelecao';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarMoeda, desformatarParaCentavos } from '../../../utilitarios/formatadores';

const FORMAS_PAGAMENTO = [
  { id: 'Dinheiro', nome: 'Dinheiro' },
  { id: 'Pix', nome: 'Pix' },
  { id: 'Cartão de Débito', nome: 'Cartão de Débito' },
  { id: 'Cartão de Crédito', nome: 'Cartão de Crédito' },
];

const BaixaPagamentoModal = ({ visivel, aoFechar, aoConfirmar, conta }) => {
  if (!conta) return null;

  const valorRestante = conta.valorTotal - conta.valorPago;
  const valorRestanteEmCentavos = Math.round(valorRestante * 100);

  const [forma, setForma] = useState(FORMAS_PAGAMENTO[0]);
  const [valor, setValor] = useState('');
  const [modalFormasVisivel, setModalFormasVisivel] = useState(false);

  const lidarComConfirmacao = () => {
    const valorEmCentavos = desformatarParaCentavos(valor);

    if (valorEmCentavos <= 0) {
      Alert.alert('Valor inválido', 'O valor do pagamento deve ser maior que zero.');
      return;
    }
    if (valorEmCentavos > valorRestanteEmCentavos) {
      Alert.alert('Valor excedido', `O valor não pode ser maior que o saldo devedor (${formatarMoeda(valorRestanteEmCentavos)}).`);
      return;
    }

    aoConfirmar(valorEmCentavos / 100, forma.id);
    setValor('');
    setForma(FORMAS_PAGAMENTO[0]);
    aoFechar();
  };

  const autoPreencherValor = () => {
    setValor(formatarMoeda(valorRestanteEmCentavos));
  };

  return (
    <>
      <Modal visible={visivel} animationType="fade" transparent={true} onRequestClose={aoFechar}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.titulo}>Registrar Pagamento</Text>
            <Text style={styles.subtitulo}>
              Saldo devedor: <Text style={{fontWeight: 'bold'}}>{formatarMoeda(valorRestanteEmCentavos)}</Text>
            </Text>
            
            <InputSelecao
              label="Forma de Pagamento"
              valor={forma.nome}
              onPress={() => setModalFormasVisivel(true)}
            />
            <InputFormulario
              label="Valor Recebido"
              valor={valor}
              aoMudarTexto={setValor}
              tipoTeclado="numeric"
              formatador={formatarMoeda}
            />
            <View style={{marginVertical: 4}}>
              <Button title="Usar saldo devedor" onPress={autoPreencherValor} color={tema.cores.cinza}/>
            </View>

            <View style={styles.botoesContainer}>
              <Botao titulo="Cancelar" tipo="secundario" onPress={aoFechar} />
              <View style={{width: 8}} />
              <Botao titulo="Confirmar" tipo="primario" onPress={lidarComConfirmacao} />
            </View>
          </View>
        </View>
      </Modal>

      <ModalSelecao
        visivel={modalFormasVisivel}
        titulo="Forma de Pagamento"
        dados={FORMAS_PAGAMENTO}
        aoFechar={() => setModalFormasVisivel(false)}
        aoSelecionarItem={(item) => {
            setForma(item);
            setModalFormasVisivel(false);
        }}
        desabilitarBusca desabilitarCriacao desabilitarExclusao
      />
    </>
  );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    modalContainer: { width: '90%', backgroundColor: tema.cores.branco, borderRadius: 12, padding: tema.espacamento.grande },
    titulo: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: tema.cores.preto, marginBottom: 4 },
    subtitulo: { fontSize: 16, color: tema.cores.cinza, textAlign: 'center', marginBottom: tema.espacamento.grande },
    botoesContainer: { flexDirection: 'row', marginTop: tema.espacamento.grande },
});

export default BaixaPagamentoModal;
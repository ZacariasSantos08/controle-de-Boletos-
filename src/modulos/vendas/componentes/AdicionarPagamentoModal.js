import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Alert, Button } from 'react-native';
import InputSelecao from '../../../componentes/InputSelecao';
import InputFormulario from '../../../componentes/InputFormulario';
import ModalSelecao from '../../../componentes/ModalSelecao';
import Botao from '../../../componentes/Botao';
import tema from '../../../estilos/tema';
import { formatarMoeda, desformatarParaCentavos } from '../../../utilitarios/formatadores';

const FORMAS_PAGAMENTO = [
  { id: 'Dinheiro', nome: 'Dinheiro' },
  { id: 'Pix', nome: 'Pix' },
  { id: 'Cartão de Débito', nome: 'Cartão de Débito' },
  { id: 'Cartão de Crédito', nome: 'Cartão de Crédito' },
  { id: 'A Prazo (Promissória)', nome: 'A Prazo (Promissória)' },
];

const AdicionarPagamentoModal = ({ visivel, aoFechar, aoAdicionar, valorRestante }) => {
  const [forma, setForma] = useState(FORMAS_PAGAMENTO[0]);
  const [valor, setValor] = useState('');
  const [parcelas, setParcelas] = useState('1');
  const [modalFormasVisivel, setModalFormasVisivel] = useState(false);

  const valorRestanteEmCentavos = Math.round(valorRestante * 100);

  const lidarComAdicionar = () => {
    const valorEmCentavos = desformatarParaCentavos(valor);

    if (valorEmCentavos <= 0) {
      Alert.alert('Valor inválido', 'O valor do pagamento deve ser maior que zero.');
      return;
    }
    if (valorEmCentavos > valorRestanteEmCentavos) {
      Alert.alert('Valor excedido', `O valor não pode ser maior que o restante a pagar (${formatarMoeda(valorRestanteEmCentavos)}).`);
      return;
    }
    
    aoAdicionar({
      forma: forma.id,
      valor: valorEmCentavos / 100,
      parcelas: parseInt(parcelas, 10) || 1,
    });

    setValor('');
    setParcelas('1');
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
            <Text style={styles.titulo}>Adicionar Pagamento</Text>
            <Text style={styles.subtitulo}>
              Restante a pagar: <Text style={{fontWeight: 'bold'}}>{formatarMoeda(valorRestanteEmCentavos)}</Text>
            </Text>
            
            <InputSelecao
              label="Forma de Pagamento"
              valor={forma.nome}
              onPress={() => setModalFormasVisivel(true)}
            />

            {forma.id === 'A Prazo (Promissória)' && (
              <InputFormulario
                label="Número de Parcelas"
                valor={parcelas}
                aoMudarTexto={(txt) => setParcelas(txt.replace(/[^0-9]/g, ''))}
                tipoTeclado="numeric"
              />
            )}

            <InputFormulario
              label="Valor a Pagar"
              valor={valor}
              aoMudarTexto={setValor}
              tipoTeclado="numeric"
              formatador={formatarMoeda}
            />
            <View style={{marginVertical: 4}}>
              <Button title="Usar valor restante" onPress={autoPreencherValor} color={tema.cores.cinza}/>
            </View>

            <View style={styles.botoesContainer}>
              <Botao titulo="Cancelar" tipo="secundario" onPress={aoFechar} />
              <View style={{width: 8}} />
              <Botao titulo="Confirmar" tipo="primario" onPress={lidarComAdicionar} />
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

export default AdicionarPagamentoModal;
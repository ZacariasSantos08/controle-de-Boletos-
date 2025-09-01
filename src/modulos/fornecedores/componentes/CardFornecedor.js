import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';
import { formatarTelefone } from '../../../utilitarios/formatadores';

const CardFornecedor = ({ 
  fornecedor, 
  aoPressionar, 
  aoPressionarLongo,
  isSelecionado,
  selectionModeAtivo 
}) => {
  const nome = fornecedor.tipoPessoa === 'Física' 
    ? fornecedor.nomeCompleto 
    : (fornecedor.nomeFantasia || fornecedor.razaoSocial);
  
  const identificadorLabel = fornecedor.tipoPessoa === 'Física' ? 'CPF' : 'CNPJ';
  const identificadorValor = fornecedor.cpf || fornecedor.cnpj || 'Não informado';
  const contatoPrincipal = fornecedor.telefone ? formatarTelefone(fornecedor.telefone) : fornecedor.email;
  const iconeContato = fornecedor.telefone ? 'phone' : 'mail';

  return (
    <TouchableOpacity 
      style={[styles.card, isSelecionado && styles.cardSelecionada]} 
      onPress={aoPressionar}
      onLongPress={aoPressionarLongo}
      delayLongPress={300}
    >
      <View style={styles.iconeContainer}>
        <Feather name="truck" size={24} color={tema.cores.primaria} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.nome} numberOfLines={1}>{nome}</Text>
        
        <Text style={styles.identificador}>
          {identificadorLabel}: {identificadorValor}
        </Text>

        {contatoPrincipal && (
          <View style={styles.contatoContainer}>
            <Feather name={iconeContato} size={14} color={tema.cores.cinza} />
            <Text style={styles.contatoTexto}>{contatoPrincipal}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.ladoDireito}>
        {/* NOVO: Status do Fornecedor */}
        <View style={[styles.statusBadge, styles.ativo]}>
          <Text style={styles.statusTexto}>{fornecedor.status || 'Ativo'}</Text>
        </View>

        {selectionModeAtivo ? (
          <View style={[styles.checkboxBase, isSelecionado && styles.checkboxChecked]}>
              {isSelecionado && <Feather name="check" size={18} color="white" />}
          </View>
        ) : (
          <View style={styles.containerChevron}>
              <Feather name="chevron-right" size={24} color={tema.cores.cinza} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 12,
    padding: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelecionada: {
    borderColor: tema.cores.primaria,
    backgroundColor: '#F3E9F9',
  },
  iconeContainer: {
    backgroundColor: '#F3E9F9',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tema.espacamento.medio,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nome: {
    fontSize: 17,
    fontWeight: 'bold',
    color: tema.cores.preto,
    marginBottom: 4,
  },
  identificador: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
    marginBottom: 6,
  },
  contatoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contatoTexto: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
    marginLeft: 6,
  },
  ladoDireito: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  ativo: {
    backgroundColor: '#E6F4EA',
  },
  statusTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  containerChevron: {
    paddingTop: 8,
  },
  checkboxBase: { 
    width: 26, 
    height: 26, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 2, 
    borderColor: tema.cores.primaria, 
    borderRadius: 13,
    backgroundColor: '#fff',
    marginTop: 8,
  },
  checkboxChecked: { 
    backgroundColor: tema.cores.primaria 
  },
});

export default CardFornecedor;
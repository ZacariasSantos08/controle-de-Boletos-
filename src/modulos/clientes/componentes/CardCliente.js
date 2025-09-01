import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import tema from '../../../estilos/tema';
import { formatarTelefone } from '../../../utilitarios/formatadores';

const CardCliente = ({ cliente, aoPressionar, aoPressionarLongo, isSelecionado, selectionModeAtivo }) => {
  const nome = cliente.tipoPessoa === 'Fisica' 
    ? cliente.detalhesPessoaFisica?.nomeCompleto
    : cliente.detalhesPessoaJuridica?.razaoSocial;
  
  const identificador = cliente.tipoPessoa === 'Fisica' 
    ? cliente.detalhesPessoaFisica?.cpf
    : cliente.detalhesPessoaJuridica?.cnpj;

  // NOVO: Lógica para pegar o contato principal
  const contatoPrincipal = cliente.telefones?.[0]?.numero 
    ? formatarTelefone(cliente.telefones[0].numero) 
    : cliente.email;
  const iconeContato = cliente.telefones?.[0]?.numero ? 'phone' : 'mail';

  const cardStyle = [
    styles.card,
    isSelecionado && styles.cardSelecionado
  ];

  return (
    <TouchableOpacity 
      style={cardStyle} 
      onPress={aoPressionar}
      onLongPress={aoPressionarLongo}
      delayLongPress={300}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.nome} numberOfLines={1}>{nome || 'Nome não informado'}</Text>
        <Text style={styles.identificador}>{identificador || 'Não informado'}</Text>
        
        {/* NOVO: Exibição do contato principal */}
        {contatoPrincipal && (
          <View style={styles.contatoContainer}>
            <Feather name={iconeContato} size={14} color={tema.cores.cinza} />
            <Text style={styles.contatoTexto}>{contatoPrincipal}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.ladoDireito}>
        <View style={[styles.statusBadge, cliente.status === 'Ativo' ? styles.ativo : styles.inativo]}>
          <Text style={styles.statusTexto}>{cliente.status}</Text>
        </View>
        {selectionModeAtivo && (
          <View style={[styles.checkbox, isSelecionado && styles.checkboxSelecionado]}>
            {isSelecionado && <Feather name="check" size={16} color={tema.cores.branco} />}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tema.cores.branco,
    borderRadius: 8,
    paddingVertical: tema.espacamento.medio,
    paddingHorizontal: tema.espacamento.medio,
    marginBottom: tema.espacamento.medio,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelecionado: {
    backgroundColor: '#E9F7FF',
    borderColor: tema.cores.primaria,
  },
  infoContainer: {
    flex: 1,
  },
  nome: {
    fontSize: tema.fontes.tamanhoMedio,
    fontWeight: 'bold',
    color: tema.cores.preto,
    marginBottom: 4,
  },
  identificador: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
  },
  contatoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  contatoTexto: {
    fontSize: tema.fontes.tamanhoPequeno,
    color: tema.cores.cinza,
    marginLeft: 6,
  },
  ladoDireito: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    paddingLeft: tema.espacamento.medio,
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
  inativo: {
    backgroundColor: '#FDEBEB',
  },
  statusTexto: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: tema.cores.cinza,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  checkboxSelecionado: {
    backgroundColor: tema.cores.primaria,
    borderColor: tema.cores.primaria,
  },
});

export default CardCliente;
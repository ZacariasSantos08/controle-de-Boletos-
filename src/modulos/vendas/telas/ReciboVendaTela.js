import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { formatarData, formatarMoeda, formatarCEP } from '../../../utilitarios/formatadores';
import { carregarConfiguracoes } from '../../../api/configuracoes.api';
import tema from '../../../estilos/tema';
import Botao from '../../../componentes/Botao';

const LinhaDetalhe = ({ label, valor, destaque = false }) => (
    <View style={styles.linhaDetalhe}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.valor, destaque && styles.valorDestaque]}>{valor}</Text>
    </View>
);

// NOVO: Função para formatar o endereço do cliente de forma limpa
const formatarEndereco = (endereco) => {
  if (!endereco || !endereco.logradouro) return null;
  
  let endCompleto = `${endereco.logradouro}, ${endereco.numero || 'S/N'}`;
  if (endereco.complemento) endCompleto += ` - ${endereco.complemento}`;
  endCompleto += `\n${endereco.bairro}, ${endereco.cidade} - ${endereco.estado}`;
  if (endereco.cep) endCompleto += `\nCEP: ${formatarCEP(endereco.cep)}`;
  
  return endCompleto;
};


const ReciboVendaTela = ({ route, navigation }) => {
  const { venda } = route.params;
  const [configEmpresa, setConfigEmpresa] = useState(null);
  const enderecoClienteFormatado = formatarEndereco(venda.clienteSnapshot.endereco);

  useEffect(() => {
    const carregarDadosEmpresa = async () => {
      const dados = await carregarConfiguracoes();
      setConfigEmpresa(dados);
    };
    carregarDadosEmpresa();
  }, []);

  const lidarCompartilhar = async () => {
    let reciboTexto = `**Recibo da Venda: ${venda.codigoVenda}**\n\n`;
    
    if (configEmpresa) {
      reciboTexto += `**${configEmpresa.nomeEmpresa}**\n`;
      reciboTexto += `${configEmpresa.endereco}\n\n`;
    }

    reciboTexto += `Data: ${formatarData(venda.dataEmissao)}\n`;
    reciboTexto += `Cliente: ${venda.clienteSnapshot.nome}\n`;
    // ALTERADO: Adiciona o endereço do cliente ao texto compartilhado
    if (enderecoClienteFormatado) {
      reciboTexto += `${enderecoClienteFormatado}\n`;
    }
    reciboTexto += '\n**ITENS**\n';

    venda.itens.forEach(item => {
        const totalItem = item.quantidade * item.valorUnitarioSnapshot;
        reciboTexto += `${item.quantidade}x ${item.descricaoSnapshot} - ${formatarMoeda(totalItem * 100)}\n`;
    });

    reciboTexto += '\n**RESUMO**\n';
    reciboTexto += `Subtotal: ${formatarMoeda(venda.subtotalProdutos * 100)}\n`;
    if (venda.descontoTotal > 0) {
        reciboTexto += `Desconto: - ${formatarMoeda(venda.descontoTotal * 100)}\n`;
    }
    reciboTexto += `**TOTAL: ${formatarMoeda(venda.valorTotalVenda * 100)}**\n\n`;
    
    reciboTexto += '**PAGAMENTOS**\n';
    venda.pagamentos.forEach(p => {
        reciboTexto += `${p.forma}: ${formatarMoeda(p.valor * 100)}\n`;
    });

    try {
        await Sharing.shareAsync(reciboTexto, { dialogTitle: 'Compartilhar Recibo' });
    } catch (error) {
        console.error('Erro ao compartilhar:', error);
    }
  };
  
  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerRight: () => (
            <TouchableOpacity onPress={lidarCompartilhar} style={{ marginRight: 16 }}>
                <Feather name="share-2" size={24} color={tema.cores.branco} />
            </TouchableOpacity>
        )
    });
  }, [navigation, venda, configEmpresa]);

  const renderItem = ({ item }) => {
    const totalItem = item.quantidade * item.valorUnitarioSnapshot;
    return (
        <View style={styles.itemLinha}>
            <Text style={styles.itemQuantidade}>{item.quantidade}x</Text>
            <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.descricaoSnapshot}</Text>
                <Text style={styles.itemPrecoUnitario}>{formatarMoeda(item.valorUnitarioSnapshot * 100)} cada</Text>
            </View>
            <Text style={styles.itemTotal}>{formatarMoeda(totalItem * 100)}</Text>
        </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {configEmpresa && (
        <View style={styles.cabecalhoEmpresa}>
          {configEmpresa.logoUri && (
            <Image source={{ uri: configEmpresa.logoUri }} style={styles.logo} />
          )}
          <Text style={styles.nomeEmpresa}>{configEmpresa.nomeEmpresa}</Text>
          <Text style={styles.enderecoEmpresa}>{configEmpresa.endereco}</Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Detalhes da Venda</Text>
        <LinhaDetalhe label="Código" valor={venda.codigoVenda} destaque />
        <View style={styles.linhaDetalhe}>
            <Text style={styles.label}>Cliente</Text>
            {/* ALTERADO: Exibição do endereço do cliente */}
            <View style={styles.valorClienteContainer}>
                <Text style={[styles.valor, {textAlign: 'right'}]}>{venda.clienteSnapshot.nome}</Text>
                {enderecoClienteFormatado && (
                    <Text style={styles.enderecoCliente}>{enderecoClienteFormatado}</Text>
                )}
            </View>
        </View>
        <LinhaDetalhe label="Data de Emissão" valor={formatarData(venda.dataEmissao)} />
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Itens</Text>
        <FlatList data={venda.itens} keyExtractor={(item) => item.produtoId} renderItem={renderItem} scrollEnabled={false} />
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Resumo Financeiro</Text>
        <LinhaDetalhe label="Subtotal" valor={formatarMoeda(venda.subtotalProdutos * 100)} />
        {venda.descontoTotal > 0 && <LinhaDetalhe label="Desconto no Total" valor={`- ${formatarMoeda(venda.descontoTotal * 100)}`} />}
        <View style={styles.divisor} />
        <LinhaDetalhe label="VALOR TOTAL" valor={formatarMoeda(venda.valorTotalVenda * 100)} destaque />
        
        {venda.pagamentos.map((p, index) => (
            <LinhaDetalhe key={index} label={`Pagamento (${p.forma})`} valor={formatarMoeda(p.valor * 100)} />
        ))}
      </View>

      <View style={styles.footer}>
        <Botao titulo="Nova Venda" onPress={() => navigation.popToTop()} icone="shopping-cart" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria, padding: tema.espacamento.medio },
    cabecalhoEmpresa: { alignItems: 'center', marginBottom: tema.espacamento.grande, padding: tema.espacamento.medio, backgroundColor: tema.cores.branco, borderRadius: 12, },
    logo: { width: 80, height: 80, borderRadius: 40, marginBottom: tema.espacamento.medio, },
    nomeEmpresa: { fontSize: 20, fontWeight: 'bold', color: tema.cores.preto, },
    enderecoEmpresa: { fontSize: 14, color: tema.cores.cinza, textAlign: 'center', marginTop: 4, },
    card: { backgroundColor: tema.cores.branco, borderRadius: 12, padding: tema.espacamento.medio, marginBottom: tema.espacamento.medio, elevation: 2 },
    tituloCard: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: tema.cores.preto },
    linhaDetalhe: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#EEE' },
    label: { fontSize: 16, color: tema.cores.cinza, alignSelf: 'flex-start' },
    valor: { fontSize: 16, color: tema.cores.preto, fontWeight: '500' },
    valorDestaque: { fontWeight: 'bold', color: tema.cores.primaria },
    valorClienteContainer: { flex: 1, alignItems: 'flex-end', marginLeft: 8 },
    enderecoCliente: { fontSize: 14, color: tema.cores.cinza, textAlign: 'right', marginTop: 4, lineHeight: 20 },
    itemLinha: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#EEE', alignItems: 'center' },
    itemQuantidade: { fontSize: 16, fontWeight: 'bold', color: tema.cores.primaria, marginRight: 12 },
    itemInfo: { flex: 1 },
    itemNome: { fontSize: 16, color: tema.cores.preto },
    itemPrecoUnitario: { fontSize: 14, color: tema.cores.cinza },
    itemTotal: { fontSize: 16, fontWeight: 'bold' },
    divisor: { height: 1, backgroundColor: '#EEE', marginVertical: 8 },
    footer: { marginTop: tema.espacamento.medio, marginBottom: tema.espacamento.grande },
});

export default ReciboVendaTela;
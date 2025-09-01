import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CardFormulario from '../../../../componentes/CardFormulario';
import InputFormulario from '../../../../componentes/InputFormulario';
import InputSelecao from '../../../../componentes/InputSelecao';
// NOVO: Importa o GrupoDeBotoes para o seletor de status
import GrupoDeBotoes from '../../../../componentes/GrupoDeBotoes';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import tema from '../../../../estilos/tema';

const CampoDisplay = ({ label, valor }) => (
  <View style={styles.campoDisplayContainer}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.valorDisplay}>{valor}</Text>
  </View>
);

const CardInfoGerais = () => {
  const { modoEdicao, produtoParaEditar, form, setFormField, setModalSelecao, erros } = useFormularioProduto();
  
  const nomeFornecedor = form.fornecedor 
    ? (form.fornecedor.nomeFantasia || form.fornecedor.razaoSocial) 
    : null;

  return (
    <CardFormulario titulo="Informações Gerais" icone="clipboard">
      {modoEdicao && produtoParaEditar && (
        <CampoDisplay label="Código do Produto" valor={produtoParaEditar.codigoProduto} />
      )}
      
      <InputFormulario 
        label="Nome do Produto *" 
        valor={form.nome} 
        aoMudarTexto={val => setFormField('nome', val)}
        placeholder="Ex: Camiseta Básica Branca"
        erro={erros.nome}
      />
      <InputSelecao 
        label="Categoria *" 
        valor={form.categoria?.nome} 
        placeholder="Selecione uma categoria" 
        onPress={() => setModalSelecao({ visivel: true, tipo: 'categorias' })} 
        erro={erros.categoria}
      />
      
      <InputSelecao 
        label="Fornecedor" 
        valor={nomeFornecedor}
        placeholder="Selecione um fornecedor" 
        onPress={() => setModalSelecao({ visivel: true, tipo: 'fornecedores' })} 
      />

      <InputSelecao 
        label="Tipo de Unidade *" 
        valor={form.tipoUnidade?.nome} 
        placeholder="Selecione uma unidade" 
        onPress={() => setModalSelecao({ visivel: true, tipo: 'tiposUnidade' })} 
        erro={erros.tipoUnidade}
      />
      <InputSelecao 
        label="Marca *" 
        valor={form.marca?.nome} 
        placeholder="Selecione uma marca" 
        onPress={() => setModalSelecao({ visivel: true, tipo: 'marcas' })} 
      />
      <InputFormulario 
        label="Código de Barras" 
        valor={form.codigoDeBarras} 
        aoMudarTexto={val => setFormField('codigoDeBarras', val)} 
        tipoTeclado="numeric"
        placeholder="Ex: 7891234567890"
      />
      <InputFormulario 
        label="Observações" 
        valor={form.observacao} 
        aoMudarTexto={val => setFormField('observacao', val)} 
        multiline 
        numberOfLines={4}
        placeholder="Detalhes sobre o produto, cuidados, etc."
      />

      {/* NOVO: Seletor de Status visível apenas no modo de edição */}
      {modoEdicao && (
        <>
          <View style={styles.divisor} />
          <GrupoDeBotoes 
            label="Status"
            opcoes={[{id: 'Ativo', nome: 'Ativo'}, {id: 'Inativo', nome: 'Inativo'}]}
            selecionado={form.status}
            aoSelecionar={(val) => setFormField('status', val)}
          />
        </>
      )}
    </CardFormulario>
  );
};

const styles = StyleSheet.create({
  campoDisplayContainer: { width: '100%', marginBottom: tema.espacamento.medio },
  label: { fontSize: tema.fontes.tamanhoPequeno, color: tema.cores.preto, marginBottom: tema.espacamento.pequeno / 2, fontWeight: 'bold' },
  valorDisplay: { 
    backgroundColor: '#F0F1F5',
    borderRadius: 8, 
    paddingHorizontal: tema.espacamento.medio, 
    paddingVertical: 12, 
    fontSize: tema.fontes.tamanhoMedio, 
    color: '#555', 
    minHeight: 49,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  // NOVO: Estilo para o divisor
  divisor: {
    height: 1,
    backgroundColor: tema.cores.secundaria,
    marginVertical: tema.espacamento.medio,
  },
});

export default CardInfoGerais;
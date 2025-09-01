import React from 'react';
import ModalSelecao from '../../../../componentes/ModalSelecao';
import ModalCriacaoAtributo from '../../../../componentes/ModalCriacaoAtributo';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';

const ModaisFormularioProduto = () => {
  const {
    listas, modalSelecao, setModalSelecao, modalCriacao, setModalCriacao,
    lidarSelecionarAtributo, lidarExcluirAtributo,
    lidarAbrirCriacao, lidarSalvarNovoAtributo,
  } = useFormularioProduto();

  const getDadosModal = () => {
    const { tipo, busca } = modalSelecao;
    const termo = (busca || '').toLowerCase();
    const lista = listas[tipo] || [];
    if (!termo) return lista;

    return lista.filter(item => {
      if (tipo === 'fornecedores') {
        const nomeFornecedor = (item.nomeFantasia || item.razaoSocial || '').toLowerCase();
        return nomeFornecedor.includes(termo);
      }
      return (item.nome || '').toLowerCase().includes(termo);
    });
  };

  const getTituloModal = () => {
    const titulos = {
      categorias: 'Categoria', tiposUnidade: 'Tipo de Unidade',
      marcas: 'Marca', colecoes: 'Coleção',
      fornecedores: 'Fornecedor',
    };
    return titulos[modalSelecao.tipo] || '';
  };

  const renderItemNome = (item) => {
    if(modalSelecao.tipo === 'fornecedores'){
        return item.nomeFantasia || item.razaoSocial;
    }
    return item.nome;
  }

  return (
    <>
      {modalSelecao.visivel && (
        <ModalSelecao
          visivel={modalSelecao.visivel}
          titulo={`Selecionar ${getTituloModal()}`}
          dados={getDadosModal()}
          aoFechar={() => setModalSelecao({ visivel: false, tipo: null, busca: '' })}
          aoSelecionarItem={lidarSelecionarAtributo}
          aoExcluirItem={lidarExcluirAtributo}
          aoAdicionarNovo={lidarAbrirCriacao}
          buscaValor={modalSelecao.busca}
          aoMudarBusca={(texto) => setModalSelecao(prev => ({ ...prev, busca: texto }))}
          placeholderBusca={`Buscar em ${getTituloModal()}s...`}
          renderItemNome={renderItemNome}
          itemKey="id"
          desabilitarExclusao={modalSelecao.tipo !== 'categorias' && modalSelecao.tipo !== 'marcas'}
          desabilitarCriacao={modalSelecao.tipo !== 'categorias' && modalSelecao.tipo !== 'marcas' && modalSelecao.tipo !== 'fornecedores'}
        />
      )}
      {modalCriacao.visivel && (
        <ModalCriacaoAtributo
          visivel={modalCriacao.visivel}
          titulo={`Adicionar Nova ${getTituloModal()}`}
          aoFechar={() => setModalCriacao({ visivel: false, tipo: null })}
          aoSalvar={lidarSalvarNovoAtributo}
        />
      )}
    </>
  );
};

export default ModaisFormularioProduto;
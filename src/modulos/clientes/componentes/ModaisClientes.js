// CÓDIGO NOVO
import React from 'react';
import ModalSelecao from '../../../componentes/ModalSelecao';
import FiltrosModalClientes from './FiltrosModalClientes';

const ModaisClientes = ({ hook, aplicarFiltros }) => {
  const opcoesOrdenacao = [
    { id: 'nome_asc', nome: 'Nome (A-Z)', campo: 'nomeCompleto', direcao: 'asc' },
    { id: 'nome_desc', nome: 'Nome (Z-A)', campo: 'nomeCompleto', direcao: 'desc' },
  ];

  return (
    <>
      <FiltrosModalClientes
        visivel={hook.filtrosModalVisivel}
        aoFechar={() => hook.setFiltrosModalVisivel(false)}
        aoAplicar={aplicarFiltros}
        filtrosIniciais={hook.filtrosAtivos}
      />

      <ModalSelecao
        visivel={hook.ordenacaoModalVisivel}
        titulo="Ordenar Por"
        dados={opcoesOrdenacao}
        aoFechar={() => hook.setOrdenacaoModalVisivel(false)}
        aoSelecionarItem={(ordem) => {
          hook.setOrdenacao({ campo: ordem.campo, direcao: ordem.direcao });
          hook.setOrdenacaoModalVisivel(false);
        }}
        desabilitarCriacao
        desabilitarExclusao
        desabilitarBusca
      />
    </>
  );
};

export default ModaisClientes;
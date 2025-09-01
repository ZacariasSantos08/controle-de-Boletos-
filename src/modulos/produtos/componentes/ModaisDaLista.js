import React from 'react';
import FiltrosModal from './FiltrosModal';
import ModalSelecao from '../../../componentes/ModalSelecao';
import SalvarFiltroModal from './SalvarFiltroModal';
import CarregarFiltroModal from './CarregarFiltroModal';

export const ModaisDaLista = ({ 
    filtrosHook, 
    interacaoHook, 
    opcoesOrdenacao,
    aplicarFiltros
}) => {
  return (
    <>
      <FiltrosModal
        visivel={interacaoHook.filtrosModalVisivel}
        aoFechar={() => interacaoHook.setFiltrosModalVisivel(false)}
        aoAplicar={aplicarFiltros}
        filtrosIniciais={filtrosHook.filtrosAtivos}
        listasDeFiltro={{
          abrirModal: (tipo) => {
            interacaoHook.setFiltrosModalVisivel(false);
            interacaoHook.setModalAtributoVisivel({ visivel: true, tipo });
          }
        }}
        contagemResultados={filtrosHook.produtos.length}
        onSalvarFiltro={() => {
          interacaoHook.setFiltrosModalVisivel(false);
          interacaoHook.setSalvarFiltroModalVisivel(true);
        }}
        atualizacaoEmTempoReal={interacaoHook.atualizacaoEmTempoReal}
        onMudarAtualizacaoTempoReal={interacaoHook.setAtualizacaoEmTempoReal}
      />
      
      <ModalSelecao
        visivel={interacaoHook.modalAtributoVisivel.visivel}
        titulo={`Selecionar ${interacaoHook.modalAtributoVisivel.tipo?.slice(0, -1)}(s)`}
        dados={interacaoHook.listasParaFiltro[interacaoHook.modalAtributoVisivel.tipo]}
        aoFechar={() => {
            interacaoHook.setModalAtributoVisivel({ visivel: false, tipo: ''});
            interacaoHook.setFiltrosModalVisivel(true);
        }}
        selecaoMultipla={true}
        itensSelecionados={filtrosHook.filtrosAtivos.categorias || []}
        aoConfirmarSelecaoMultipla={(itens) => {
            filtrosHook.setFiltrosAtivos(prev => ({...prev, categorias: itens }));
            interacaoHook.setModalAtributoVisivel({ visivel: false, tipo: ''});
            interacaoHook.setFiltrosModalVisivel(true);
        }}
        desabilitarCriacao 
        desabilitarExclusao
      />
      
      <ModalSelecao
        visivel={interacaoHook.ordenacaoModalVisivel}
        titulo="Ordenar Por"
        dados={opcoesOrdenacao}
        aoFechar={() => interacaoHook.setOrdenacaoModalVisivel(false)}
        aoSelecionarItem={(ordem) => {
            filtrosHook.setOrdenacao({ campo: ordem.campo, direcao: ordem.direcao });
            interacaoHook.setOrdenacaoModalVisivel(false);
        }}
        desabilitarCriacao 
        desabilitarExclusao 
        desabilitarBusca
      />

      <SalvarFiltroModal
        visivel={interacaoHook.salvarFiltroModalVisivel}
        aoFechar={() => interacaoHook.setSalvarFiltroModalVisivel(false)}
        aoSalvar={interacaoHook.salvarFiltroAtual}
      />

      <CarregarFiltroModal
        visivel={interacaoHook.carregarFiltroModalVisivel}
        aoFechar={() => interacaoHook.setCarregarFiltroModalVisivel(false)}
        filtrosSalvos={interacaoHook.filtrosSalvos}
        onCarregarFiltro={(filtro) => {
          const novosFiltros = interacaoHook.carregarFiltro(filtro);
          filtrosHook.setFiltrosAtivos(novosFiltros);
        }}
        onExcluirFiltro={interacaoHook.excluirFiltro}
      />
    </>
  );
};
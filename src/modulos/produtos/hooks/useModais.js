import { useState } from 'react';

export const useModais = () => {
  const [modalSelecao, setModalSelecao] = useState({ visivel: false, tipo: null, busca: '' });
  const [modalCriacao, setModalCriacao] = useState({ visivel: false, tipo: null });

  const abrirModalCriacao = () => {
    setModalSelecao(prev => ({ ...prev, visivel: false }));
    setModalCriacao({ visivel: true, tipo: modalSelecao.tipo });
  };

  return { modalSelecao, setModalSelecao, modalCriacao, setModalCriacao, abrirModalCriacao };
};
import React from 'react';
import CardFormulario from '../../../componentes/CardFormulario';
import InputFormulario from '../../../componentes/InputFormulario';
import SeletorDeData from '../../../componentes/SeletorDeData';
import { formatarMoeda } from '../../../utilitarios/formatadores';

const DetalhesAdicionaisCard = ({
  descontoTotal,
  setDescontoTotal,
  dataEntrega,
  setDataEntrega,
  observacoes,
  setObservacoes,
}) => {
  return (
    <CardFormulario titulo="Ajustes e Detalhes" icone="settings">
      <InputFormulario
        label="Desconto no Valor Total"
        valor={descontoTotal}
        aoMudarTexto={setDescontoTotal}
        tipoTeclado="numeric"
        formatador={formatarMoeda}
        placeholder="R$ 0,00"
      />
      <SeletorDeData
        label="Data de Saída / Entrega"
        data={dataEntrega}
        aoMudarData={setDataEntrega}
      />
      <InputFormulario
        label="Observações da Venda"
        valor={observacoes}
        aoMudarTexto={setObservacoes}
        multiline
        numberOfLines={4}
        placeholder="Adicione informações relevantes sobre a venda..."
      />
    </CardFormulario>
  );
};

export default DetalhesAdicionaisCard;
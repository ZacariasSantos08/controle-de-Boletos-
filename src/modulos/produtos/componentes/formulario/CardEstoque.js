import React from 'react';
import CardFormulario from '../../../../componentes/CardFormulario';
import InputFormulario from '../../../../componentes/InputFormulario';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import { formatarNumero } from '../../../../utilitarios/formatadores';

const CardEstoque = () => {
  const { form, setFormField } = useFormularioProduto();

  return (
    <CardFormulario titulo="Estoque" icone="archive">
      <InputFormulario 
        label="Estoque Disponível" 
        valor={form.estoqueDisponivel} 
        aoMudarTexto={val => setFormField('estoqueDisponivel', val)} 
        tipoTeclado="numeric" 
        formatador={formatarNumero} 
        placeholder="0"
      />
      <InputFormulario 
        label="Estoque Mínimo" 
        valor={form.estoqueMinimo} 
        aoMudarTexto={val => setFormField('estoqueMinimo', val)} 
        tipoTeclado="numeric" 
        formatador={formatarNumero} 
        placeholder="0"
      />
    </CardFormulario>
  );
};

export default CardEstoque;
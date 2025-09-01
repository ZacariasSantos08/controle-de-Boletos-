import React from 'react';
import CardFormulario from '../../../../componentes/CardFormulario';
import InputFormulario from '../../../../componentes/InputFormulario';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import { formatarNumero } from '../../../../utilitarios/formatadores';

const CardDimensoes = () => {
  const { form, setFormField } = useFormularioProduto();

  return (
    <CardFormulario titulo="Peso e Dimensões" icone="box">
      <InputFormulario 
        label="Peso Líquido" 
        valor={form.pesoLiquido} 
        aoMudarTexto={val => setFormField('pesoLiquido', val)} 
        tipoTeclado="numeric" 
        unidade="kg" 
        formatador={formatarNumero} 
        placeholder="0,000"
      />
      <InputFormulario 
        label="Peso Bruto" 
        valor={form.pesoBruto} 
        aoMudarTexto={val => setFormField('pesoBruto', val)} 
        tipoTeclado="numeric" 
        unidade="kg" 
        formatador={formatarNumero} 
        placeholder="0,000"
      />
      <InputFormulario 
        label="Altura" 
        valor={form.altura} 
        aoMudarTexto={val => setFormField('altura', val)} 
        tipoTeclado="numeric" 
        unidade="cm" 
        formatador={formatarNumero} 
        placeholder="0,00"
      />
      <InputFormulario 
        label="Largura" 
        valor={form.largura} 
        aoMudarTexto={val => setFormField('largura', val)} 
        tipoTeclado="numeric" 
        unidade="cm" 
        formatador={formatarNumero} 
        placeholder="0,00"
      />
      <InputFormulario 
        label="Profundidade" 
        valor={form.profundidade} 
        aoMudarTexto={val => setFormField('profundidade', val)} 
        tipoTeclado="numeric" 
        unidade="cm" 
        formatador={formatarNumero} 
        placeholder="0,00"
      />
    </CardFormulario>
  );
};

export default CardDimensoes;
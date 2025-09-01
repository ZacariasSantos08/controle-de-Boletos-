import React, { useCallback } from 'react';
import CardFormulario from '../../../../componentes/CardFormulario';
import InputFormulario from '../../../../componentes/InputFormulario';
import { useFormularioProduto } from '../../contexts/FormularioProdutoContext';
import { formatarMoeda, desformatarParaCentavos, formatarNumero } from '../../../../utilitarios/formatadores';

const CardPrecosCustos = () => {
  const { form, setFormField, erros } = useFormularioProduto();

  const calcularValorVenda = useCallback(() => {
    // Trabalhamos com centavos para precisão
    const custoEmCentavos = desformatarParaCentavos(form.valorCusto);
    const markupEmCentavos = desformatarParaCentavos(form.markup);

    if (custoEmCentavos > 0 && markupEmCentavos > 0) {
      // markupEmCentavos / 100 para ter o valor (ex: 2000 -> 20.00), e /100 de novo para ter a porcentagem (0.20)
      const markupPercentual = markupEmCentavos / 100 / 100; 
      const valorVendaCalculado = custoEmCentavos * (1 + markupPercentual);
      
      setFormField('valorVenda', formatarMoeda(Math.round(valorVendaCalculado)));
    }
  }, [form.valorCusto, form.markup, setFormField]);

  const calcularMarkup = useCallback(() => {
    const custoEmCentavos = desformatarParaCentavos(form.valorCusto);
    const vendaEmCentavos = desformatarParaCentavos(form.valorVenda);

    if (custoEmCentavos > 0 && vendaEmCentavos > custoEmCentavos) {
      const markupCalculado = ((vendaEmCentavos / custoEmCentavos) - 1) * 100;
      // Multiplicamos por 100 para voltar a ser centavos para o formatador
      setFormField('markup', formatarNumero(Math.round(markupCalculado * 100)));
    }
  }, [form.valorCusto, form.valorVenda, setFormField]);

  return (
    <CardFormulario titulo="Preços e Custos" icone="dollar-sign">
      <InputFormulario
        label="Valor de Custo"
        valor={form.valorCusto}
        aoMudarTexto={val => setFormField('valorCusto', val)}
        formatador={formatarMoeda}
        tipoTeclado="numeric"
        onBlur={calcularValorVenda}
        placeholder="R$ 0,00"
      />
      <InputFormulario
        label="Markup"
        valor={form.markup}
        aoMudarTexto={val => setFormField('markup', val)}
        formatador={formatarNumero}
        tipoTeclado="numeric"
        onBlur={calcularValorVenda}
        unidade="%"
        placeholder="0,00"
      />
      <InputFormulario
        label="Valor de Venda *"
        valor={form.valorVenda}
        aoMudarTexto={val => setFormField('valorVenda', val)}
        formatador={formatarMoeda}
        tipoTeclado="numeric"
        onBlur={calcularMarkup}
        erro={erros.valorVenda}
        placeholder="R$ 0,00"
      />
    </CardFormulario>
  );
};

export default CardPrecosCustos;
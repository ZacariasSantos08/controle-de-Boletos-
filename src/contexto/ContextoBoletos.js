import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation } from 'react-native';
import { isBefore, isToday, differenceInDays } from 'date-fns';
import uuid from 'react-native-uuid';
import { boletosIniciais } from '../dados/boletosIniciais';
import { agendarNotificacao, cancelarNotificacao } from '../servicos/servicoNotificacoes';

export const ContextoBoletos = createContext();
const CHAVE_ARMAZENAMENTO_BOLETOS = '@ControleDeBoletos:boletos';

export const obterStatus = (boleto) => {
  if (boleto.status === 'pago') return 'pago';
  const hoje = new Date();
  const dataVencimento = new Date(boleto.vencimento);
  const diasParaVencer = differenceInDays(dataVencimento, hoje);
  if (isBefore(dataVencimento, hoje) && !isToday(dataVencimento)) return 'vencido';
  if (diasParaVencer >= 0 && diasParaVencer <= 3) return 'vencendo';
  return 'aPagar';
};

export function ProvedorBoletos({ children }) {
  const [boletos, setBoletos] = useState([]);
  const [estaCarregando, setEstaCarregando] = useState(true);

  const carregarBoletos = useCallback(async () => {
    try {
      const boletosSalvos = await AsyncStorage.getItem(CHAVE_ARMAZENAMENTO_BOLETOS);
      let dadosIniciaisApp = boletosSalvos ? JSON.parse(boletosSalvos) : boletosIniciais;
      if (!Array.isArray(dadosIniciaisApp) || dadosIniciaisApp.length === 0) {
        dadosIniciaisApp = boletosIniciais;
      }
      setBoletos(dadosIniciaisApp);
    } catch (e) {
      setBoletos(boletosIniciais);
    } finally {
      setTimeout(() => setEstaCarregando(false), 1200);
    }
  }, []);
  
  const salvarBoletos = useCallback(async (novosBoletos) => {
    try {
      const jsonValue = JSON.stringify(novosBoletos);
      await AsyncStorage.setItem(CHAVE_ARMAZENAMENTO_BOLETOS, jsonValue);
    } catch (e) { console.error('Falha ao salvar boletos.', e); }
  }, []);
  
  useEffect(() => { carregarBoletos(); }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    if (!estaCarregando) { salvarBoletos(boletos); }
  }, [boletos, estaCarregando, salvarBoletos]);

  const boletosComStatusAtualizado = useMemo(() => {
    if (!Array.isArray(boletos)) return [];
    return boletos.map(b => ({ ...b, status: obterStatus(b) }));
  }, [boletos]);

  const adicionarBoleto = async (dadosNovoBoleto) => {
    const novoBoleto = { ...dadosNovoBoleto, id: uuid.v4(), status: 'aPagar', idNotificacao: null, dataPagamento: null, valorPago: null, jurosMulta: null };
    novoBoleto.idNotificacao = await agendarNotificacao(novoBoleto);
    setBoletos(boletosAtuais => [novoBoleto, ...boletosAtuais]);
  };
  
  const atualizarBoleto = async (boletoAtualizado) => {
    const boletoAntigo = boletos.find(b => b.id === boletoAtualizado.id);
    if (boletoAntigo && boletoAntigo.vencimento !== boletoAtualizado.vencimento && boletoAntigo.idNotificacao) {
      await cancelarNotificacao(boletoAntigo.idNotificacao);
      boletoAtualizado.idNotificacao = await agendarNotificacao(boletoAtualizado);
    }
    setBoletos(boletosAtuais => boletosAtuais.map(b => (b.id === boletoAtualizado.id ? boletoAtualizado : b)));
  };

  const removerBoleto = async (idBoleto) => {
    const boletoParaRemover = boletos.find(b => b.id === idBoleto);
    if (boletoParaRemover?.idNotificacao) { await cancelarNotificacao(boletoParaRemover.idNotificacao); }
    setBoletos(boletosAtuais => boletosAtuais.filter(b => b.id !== idBoleto));
  };

  const marcarComoPago = async (idBoleto, dataPagamento, valorPago, jurosMulta) => {
    const boletoParaPagar = boletos.find(b => b.id === idBoleto);
    if (boletoParaPagar?.idNotificacao) { await cancelarNotificacao(boletoParaPagar.idNotificacao); }
    setBoletos(boletosAtuais => boletosAtuais.map(b => b.id === idBoleto ? { ...b, status: 'pago', dataPagamento, valorPago, jurosMulta, idNotificacao: null } : b ));
  };
  
  const desmarcarComoPago = async (idBoleto) => {
    let boletoParaReativar = null;
    const novosBoletos = boletos.map(b => {
      if (b.id === idBoleto) {
        boletoParaReativar = { ...b, status: 'aPagar', dataPagamento: null, valorPago: null, jurosMulta: null };
        return boletoParaReativar;
      }
      return b;
    });
    if (boletoParaReativar) { boletoParaReativar.idNotificacao = await agendarNotificacao(boletoParaReativar); }
    setBoletos(novosBoletos);
  };
  
  const todosEmissoresUnicos = useMemo(() => {
    const emissores = boletos.map(b => b.emissor).filter(Boolean);
    return [...new Set(emissores)];
  }, [boletos]);

  const todasDescricoesUnicas = useMemo(() => {
    const descricoes = boletos.map(b => b.descricao).filter(Boolean);
    return [...new Set(descricoes)];
  }, [boletos]);

  return (
    <ContextoBoletos.Provider value={{ boletos: boletosComStatusAtualizado, estaCarregando, adicionarBoleto, atualizarBoleto, removerBoleto, marcarComoPago, desmarcarComoPago, todosEmissoresUnicos, todasDescricoesUnicas }}>
      {children}
    </ContextoBoletos.Provider>
  );
}
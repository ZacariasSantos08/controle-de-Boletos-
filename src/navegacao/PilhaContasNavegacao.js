import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tema from '../estilos/tema';

import HomeContasTela from '../modulos/contas/telas/HomeContasTela';
import ContasAReceberTela from '../modulos/contas/telas/ContasAReceberTela';
import ContasAPagarTela from '../modulos/contas/telas/ContasAPagarTela';
import DetalhesContaTela from '../modulos/contas/telas/DetalhesContaTela';
import LancamentoManualTela from '../modulos/contas/telas/LancamentoManualTela';
// NOVO: Importa a tela de Fluxo de Caixa
import FluxoDeCaixaTela from '../modulos/contas/telas/FluxoDeCaixaTela';

const Stack = createNativeStackNavigator();

const PilhaContasNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeContas"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="HomeContas" 
        component={HomeContasTela} 
        options={{ title: 'Painel Financeiro' }}
      />
      <Stack.Screen 
        name="ContasAReceber" 
        component={ContasAReceberTela} 
        options={{ title: 'Contas a Receber' }}
      />
       <Stack.Screen 
        name="ContasAPagar" 
        component={ContasAPagarTela} 
        options={{ title: 'Contas a Pagar' }}
      />
       <Stack.Screen 
        name="LancamentoManual" 
        component={LancamentoManualTela} 
        options={{ title: 'Lançamento Manual' }}
      />
      <Stack.Screen 
        name="DetalhesConta" 
        component={DetalhesContaTela} 
        options={{ title: 'Detalhes da Conta' }}
      />
      {/* NOVO: Adiciona a rota para o Fluxo de Caixa */}
      <Stack.Screen 
        name="FluxoDeCaixa" 
        component={FluxoDeCaixaTela} 
        options={{ title: 'Fluxo de Caixa' }}
      />
    </Stack.Navigator>
  );
};

export default PilhaContasNavegacao;
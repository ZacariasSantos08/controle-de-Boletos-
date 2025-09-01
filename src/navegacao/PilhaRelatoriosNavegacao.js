import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import tema from '../estilos/tema';

import HomeRelatoriosTela from '../modulos/relatorios/telas/HomeRelatoriosTela';
import RelatorioVendasPorPeriodoTela from '../modulos/relatorios/telas/RelatorioVendasPorPeriodoTela';
import RelatorioRankingProdutosTela from '../modulos/relatorios/telas/RelatorioRankingProdutosTela';
import RelatorioVendasPorClienteTela from '../modulos/relatorios/telas/RelatorioVendasPorClienteTela';
// NOVO: Importa a nova tela de DRE
import RelatorioDRETela from '../modulos/relatorios/telas/UnRelatorioDRETela';

const Stack = createNativeStackNavigator();

const PilhaRelatoriosNavegacao = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeRelatorios"
      screenOptions={{
        headerStyle: { backgroundColor: tema.cores.primaria },
        headerTintColor: tema.cores.branco,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="HomeRelatorios" component={HomeRelatoriosTela} options={{ title: 'Relatórios' }} />
      <Stack.Screen name="RelatorioVendasPorPeriodo" component={RelatorioVendasPorPeriodoTela} options={{ title: 'Vendas por Período' }} />
      <Stack.Screen name="RelatorioRankingProdutos" component={RelatorioRankingProdutosTela} options={{ title: 'Ranking de Produtos' }} />
      <Stack.Screen name="RelatorioVendasPorCliente" component={RelatorioVendasPorClienteTela} options={{ title: 'Vendas por Cliente' }} />
      {/* NOVO: Adiciona a rota para o DRE */}
      <Stack.Screen name="RelatorioDRE" component={RelatorioDRETela} options={{ title: 'DRE (Resultados)' }} />
    </Stack.Navigator>
  );
};

export default PilhaRelatoriosNavegacao;
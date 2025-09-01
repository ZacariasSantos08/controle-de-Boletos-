import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
// ALTERADO: O hook de contas foi movido para a HomeContasTela, então importamos apenas os componentes de UI
import { useHomeContas } from '../../contas/hooks/useHomeContas';
import ResumoFinanceiroWidget from '../../contas/componentes/ResumoFinanceiroWidget';
import tema from '../../../estilos/tema';

const DashboardTela = () => {
  // A lógica de carregar dados agora pode ser mais ampla,
  // mas por enquanto reutilizamos o hook de contas para os widgets.
  const { metricas, carregando } = useHomeContas();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Painel de Controle</Text>
        <Text style={styles.subtitulo}>Resumo do seu negócio.</Text>
      </View>

      {/* Os widgets que criamos continuam aqui, dando uma ótima visão geral no início */}
      <View style={styles.widgetsContainer}>
        <View style={styles.linhaWidget}>
          <ResumoFinanceiroWidget 
            titulo="A Receber (Aberto)"
            valor={metricas.totalAReceber}
            icone="arrow-down-circle"
            cor={tema.cores.primaria}
            carregando={carregando}
          />
          <ResumoFinanceiroWidget 
            titulo="A Pagar (Aberto)"
            valor={metricas.totalAPagar}
            icone="arrow-up-circle"
            cor={tema.cores.vermelho}
            carregando={carregando}
          />
        </View>
        <View style={styles.linhaWidget}>
          <ResumoFinanceiroWidget 
            titulo="Recebido no Mês"
            valor={metricas.recebidoNoMes}
            icone="trending-up"
            cor={tema.cores.verde}
            carregando={carregando}
          />
           <ResumoFinanceiroWidget 
            titulo="Saldo do Mês"
            valor={metricas.saldoDoMes}
            icone="dollar-sign"
            cor={metricas.saldoDoMes >= 0 ? tema.cores.verde : tema.cores.vermelho}
            carregando={carregando}
          />
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.infoText}>
          Bem-vindo! Utilize as abas abaixo para navegar entre os módulos do aplicativo.
        </Text>
        {/* ALTERADO: Os botões de navegação (CardOpcao) foram removidos */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: tema.cores.secundaria },
    header: { backgroundColor: tema.cores.primaria, padding: tema.espacamento.grande, paddingBottom: tema.espacamento.grande * 3 },
    titulo: { fontSize: tema.fontes.tamanhoTitulo, color: tema.cores.branco, fontWeight: 'bold' },
    subtitulo: { fontSize: tema.fontes.tamanhoMedio, color: tema.cores.branco, opacity: 0.8, marginTop: tema.espacamento.pequeno / 2 },
    widgetsContainer: {
      paddingHorizontal: tema.espacamento.medio,
      marginTop: -tema.espacamento.grande * 2,
    },
    linhaWidget: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: tema.espacamento.medio,
      gap: tema.espacamento.medio,
    },
    content: { 
      padding: tema.espacamento.medio,
      marginTop: tema.espacamento.grande,
      alignItems: 'center',
    },
    infoText: {
      fontSize: 16,
      color: tema.cores.cinza,
      textAlign: 'center',
      lineHeight: 24,
    }
});

export default DashboardTela;
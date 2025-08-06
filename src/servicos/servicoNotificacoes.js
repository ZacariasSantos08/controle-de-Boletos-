import * as Notifications from 'expo-notifications';
import { subDays } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave para ler a configuração. Deve ser a mesma da tela de configurações.
const CHAVE_CONFIG_NOTIFICACAO = '@ControleDeBoletos:configNotificacao';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function verificarPermissoes() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: finalStatus } = await Notifications.requestPermissionsAsync();
    if (finalStatus !== 'granted') {
      console.log('Permissão de notificação não concedida!');
      return false;
    }
  }
  return true;
}

export async function agendarNotificacao(boleto) {
  const temPermissao = await verificarPermissoes();
  if (!temPermissao) return null;

  // ATUALIZAÇÃO: Lendo a preferência do usuário do AsyncStorage
  const configSalva = await AsyncStorage.getItem(CHAVE_CONFIG_NOTIFICACAO);
  // Se houver configuração salva, usa o valor. Se não, usa 1 como padrão.
  const diasDeAntecedencia = configSalva ? JSON.parse(configSalva).dias : 1;

  const dataVencimento = new Date(boleto.vencimento);
  // Usa o valor dinâmico para calcular a data da notificação
  const dataNotificacao = subDays(dataVencimento, diasDeAntecedencia);

  // Não agenda notificações para o passado
  if (new Date() > dataNotificacao) return null;

  try {
    const bodyMessage = diasDeAntecedencia > 0
      ? `O boleto de ${boleto.emissor} no valor de R$ ${boleto.valor.toFixed(2)} vence em ${diasDeAntecedencia} dia(s)!`
      : `O boleto de ${boleto.emissor} no valor de R$ ${boleto.valor.toFixed(2)} vence hoje!`;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Vencimento!",
        body: bodyMessage,
        data: { boletoId: boleto.id },
      },
      trigger: dataNotificacao,
    });
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
    return null;
  }
}

export async function cancelarNotificacao(idNotificacao) {
  if (!idNotificacao) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(idNotificacao);
  } catch (error) {
    console.error('Erro ao cancelar notificação:', error);
  }
}
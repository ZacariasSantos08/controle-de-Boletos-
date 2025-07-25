import * as Notifications from 'expo-notifications';
import { subDays } from 'date-fns';

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
      alert('Permissão de notificação não concedida!');
      return false;
    }
  }
  return true;
}

export async function agendarNotificacao(boleto) {
  const temPermissao = await verificarPermissoes();
  if (!temPermissao) return null;
  const dataVencimento = new Date(boleto.vencimento);
  const dataNotificacao = subDays(dataVencimento, 1);
  if (new Date() > dataNotificacao) return null;
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: "Boleto Vencendo!",
        body: `O boleto de ${boleto.emissor} no valor de R$ ${boleto.valor.toFixed(2)} vence amanhã!`,
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
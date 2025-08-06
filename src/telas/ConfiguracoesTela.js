import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { tema } from '../estilos/tema';
import Toast from 'react-native-toast-message';
import { ContextoBoletos } from '../contexto/ContextoBoletos'; // Importando o Contexto
import BotaoPersonalizado from '../componentes/BotaoPersonalizado';

const CHAVE_CONFIG_NOTIFICACAO = '@ControleDeBoletos:configNotificacao';

const OPCOES_NOTIFICACAO = [
    { label: 'No dia do vencimento', valor: 0 },
    { label: '1 dia antes', valor: 1 },
    { label: '2 dias antes', valor: 2 },
    { label: '3 dias antes', valor: 3 },
];

const ConfiguracoesTela = () => {
    const { importarBackup } = useContext(ContextoBoletos); // Usando a função do contexto
    const [diasAntecedencia, setDiasAntecedencia] = useState(1);

    useEffect(() => {
        const carregarConfiguracao = async () => {
            try {
                const configSalva = await AsyncStorage.getItem(CHAVE_CONFIG_NOTIFICACAO);
                if (configSalva !== null) {
                    setDiasAntecedencia(JSON.parse(configSalva).dias);
                }
            } catch (error) {
                console.error("Falha ao carregar configuração de notificação.", error);
            }
        };
        carregarConfiguracao();
    }, []);

    const handleSalvarConfiguracao = async (valor) => {
        try {
            const novaConfig = { dias: valor };
            await AsyncStorage.setItem(CHAVE_CONFIG_NOTIFICACAO, JSON.stringify(novaConfig));
            setDiasAntecedencia(valor);
            Toast.show({
                type: 'success',
                text1: 'Salvo!',
                text2: 'Sua preferência de notificação foi atualizada.',
            });
        } catch (error) {
            console.error("Falha ao salvar configuração de notificação.", error);
            Toast.show({
                type: 'error',
                text1: 'Erro',
                text2: 'Não foi possível salvar sua preferência.',
            });
        }
    };

    const handleImportarBackup = () => {
        Alert.alert(
            "Restaurar Backup",
            "Isso adicionará os boletos do arquivo à sua lista atual. Boletos duplicados (mesmo ID) serão ignorados. Deseja continuar?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Continuar", onPress: () => importarBackup() }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container}>
                <Text style={styles.titulo}>Configurações</Text>

                <View style={styles.secao}>
                    <Text style={styles.subtitulo}>Notificações de Vencimento</Text>
                    <Text style={styles.descricao}>Escolha com que antecedência você quer ser notificado sobre um boleto a vencer.</Text>

                    {OPCOES_NOTIFICACAO.map((opcao) => {
                        const isSelecionado = diasAntecedencia === opcao.valor;
                        return (
                            <TouchableOpacity
                                key={opcao.valor}
                                style={[styles.opcao, isSelecionado && styles.opcaoSelecionada]}
                                onPress={() => handleSalvarConfiguracao(opcao.valor)}
                            >
                                <Text style={[styles.textoOpcao, isSelecionado && styles.textoOpcaoSelecionada]}>
                                    {opcao.label}
                                </Text>
                                {isSelecionado && (
                                    <Ionicons name="checkmark-circle" size={24} color={tema.cores.textoClaro} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.secao}>
                    <Text style={styles.subtitulo}>Gerenciamento de Dados</Text>
                    <BotaoPersonalizado 
                        titulo="Importar / Restaurar Backup"
                        onPress={handleImportarBackup}
                        tipo="contorno"
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: tema.cores.fundo, },
    container: { padding: tema.espacamento.medio, },
    titulo: { ...tema.tipografia.titulo, color: tema.cores.primaria, marginBottom: tema.espacamento.grande, textAlign: 'center', },
    secao: { backgroundColor: tema.cores.superficie, borderRadius: tema.raioBorda.medio, padding: tema.espacamento.medio, marginBottom: tema.espacamento.grande, },
    subtitulo: { ...tema.tipografia.subtitulo, color: tema.cores.texto, marginBottom: tema.espacamento.pequeno, },
    descricao: { ...tema.tipografia.corpo, color: tema.cores.cinza, marginBottom: tema.espacamento.medio, fontSize: 14, },
    opcao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: tema.espacamento.medio, borderRadius: tema.raioBorda.medio, borderWidth: 1, borderColor: tema.cores.borda, marginBottom: tema.espacamento.pequeno, },
    opcaoSelecionada: { backgroundColor: tema.cores.primaria, borderColor: tema.cores.primaria, },
    textoOpcao: { ...tema.tipografia.corpo, color: tema.cores.texto, fontWeight: '500', },
    textoOpcaoSelecionada: { color: tema.cores.textoClaro, fontWeight: 'bold', },
});

export default ConfiguracoesTela;
import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { buscarAtributos, salvarAtributo, excluirAtributo } from '../../../api/atributos.api';
import { buscarTodosFornecedores } from '../../../api/fornecedores.api';

const UNIDADES_PADRAO = [
  { id: 'un', nome: 'un' }, { id: 'pc', nome: 'pc' },
  { id: 'cx', nome: 'cx' }, { id: 'kg', nome: 'kg' },
  { id: 'm', nome: 'm' }, { id: 'L', nome: 'L' },
];

export const useAtributos = () => {
  const [listas, setListas] = useState({
    categorias: [],
    marcas: [],
    colecoes: [],
    fornecedores: [],
    tiposUnidade: UNIDADES_PADRAO,
  });

  const carregarAtributos = useCallback(async () => {
    try {
      const [cats, marcs, colecs, forns] = await Promise.all([
        buscarAtributos('categorias'),
        buscarAtributos('marcas'),
        buscarAtributos('colecoes'),
        buscarTodosFornecedores(),
      ]);
      setListas(prev => ({ ...prev, categorias: cats, marcas: marcs, colecoes: colecs, fornecedores: forns }));
    } catch (error) {
      console.error("Erro ao carregar atributos:", error);
    }
  }, []);

  useFocusEffect(carregarAtributos);

  const lidarSalvarNovoAtributo = async (tipo, novoAtributo) => {
    const itemSalvo = await salvarAtributo(tipo, novoAtributo);
    await carregarAtributos();
    return itemSalvo;
  };

  const lidarExcluirAtributo = async (tipo, item) => {
    await excluirAtributo(tipo, item.id);
    await carregarAtributos();
  };

  return { listas, lidarSalvarNovoAtributo, lidarExcluirAtributo };
};
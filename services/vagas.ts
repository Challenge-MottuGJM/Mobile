import { api } from './http';

export type VagaApi = {
  id?: string;
  vagaId?: string;
  setor?: string;
  status?: 'livre'|'ocupada'|'manutencao';
  ocupada?: boolean;
  motoId?: string|null;
  atualizadoEm?: string;
};

export async function listarVagas(): Promise<VagaApi[]> {
  const data = await api('/api/v1/vagas');
  return Array.isArray(data) ? data : [];
}

export async function atualizarVaga(id: string, patch: Partial<VagaApi>) {
  return api(`/api/v1/vagas/atualizar/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patch)
  });
}

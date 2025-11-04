import { api } from './http';

export type StatusOcupacao = 'livre' | 'ocupada' | 'manutencao';

export type VagaApi = {
  id: string;          // canonical
  setor: string;       // ex: 'A'
  numero: number;      // ex: 1..N
  status: StatusOcupacao;
  ocupada: boolean;
  motoId: string | null;
  atualizadoEm: string; // ISO
};

// Lista todas as vagas (ou futuramente paginada/filtrada no backend)
export async function listarVagas(params?: { setor?: string; status?: StatusOcupacao }) {
  return api<VagaApi[]>('/api/v1/vagas', { method: 'GET', query: params });
}

// Lista vagas por setor (atalho amigável)
export async function listarVagasDoSetor(setor: string) {
  return listarVagas({ setor });
}

// Detalhe de uma vaga
export async function obterVaga(id: string) {
  return api<VagaApi>(`/api/v1/vagas/${id}`, { method: 'GET' });
}

// Atualização parcial (PATCH é mais semântico, mas mantém PUT se o .NET definir assim)
export async function atualizarVaga(id: string, patch: Partial<VagaApi>) {
  return api<VagaApi>(`/api/v1/vagas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });
}

// Ações de domínio explícitas (opcional, depende do design do .NET)
export async function ocuparVaga(id: string, payload: { motoId: string }) {
  return api<VagaApi>(`/api/v1/vagas/${id}/ocupar`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function liberarVaga(id: string) {
  return api<VagaApi>(`/api/v1/vagas/${id}/liberar`, { method: 'POST' });
}

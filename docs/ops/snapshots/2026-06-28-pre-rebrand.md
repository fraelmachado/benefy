# Snapshot pré-rebrand de infra — 2026-06-28

Baseline para rollback da Fase C (domínios `mapadebeneficios.com.br`). Capturado via Dokploy MCP + DNS/HTTP.
**Sem secrets** (POSTGRES_PASSWORD / JWT_SECRET / ANON_KEY / SERVICE_ROLE_KEY / SMTP_PASS / GitHub private key ficam só no env do Dokploy).

Servidor prod: **85.31.230.250**

## Git
- HEAD de partida: `a3dce7cfc481d62d3e47011033cbf274cb17f76f` (branch `develop`)
- Commits do de-benefy: `a792645` (docs) · `a3dce7c` (config.toml local)

## DNS (já publicado e propagado em 2026-06-28)
| Host | Tipo | Aponta p/ |
|---|---|---|
| `mapadebeneficios.com.br` | A (`@`) | 85.31.230.250 |
| `www.mapadebeneficios.com.br` | CNAME | → apex → 85.31.230.250 |
| `api.mapadebeneficios.com.br` | CNAME | → apex → 85.31.230.250 |

## Dokploy — recursos
- **Organization:** `943bb20d-414d-4bb7-acfa-f06ebc1838f9`
- **Projeto:** `Mapa de Benefícios` (`FZ70f3Xo3OmCwP2VRep8j`) — *já renomeado*
- **Env production:** `la4D67DI-3B4xwTO-WEfq`
- **Compose Supabase:** name `supabase` · appName `benefy-supabase-2std75` · `_ueWmUNJEKkNbdxSVmcqG`
- **App front:** name `web` · appName `app-input-mobile-bandwidth-131mim` · `1BjRuRUM7eitGRBJ29wMi`
- **GitHub provider:** `kjbNpJ9sEgsk_qs0pA4Oh` (app dokploy-rampap)

## Estado ATUAL (baseline) → ALVO

### App front (`1BjRuRUM7eitGRBJ29wMi`)
| Campo | Atual (rollback) | Alvo |
|---|---|---|
| domínios | `mapadebeneficios.com.br` (https/LE, :80) — *já adicionado* | + `www.mapadebeneficios.com.br` (https/LE, :80) |
| `repository` (GitHub) | **`benefy`** ⚠️ stale (repo renomeado) | `mapa-de-beneficios` |
| `owner` / `branch` | `fraelmachado` / `main` | (igual) |
| buildArg `VITE_SUPABASE_URL` | `http://benefy-supabase-49f9b6-85-31-230-250.sslip.io` | `https://api.mapadebeneficios.com.br` |
| buildArg `VITE_SUPABASE_ANON_KEY` | (inalterado — mesmo JWT) | (igual) |
| domínio `mapadebeneficios.com.br` | já responde **HTTP/2 200** (LE emitido) | (mantém) |

### Compose Supabase (`_ueWmUNJEKkNbdxSVmcqG`)
| Campo | Atual (rollback) | Alvo |
|---|---|---|
| domínio | `benefy-supabase-49f9b6-85-31-230-250.sslip.io` (http, :8000, service `kong`, domainId `pLDrDu0sr6wPSYh9xL-X_`) | + `api.mapadebeneficios.com.br` (https/LE, :8000, service `kong`) — manter o sslip durante transição |
| env `SUPABASE_HOST` | `benefy-supabase-49f9b6-85-31-230-250.sslip.io` | `api.mapadebeneficios.com.br` |
| env `API_EXTERNAL_URL` | `http://benefy-supabase-49f9b6-85-31-230-250.sslip.io` | `https://api.mapadebeneficios.com.br` |
| env `SUPABASE_PUBLIC_URL` | `http://benefy-supabase-49f9b6-85-31-230-250.sslip.io` | `https://api.mapadebeneficios.com.br` |
| env `SITE_URL` | `http://app-input-mobile-bandwidth-131mim-19f733-85-31-230-250.sslip.io` | `https://mapadebeneficios.com.br` |
| env `ADDITIONAL_REDIRECT_URLS` | `http://app-input-mobile-bandwidth-131mim-19f733-85-31-230-250.sslip.io/*,http://localhost:3000/*` | `https://mapadebeneficios.com.br/*,https://www.mapadebeneficios.com.br/*,http://localhost:3000/*` |
| env `SMTP_SENDER_NAME` | `Benefy` | `Mapa de Benefícios` |
| appName / `CONTAINER_PREFIX` | `benefy-supabase-2std75` / `benefy-supabase-2std75-supabase` | **NÃO mudar** (recria containers/volumes = perda de dados; appName é imutável) |

## Rollback (resumo)
- **Domínios novos:** removê-los do front/Kong reverte o roteamento; o sslip antigo segue ativo.
- **Env / buildArg:** restaurar os valores "Atual" acima e redeploy.
- **`repository`:** voltar para `benefy` (GitHub mantém redirect do nome antigo).
- **Git:** usar `git revert <sha>` — **nunca** `git reset --hard` (working tree compartilhado).

## Itens que continuam `benefy` por design (não tocar nesta janela)
`appName benefy-supabase-2std75` + `CONTAINER_PREFIX` (imutáveis sem recriar volumes). O domínio sslip antigo fica como rede de segurança até o novo estar estável por alguns dias.

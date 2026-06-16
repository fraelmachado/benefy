# Prompt para agente de implementação — App de descoberta de benefícios e vantagens

**Data da varredura:** 2026-06-15
**Objetivo do arquivo:** orientar um agente de implementação a entender o produto, modelar os dados e cadastrar uma base inicial de teste para o MVP de um app que descobre benefícios, vantagens, seguros, pontos, cashback e resgates disponíveis para o usuário a partir de um questionário.

---

## 1. Contexto do produto

Você é um agente responsável por implementar o MVP de um app de descoberta de benefícios.

O app deve ajudar o usuário a responder perguntas simples sobre bancos, corretoras, cartões, bandeiras, telefonia, assinaturas e outros prestadores de serviço que ele já utiliza. A partir das respostas, o app deve identificar benefícios que o usuário provavelmente possui, mas talvez não conheça ou não saiba como usar.

Exemplos de benefícios:

- seguro saúde em viagem internacional;
- seguro para veículo de locadora;
- proteção de compra;
- garantia estendida;
- proteção de preço;
- sala VIP em aeroporto;
- pontos e milhas;
- cashback ou investback;
- descontos em restaurantes;
- benefícios em hotéis, viagens e experiências;
- conta global, câmbio, IOF e compras internacionais;
- concierge e assistência pessoal.

O app deve funcionar como um “radar de vantagens”: o usuário informa o que possui e o sistema devolve uma lista organizada de benefícios, onde usar, como acionar e quais informações ainda precisam ser confirmadas.

---

## 2. Escopo inicial do MVP

Esta base inicial deve cobrir 3 grupos diferentes:

1. **Nubank**
2. **Banco Inter**
3. **XP**

Além dos benefícios próprios de cada grupo, o modelo precisa considerar benefícios de bandeira:

- **Mastercard Gold**
- **Mastercard Platinum**
- **Mastercard Black**
- **Visa Signature**
- **Visa Infinite**

Motivo: vários benefícios não são exatamente do banco/corretora, mas da bandeira do cartão. Exemplo: seguro para veículo de locadora pode ser da Visa ou da Mastercard, enquanto cashback/pontos normalmente são do emissor.

---

## 3. Princípios importantes para a implementação

### 3.1. Separar origem do benefício

Cada benefício deve ter uma origem clara:

- `issuer`: benefício oferecido pelo emissor/instituição, como Nubank, Inter ou XP;
- `card_network`: benefício oferecido pela bandeira, como Mastercard ou Visa;
- `partner`: benefício oferecido por parceiro externo, como Priority Pass, Duo Gourmet, Azul, Smiles, LATAM Pass etc.;
- `mixed`: benefício composto, em que emissor, bandeira e/ou parceiro se combinam.

Essa separação é essencial para evitar erros. Um cartão XP Visa Infinite, por exemplo, combina benefícios XP com benefícios Visa Infinite.

### 3.2. Separar produto, programa, nível e benefício

Não modelar tudo como uma tabela única. A estrutura deve separar:

- grupo provedor;
- programa;
- produto ou nível;
- benefício;
- regra de elegibilidade;
- forma de resgate;
- localização de resgate;
- fonte de validação.

### 3.3. Dados sujeitos a mudança

Benefícios de cartão, pontuação, salas VIP, seguros e campanhas podem mudar. Todo registro deve conter:

- `source_url`;
- `source_name`;
- `observed_at`;
- `verification_status`;
- `notes`.

Sugestão de valores para `verification_status`:

- `official_confirmed`: confirmado em fonte oficial;
- `official_needs_regulation_check`: fonte oficial indica o benefício, mas exige consulta ao regulamento;
- `partner_network`: benefício depende de rede parceira;
- `inferred_from_card_network`: benefício vem da bandeira associada;
- `needs_manual_validation`: precisa validação humana antes de ir para produção.

### 3.4. Não prometer cobertura automática

Para seguros e assistências, o app deve sempre orientar o usuário a confirmar:

- se o cartão está elegível;
- se a compra foi feita com o cartão correto;
- se é necessário emitir bilhete/certificado;
- se há limite de cobertura;
- se há exclusões;
- se dependentes/acompanhantes estão incluídos;
- se a viagem ou compra atende às regras do benefício.

---

## 4. Modelo de dados sugerido

### 4.1. ProviderGroup

Representa a instituição, grupo ou marca principal.

```ts
export type ProviderGroup = {
  id: string;
  name: string;
  legalName?: string;
  category: 'bank' | 'broker' | 'card_network' | 'telecom' | 'subscription' | 'insurance' | 'retail' | 'other';
  country: string;
  websiteUrl?: string;
  logoUrl?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};
```

### 4.2. Program

Representa um programa de pontos, relacionamento, benefícios ou cartões.

```ts
export type Program = {
  id: string;
  providerGroupId: string;
  name: string;
  description?: string;
  programType:
    | 'points'
    | 'cashback'
    | 'investback'
    | 'card_benefits'
    | 'relationship'
    | 'subscription'
    | 'marketplace'
    | 'travel'
    | 'mixed';
  benefitSource: 'issuer' | 'card_network' | 'partner' | 'mixed';
  sourceUrl?: string;
  active: boolean;
};
```

### 4.3. TierOrProduct

Representa o nível, cartão ou faixa de relacionamento.

```ts
export type TierOrProduct = {
  id: string;
  providerGroupId: string;
  programId: string;
  name: string;
  displayName: string;
  productType: 'credit_card' | 'relationship_tier' | 'subscription_plan' | 'card_network_tier' | 'account' | 'other';
  cardNetwork?: 'mastercard' | 'visa' | 'elo' | 'amex' | 'other';
  cardNetworkTier?: 'gold' | 'platinum' | 'black' | 'signature' | 'infinite' | 'infinite_privilege' | 'other';
  eligibilityDescription?: string;
  minimumInvestment?: number;
  minimumIncome?: number;
  minimumMonthlySpend?: number;
  annualFee?: number;
  annualFeeDescription?: string;
  pointsRuleDescription?: string;
  cashbackRuleDescription?: string;
  sourceUrl?: string;
  observedAt: string;
  verificationStatus: string;
  active: boolean;
};
```

### 4.4. Benefit

Representa cada benefício individual.

```ts
export type Benefit = {
  id: string;
  providerGroupId: string;
  programId: string;
  tierOrProductId: string;
  name: string;
  category:
    | 'travel'
    | 'insurance'
    | 'cashback'
    | 'investback'
    | 'points'
    | 'miles'
    | 'shopping'
    | 'restaurant'
    | 'airport'
    | 'concierge'
    | 'investment'
    | 'security'
    | 'account_service'
    | 'international_purchase'
    | 'experience'
    | 'other';
  benefitSource: 'issuer' | 'card_network' | 'partner' | 'mixed';
  shortDescription: string;
  longDescription?: string;
  redemptionType:
    | 'automatic'
    | 'app'
    | 'coupon'
    | 'partner_portal'
    | 'insurance_claim'
    | 'certificate'
    | 'concierge'
    | 'physical_access'
    | 'points_exchange'
    | 'statement_credit'
    | 'other';
  requiresActivation: boolean;
  requiresPurchaseWithEligibleCard?: boolean;
  requiresTicketOrCertificate?: boolean;
  partnerName?: string;
  limitsDescription?: string;
  sourceUrl?: string;
  observedAt: string;
  verificationStatus: string;
  notes?: string;
  active: boolean;
};
```

### 4.5. RedemptionLocation

Representa onde o benefício pode ser usado.

```ts
export type RedemptionLocation = {
  id: string;
  benefitId: string;
  scope: 'online' | 'physical' | 'global_network' | 'countrywide' | 'airport' | 'city' | 'regional' | 'unknown';
  placeName?: string;
  country?: string;
  region?: string;
  state?: string;
  city?: string;
  airportCode?: string;
  terminal?: string;
  latitude?: number;
  longitude?: number;
  geolocationStatus: 'exact' | 'approximate' | 'needs_geocoding' | 'not_applicable';
  notes?: string;
};
```

### 4.6. Question

Representa perguntas do questionário.

```ts
export type Question = {
  id: string;
  text: string;
  helpText?: string;
  answerType: 'single_choice' | 'multi_choice' | 'boolean' | 'number_range' | 'text' | 'currency_range';
  options?: Array<{
    id: string;
    label: string;
    value: string;
  }>;
  mapsToField?: string;
  priority: number;
  active: boolean;
};
```

### 4.7. BenefitMatchRule

Representa a regra que liga uma resposta do questionário a um benefício.

```ts
export type BenefitMatchRule = {
  id: string;
  benefitId: string;
  conditions: Array<{
    field: string;
    operator: 'equals' | 'includes' | 'gte' | 'lte' | 'between' | 'exists';
    value: string | number | boolean | Array<string | number>;
  }>;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
};
```

---

## 5. Fontes oficiais usadas nesta varredura

### Nubank

- Cartão Nubank: https://nubank.com.br/nu/cartao
- Nubank Ultravioleta: https://nubank.com.br/ultravioleta
- Cartão Ultravioleta Mastercard Black: https://nubank.com.br/ultravioleta/cartao-black
- Pontos e Cashback Ultravioleta: https://nubank.com.br/ultravioleta/cartao-black/pontos-cashback
- Salas VIP Ultravioleta: https://nubank.com.br/ultravioleta/cartao-black/salas-vip
- Nubank Ultravioleta Lounge: https://nubank.com.br/ultravioleta/cartao-black/ultravioleta-lounge
- Nu Viagens Ultravioleta: https://nubank.com.br/ultravioleta/nu-viagens

### Inter

- Recompensas Inter: https://inter.co/recompensas/
- Inter Loop: https://inter.co/pra-voce/cartoes/programa-de-pontos/
- Cartões Inter: https://inter.co/pra-voce/cartoes/
- Inter Prime: https://inter.co/pra-voce/relacionamento/inter-prime/
- Inter Win: https://inter.co/pra-voce/relacionamento/inter-win/
- Duo Gourmet Inter: https://inter.co/pra-voce/duo-gourmet/

### XP

- Cartão de Crédito XP: https://www.xpi.com.br/produtos/cartao-de-credito/
- App XP / Experiências por faixa: https://www.xpi.com.br/app/
- Cartão XP Legacy: https://www.xpi.com.br/produtos/cartao-xp-legacy/
- XP Visa Infinite Privilege: https://private.xpi.com.br/xp-visa-infinite-privilege/

### Bandeiras

- Mastercard Gold: https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/gold-credit-card.html
- Mastercard Platinum: https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html
- Mastercard Black: https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/black-credit-card.html
- Visa Benefícios: https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html
- Visa Infinite: https://www.visa.com.br/pague-com-visa/cartoes/cartoes-de-credito/detalhes-visa-infinite.html
- Benefícios Visa Infinite — portal AXA: https://visabenefitslac.axa-assistance.us/benefits/I_C_BR
- Vai de Visa: https://vaidevisa.visa.com.br/

---

# 6. Dados iniciais para cadastro do MVP

## 6.1. ProviderGroups

```json
[
  {
    "id": "provider_nubank",
    "name": "Nubank",
    "category": "bank",
    "country": "BR",
    "websiteUrl": "https://nubank.com.br",
    "active": true
  },
  {
    "id": "provider_inter",
    "name": "Banco Inter",
    "category": "bank",
    "country": "BR",
    "websiteUrl": "https://inter.co",
    "active": true
  },
  {
    "id": "provider_xp",
    "name": "XP",
    "category": "broker",
    "country": "BR",
    "websiteUrl": "https://www.xpi.com.br",
    "active": true
  },
  {
    "id": "provider_mastercard",
    "name": "Mastercard",
    "category": "card_network",
    "country": "GLOBAL",
    "websiteUrl": "https://www.mastercard.com.br",
    "active": true
  },
  {
    "id": "provider_visa",
    "name": "Visa",
    "category": "card_network",
    "country": "GLOBAL",
    "websiteUrl": "https://www.visa.com.br",
    "active": true
  }
]
```

---

## 6.2. Nubank — programas, níveis e benefícios

### 6.2.1. Programas Nubank

```json
[
  {
    "id": "program_nubank_cartao",
    "providerGroupId": "provider_nubank",
    "name": "Cartão Nubank",
    "programType": "card_benefits",
    "benefitSource": "mixed",
    "sourceUrl": "https://nubank.com.br/nu/cartao",
    "active": true
  },
  {
    "id": "program_nubank_ultravioleta",
    "providerGroupId": "provider_nubank",
    "name": "Nubank Ultravioleta",
    "programType": "mixed",
    "benefitSource": "mixed",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black",
    "active": true
  },
  {
    "id": "program_nubank_nu_viagens",
    "providerGroupId": "provider_nubank",
    "name": "Nu Viagens Ultravioleta",
    "programType": "travel",
    "benefitSource": "issuer",
    "sourceUrl": "https://nubank.com.br/ultravioleta/nu-viagens",
    "active": true
  }
]
```

### 6.2.2. Níveis/produtos Nubank

```json
[
  {
    "id": "tier_nubank_mastercard_gold",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "name": "mastercard_gold",
    "displayName": "Cartão Nubank Mastercard Gold",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "gold",
    "eligibilityDescription": "Sujeito à análise de crédito do Nubank. O Nubank posiciona o Gold como nível mais voltado a benefícios de compras.",
    "annualFeeDescription": "Cartão Nubank sem anuidade, conforme comunicação pública do produto.",
    "sourceUrl": "https://nubank.com.br/nu/cartao",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_nubank_mastercard_platinum",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "name": "mastercard_platinum",
    "displayName": "Cartão Nubank Mastercard Platinum",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "platinum",
    "eligibilityDescription": "Sujeito à análise do Nubank. O Nubank posiciona o Platinum como nível mais voltado a benefícios de viagem.",
    "annualFeeDescription": "Cartão Nubank sem anuidade, conforme comunicação pública do produto.",
    "sourceUrl": "https://nubank.com.br/nu/cartao",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_nubank_ultravioleta_black",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "name": "ultravioleta_mastercard_black",
    "displayName": "Nubank Ultravioleta Mastercard Black",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "black",
    "eligibilityDescription": "Produto sujeito à elegibilidade e análise do Nubank.",
    "pointsRuleDescription": "A partir de 2,2 pontos por dólar gasto ou 1,25% de cashback, conforme escolha do cliente.",
    "cashbackRuleDescription": "1,25% de cashback, com opção de uso conforme regras do Nubank Ultravioleta.",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.2.3. Benefícios Nubank

```json
[
  {
    "id": "benefit_nubank_gold_protecao_preco",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "tierOrProductId": "tier_nubank_mastercard_gold",
    "name": "Seguro Proteção de Preço Mastercard Gold",
    "category": "shopping",
    "benefitSource": "card_network",
    "shortDescription": "Possível reembolso da diferença caso o usuário encontre o mesmo item por preço menor após a compra, conforme regras Mastercard Gold.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "partnerName": "Mastercard",
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/gold-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "inferred_from_card_network",
    "notes": "Cadastrar como benefício da bandeira Mastercard Gold associado ao cartão Nubank Gold. Validar limites e elegibilidade antes de produção.",
    "active": true
  },
  {
    "id": "benefit_nubank_gold_compra_protegida",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "tierOrProductId": "tier_nubank_mastercard_gold",
    "name": "Seguro Compra Protegida Mastercard Gold",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Proteção contra roubo ou danos acidentais em itens elegíveis comprados com o cartão Mastercard Gold.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "partnerName": "Mastercard",
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/gold-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "inferred_from_card_network",
    "active": true
  },
  {
    "id": "benefit_nubank_platinum_masterassist_plus",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "tierOrProductId": "tier_nubank_mastercard_platinum",
    "name": "MasterAssist Plus Mastercard Platinum",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Assistência de viagem com reembolso de despesas médicas e outros custos elegíveis, conforme regras Mastercard Platinum.",
    "redemptionType": "certificate",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "requiresTicketOrCertificate": true,
    "partnerName": "Mastercard",
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "inferred_from_card_network",
    "active": true
  },
  {
    "id": "benefit_nubank_platinum_masterseguro_automoveis",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_cartao",
    "tierOrProductId": "tier_nubank_mastercard_platinum",
    "name": "MasterSeguro de Automóveis Mastercard Platinum",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Cobertura para danos a veículo alugado por colisão, roubo, incêndio acidental e vandalismo, conforme regras Mastercard Platinum.",
    "redemptionType": "insurance_claim",
    "requiresActivation": false,
    "requiresPurchaseWithEligibleCard": true,
    "partnerName": "Mastercard",
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "inferred_from_card_network",
    "notes": "Fonte Mastercard informa que pode não exigir emissão de bilhete para este benefício, mas a regra deve ser validada no guia vigente.",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_pontos_cashback",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "Pontos ou Cashback Ultravioleta",
    "category": "points",
    "benefitSource": "issuer",
    "shortDescription": "Cliente escolhe acumular a partir de 2,2 pontos por dólar gasto ou 1,25% de cashback.",
    "redemptionType": "app",
    "requiresActivation": true,
    "partnerName": "Nubank",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black/pontos-cashback",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_transferencia_milhas",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "Transferência de pontos para LATAM, Azul e Gol",
    "category": "miles",
    "benefitSource": "mixed",
    "shortDescription": "Pontos Ultravioleta podem ser transferidos para programas de milhas de LATAM, Azul e Gol, conforme regras do Nubank.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "partnerName": "LATAM Pass, Azul, Gol/Smiles",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black/pontos-cashback",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_priority_pass",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "4 acessos Priority Pass por ano",
    "category": "airport",
    "benefitSource": "partner",
    "shortDescription": "Clientes Ultravioleta têm 4 visitas por ano à rede Priority Pass, com mais de 1.700 salas VIP em mais de 145 países.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Priority Pass",
    "limitsDescription": "4 visitas por ano, conforme regras do Nubank Ultravioleta.",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black/salas-vip",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_lounge_gru",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "Nubank Ultravioleta Lounge em Guarulhos",
    "category": "airport",
    "benefitSource": "issuer",
    "shortDescription": "Acesso gratuito e ilimitado ao Nubank Ultravioleta Lounge no Aeroporto Internacional de São Paulo/Guarulhos.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Nubank",
    "limitsDescription": "Entrada permitida até 3 horas antes do voo; verificar regras de acompanhante no regulamento vigente.",
    "sourceUrl": "https://nubank.com.br/ultravioleta/cartao-black/ultravioleta-lounge",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_nu_viagens",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_nu_viagens",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "Nu Viagens Ultravioleta",
    "category": "travel",
    "benefitSource": "issuer",
    "shortDescription": "Benefícios em passagens e hotéis, com acúmulo de 9 pontos por dólar ou 5% de cashback, parcelamento e garantia de melhor preço conforme regras.",
    "redemptionType": "app",
    "requiresActivation": true,
    "partnerName": "Nubank",
    "sourceUrl": "https://nubank.com.br/ultravioleta/nu-viagens",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_nubank_ultravioleta_iof_zero",
    "providerGroupId": "provider_nubank",
    "programId": "program_nubank_ultravioleta",
    "tierOrProductId": "tier_nubank_ultravioleta_black",
    "name": "Compras internacionais com IOF zero",
    "category": "international_purchase",
    "benefitSource": "issuer",
    "shortDescription": "Compras internacionais no crédito com IOF zero e spread reduzido informado pelo Nubank Ultravioleta.",
    "redemptionType": "automatic",
    "requiresActivation": false,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://nubank.com.br/ultravioleta",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.2.4. Locais de resgate Nubank

```json
[
  {
    "id": "loc_nubank_ultravioleta_lounge_gru_t3",
    "benefitId": "benefit_nubank_ultravioleta_lounge_gru",
    "scope": "airport",
    "placeName": "Nubank Ultravioleta Lounge — Aeroporto Internacional de São Paulo/Guarulhos",
    "country": "BR",
    "region": "Sudeste",
    "state": "SP",
    "city": "Guarulhos",
    "airportCode": "GRU",
    "terminal": "Terminal 3",
    "geolocationStatus": "needs_geocoding",
    "notes": "Confirmar localização exata dentro do terminal em fonte operacional antes de exibir mapa."
  },
  {
    "id": "loc_nubank_priority_pass_global",
    "benefitId": "benefit_nubank_ultravioleta_priority_pass",
    "scope": "global_network",
    "placeName": "Rede Priority Pass",
    "country": "GLOBAL",
    "geolocationStatus": "not_applicable",
    "notes": "Rede global com mais de 1.700 salas; localização deve ser resolvida via base/integração Priority Pass."
  },
  {
    "id": "loc_nubank_nu_viagens_online",
    "benefitId": "benefit_nubank_ultravioleta_nu_viagens",
    "scope": "online",
    "placeName": "App Nubank / Nu Viagens",
    "country": "BR",
    "geolocationStatus": "not_applicable"
  }
]
```

---

## 6.3. Inter — programas, níveis e benefícios

### 6.3.1. Programas Inter

```json
[
  {
    "id": "program_inter_recompensas",
    "providerGroupId": "provider_inter",
    "name": "Recompensas Inter",
    "programType": "mixed",
    "benefitSource": "issuer",
    "sourceUrl": "https://inter.co/recompensas/",
    "active": true
  },
  {
    "id": "program_inter_loop",
    "providerGroupId": "provider_inter",
    "name": "Inter Loop",
    "programType": "points",
    "benefitSource": "issuer",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "active": true
  },
  {
    "id": "program_inter_cartoes",
    "providerGroupId": "provider_inter",
    "name": "Cartões Inter",
    "programType": "card_benefits",
    "benefitSource": "mixed",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/",
    "active": true
  },
  {
    "id": "program_inter_prime",
    "providerGroupId": "provider_inter",
    "name": "Inter Prime",
    "programType": "relationship",
    "benefitSource": "issuer",
    "sourceUrl": "https://inter.co/pra-voce/relacionamento/inter-prime/",
    "active": true
  },
  {
    "id": "program_inter_win",
    "providerGroupId": "provider_inter",
    "name": "Inter Win",
    "programType": "relationship",
    "benefitSource": "issuer",
    "sourceUrl": "https://inter.co/pra-voce/relacionamento/inter-win/",
    "active": true
  },
  {
    "id": "program_inter_duo_gourmet",
    "providerGroupId": "provider_inter",
    "name": "Duo Gourmet Inter",
    "programType": "subscription",
    "benefitSource": "partner",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "active": true
  }
]
```

### 6.3.2. Níveis/produtos Inter

```json
[
  {
    "id": "tier_inter_gold",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_cartoes",
    "name": "inter_gold",
    "displayName": "Cartão Inter Gold",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "gold",
    "eligibilityDescription": "Ao abrir conta gratuita, cliente pode receber o Inter Gold, sujeito à análise de crédito.",
    "pointsRuleDescription": "1 ponto Loop a cada R$ 10,00 gastos no crédito. Para cartões Gold, Platinum e Prime, a fonte oficial informa necessidade de débito automático da fatura ativo para acumular pontos.",
    "annualFeeDescription": "Sem anuidade.",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_inter_platinum",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_cartoes",
    "name": "inter_platinum",
    "displayName": "Cartão Inter Platinum",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "platinum",
    "eligibilityDescription": "Portabilidade de salário de R$ 6 mil ou mais por 3 meses consecutivos ou média de R$ 5.000 em 4 faturas consecutivas, conforme fonte oficial.",
    "minimumIncome": 6000,
    "minimumMonthlySpend": 5000,
    "pointsRuleDescription": "1 ponto Loop a cada R$ 5,00 gastos no crédito.",
    "annualFeeDescription": "Sem anuidade.",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_inter_prime",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_prime",
    "name": "inter_prime",
    "displayName": "Inter Prime / Cartão Inter Prime",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "black",
    "eligibilityDescription": "Plano anual Duo Gourmet ou média de R$ 7.000 em 4 faturas, conforme página de cartões; também pode ser associado ao relacionamento Prime.",
    "minimumMonthlySpend": 7000,
    "pointsRuleDescription": "1 ponto Loop a cada R$ 2,50 em compras no crédito.",
    "annualFeeDescription": "Sem anuidade.",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_inter_win",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_win",
    "name": "inter_win",
    "displayName": "Inter Win / Cartão Inter Win",
    "productType": "credit_card",
    "cardNetwork": "mastercard",
    "cardNetworkTier": "black",
    "eligibilityDescription": "Carteira de investimentos a partir de R$ 1 milhão no Banco Inter.",
    "minimumInvestment": 1000000,
    "pointsRuleDescription": "1 ponto Loop a cada R$ 2,00 em compras no crédito.",
    "annualFeeDescription": "Sem anuidade.",
    "sourceUrl": "https://inter.co/pra-voce/relacionamento/inter-win/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_inter_duo_gourmet_anual",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_duo_gourmet",
    "name": "duo_gourmet_anual",
    "displayName": "Duo Gourmet Inter — Plano anual",
    "productType": "subscription_plan",
    "eligibilityDescription": "Assinatura anual do Duo Gourmet Inter.",
    "annualFeeDescription": "Valor promocional observado na página em 2026-06-15; não cadastrar preço fixo em produção sem rotina de atualização.",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.3.3. Benefícios Inter

```json
[
  {
    "id": "benefit_inter_loop_pontos_gold",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_gold",
    "name": "Inter Loop — Gold",
    "category": "points",
    "benefitSource": "issuer",
    "shortDescription": "Acúmulo de 1 ponto Loop a cada R$ 10,00 gastos no crédito.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "limitsDescription": "Para Gold, Platinum e Prime, fonte oficial informa necessidade de débito automático da fatura ativo para acumular pontos.",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_pontos_platinum",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_platinum",
    "name": "Inter Loop — Platinum",
    "category": "points",
    "benefitSource": "issuer",
    "shortDescription": "Acúmulo de 1 ponto Loop a cada R$ 5,00 gastos no crédito.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_pontos_prime",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_prime",
    "name": "Inter Loop — Prime",
    "category": "points",
    "benefitSource": "issuer",
    "shortDescription": "Acúmulo de 1 ponto Loop a cada R$ 2,50 gastos no crédito.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_pontos_win",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_win",
    "name": "Inter Loop — Win",
    "category": "points",
    "benefitSource": "issuer",
    "shortDescription": "Acúmulo de 1 ponto Loop a cada R$ 2,00 gastos no crédito.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_resgate_milhas",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_prime",
    "name": "Troca de pontos Inter Loop por milhas",
    "category": "miles",
    "benefitSource": "mixed",
    "shortDescription": "Pontos Loop podem ser trocados por milhas aéreas. A fonte oficial cita Azul para clientes em geral e Smiles para clientes Prime ou Win.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "partnerName": "Azul, Smiles",
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_desconto_fatura",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_gold",
    "name": "Desconto na fatura com pontos Loop",
    "category": "cashback",
    "benefitSource": "issuer",
    "shortDescription": "Uso de pontos Loop para obter desconto na fatura do cartão.",
    "redemptionType": "statement_credit",
    "requiresActivation": true,
    "sourceUrl": "https://inter.co/recompensas/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_cashback_inter_shop",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_gold",
    "name": "Cashback extra no Inter Shop",
    "category": "shopping",
    "benefitSource": "issuer",
    "shortDescription": "Pontos Loop podem gerar cashback extra em compras no shopping do Inter.",
    "redemptionType": "app",
    "requiresActivation": true,
    "sourceUrl": "https://inter.co/recompensas/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_loop_dolares_global_account",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_loop",
    "tierOrProductId": "tier_inter_prime",
    "name": "Troca de pontos por dólares na Global Account",
    "category": "account_service",
    "benefitSource": "issuer",
    "shortDescription": "Pontos Loop podem ser convertidos em dólares na Global Account, conforme regras do Inter.",
    "redemptionType": "points_exchange",
    "requiresActivation": true,
    "sourceUrl": "https://inter.co/pra-voce/cartoes/programa-de-pontos/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_prime_salas_vip_inter",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_prime",
    "tierOrProductId": "tier_inter_prime",
    "name": "Salas VIP Inter para clientes Prime",
    "category": "airport",
    "benefitSource": "issuer",
    "shortDescription": "Acesso às Salas VIP Inter em aeroportos informados na página do Duo Gourmet/Inter Prime.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Inter",
    "limitsDescription": "A página do Duo Gourmet informa acesso ilimitado às salas VIP Inter para quem assina plano anual e desbloqueia Inter Prime. Confirmar regras no regulamento Prime.",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_needs_regulation_check",
    "active": true
  },
  {
    "id": "benefit_inter_prime_priority_pass",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_prime",
    "tierOrProductId": "tier_inter_prime",
    "name": "Priority Pass Inter Prime",
    "category": "airport",
    "benefitSource": "partner",
    "shortDescription": "A página Duo Gourmet/Inter Prime informa 6 acessos anuais às salas VIP Priority Pass ao redor do mundo.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Priority Pass",
    "limitsDescription": "6 acessos anuais informados na página do Duo Gourmet. Confirmar regras de elegibilidade e plano vigente.",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_needs_regulation_check",
    "active": true
  },
  {
    "id": "benefit_inter_duo_gourmet_2_por_1",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_duo_gourmet",
    "tierOrProductId": "tier_inter_duo_gourmet_anual",
    "name": "Duo Gourmet — 2 pratos pelo preço de 1",
    "category": "restaurant",
    "benefitSource": "partner",
    "shortDescription": "Benefício de pedir 2 pratos e pagar 1 em restaurantes participantes, sem limite de uso informado na página.",
    "redemptionType": "app",
    "requiresActivation": true,
    "partnerName": "Duo Gourmet",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_duo_experiencias",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_duo_gourmet",
    "tierOrProductId": "tier_inter_duo_gourmet_anual",
    "name": "Duo Experiências — lazer, viagem e bem-estar",
    "category": "experience",
    "benefitSource": "partner",
    "shortDescription": "Descontos em experiências de viagem, lazer, bem-estar, hotéis, aluguel de carro, passeios, cinemas, teatros e parques, conforme parceiros disponíveis.",
    "redemptionType": "app",
    "requiresActivation": true,
    "partnerName": "Duo Gourmet",
    "sourceUrl": "https://inter.co/pra-voce/duo-gourmet/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_inter_win_gestao_patrimonial",
    "providerGroupId": "provider_inter",
    "programId": "program_inter_win",
    "tierOrProductId": "tier_inter_win",
    "name": "Gestão patrimonial Inter Win",
    "category": "investment",
    "benefitSource": "issuer",
    "shortDescription": "Atendimento com profissionais dedicados, diagnóstico patrimonial, análise de mercado e estratégias alinhadas a objetivos financeiros.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://inter.co/pra-voce/relacionamento/inter-win/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.3.4. Locais de resgate Inter

```json
[
  {
    "id": "loc_inter_vip_lounge_gru",
    "benefitId": "benefit_inter_prime_salas_vip_inter",
    "scope": "airport",
    "placeName": "Sala VIP Inter — Aeroporto de Guarulhos",
    "country": "BR",
    "region": "Sudeste",
    "state": "SP",
    "city": "Guarulhos",
    "airportCode": "GRU",
    "geolocationStatus": "needs_geocoding",
    "notes": "Confirmar terminal e regras de acesso no app/regulamento."
  },
  {
    "id": "loc_inter_vip_lounge_cwb",
    "benefitId": "benefit_inter_prime_salas_vip_inter",
    "scope": "airport",
    "placeName": "Sala VIP Inter — Aeroporto de Curitiba",
    "country": "BR",
    "region": "Sul",
    "state": "PR",
    "city": "São José dos Pinhais / Curitiba",
    "airportCode": "CWB",
    "geolocationStatus": "needs_geocoding",
    "notes": "Aeroporto Internacional Afonso Pena atende Curitiba. Confirmar detalhes operacionais."
  },
  {
    "id": "loc_inter_vip_lounge_cnf",
    "benefitId": "benefit_inter_prime_salas_vip_inter",
    "scope": "airport",
    "placeName": "Sala VIP Inter — Aeroporto de Confins",
    "country": "BR",
    "region": "Sudeste",
    "state": "MG",
    "city": "Confins",
    "airportCode": "CNF",
    "geolocationStatus": "needs_geocoding",
    "notes": "Confirmar detalhes operacionais."
  },
  {
    "id": "loc_inter_vip_lounge_for",
    "benefitId": "benefit_inter_prime_salas_vip_inter",
    "scope": "airport",
    "placeName": "Sala VIP Inter — Aeroporto de Fortaleza",
    "country": "BR",
    "region": "Nordeste",
    "state": "CE",
    "city": "Fortaleza",
    "airportCode": "FOR",
    "geolocationStatus": "needs_geocoding",
    "notes": "A página Duo Gourmet/Inter Prime cita Fortaleza; validar em regulamento ou app antes de exibir como confirmado em produção."
  },
  {
    "id": "loc_inter_priority_pass_global",
    "benefitId": "benefit_inter_prime_priority_pass",
    "scope": "global_network",
    "placeName": "Rede Priority Pass",
    "country": "GLOBAL",
    "geolocationStatus": "not_applicable"
  },
  {
    "id": "loc_inter_shop_online",
    "benefitId": "benefit_inter_loop_cashback_inter_shop",
    "scope": "online",
    "placeName": "Super App Inter / Inter Shop",
    "country": "BR",
    "geolocationStatus": "not_applicable"
  },
  {
    "id": "loc_inter_duo_gourmet_global",
    "benefitId": "benefit_inter_duo_gourmet_2_por_1",
    "scope": "global_network",
    "placeName": "Rede Duo Gourmet de restaurantes participantes",
    "country": "BR/GLOBAL",
    "geolocationStatus": "not_applicable",
    "notes": "A fonte informa centenas de cidades no Brasil e exterior. Para geolocalização real, integrar/capturar base de restaurantes participantes."
  }
]
```

---

## 6.4. XP — programas, níveis e benefícios

### 6.4.1. Programas XP

```json
[
  {
    "id": "program_xp_cartoes",
    "providerGroupId": "provider_xp",
    "name": "Cartões XP",
    "programType": "card_benefits",
    "benefitSource": "mixed",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "active": true
  },
  {
    "id": "program_xp_experiencia",
    "providerGroupId": "provider_xp",
    "name": "Experiência XP",
    "programType": "relationship",
    "benefitSource": "issuer",
    "sourceUrl": "https://www.xpi.com.br/app/",
    "active": true
  },
  {
    "id": "program_xp_legacy",
    "providerGroupId": "provider_xp",
    "name": "Cartão XP Legacy",
    "programType": "mixed",
    "benefitSource": "mixed",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "active": true
  },
  {
    "id": "program_xp_private_privilege",
    "providerGroupId": "provider_xp",
    "name": "XP Visa Infinite Privilege",
    "programType": "mixed",
    "benefitSource": "mixed",
    "sourceUrl": "https://private.xpi.com.br/xp-visa-infinite-privilege/",
    "active": true
  }
]
```

### 6.4.2. Níveis/produtos XP

```json
[
  {
    "id": "tier_xp_one",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "name": "xp_one",
    "displayName": "Cartão XP One",
    "productType": "credit_card",
    "cardNetwork": "visa",
    "cardNetworkTier": "infinite",
    "eligibilityDescription": "A partir de R$ 5 mil em investimentos líquidos, conforme página de cartões XP.",
    "minimumInvestment": 5000,
    "pointsRuleDescription": "Até 1,8 Pontos XP por dólar ou até 1,1% de Investback com Turbo Benefícios, conforme fonte oficial.",
    "annualFeeDescription": "Anuidade zero, conforme fonte oficial.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_xp_infinite",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "name": "xp_infinite",
    "displayName": "Cartão XP Infinite",
    "productType": "credit_card",
    "cardNetwork": "visa",
    "cardNetworkTier": "infinite",
    "eligibilityDescription": "A partir de R$ 50 mil em investimentos líquidos, conforme página de cartões XP.",
    "minimumInvestment": 50000,
    "pointsRuleDescription": "Até 3 Pontos XP por dólar ou até 1,5% de Investback com Turbo Benefícios.",
    "annualFeeDescription": "Anuidade zero, conforme fonte oficial.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_xp_legacy",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "name": "xp_legacy",
    "displayName": "Cartão XP Legacy",
    "productType": "credit_card",
    "cardNetwork": "visa",
    "cardNetworkTier": "infinite",
    "eligibilityDescription": "Produto premium da XP; usar como referência R$ 1 milhão em investimentos líquidos, conforme varredura anterior e posicionamento do produto. Validar regra vigente antes de produção.",
    "minimumInvestment": 1000000,
    "pointsRuleDescription": "9,5 Pontos XP por dólar em compras internacionais e 3 Pontos XP por dólar em compras nacionais; com Turbo Benefícios pode haver até 10 pontos XP/USD conforme comunicação anterior, validar regra vigente.",
    "cashbackRuleDescription": "5,3% de Investback em compras internacionais e 1,5% em compras nacionais, conforme página Legacy observada.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_needs_regulation_check",
    "active": true
  },
  {
    "id": "tier_xp_digital",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "name": "xp_digital",
    "displayName": "XP Digital",
    "productType": "relationship_tier",
    "eligibilityDescription": "Até R$ 100 mil investidos na XP.",
    "minimumInvestment": 0,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_xp_exclusive",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "name": "xp_exclusive",
    "displayName": "XP Exclusive",
    "productType": "relationship_tier",
    "eligibilityDescription": "Entre R$ 100 mil e R$ 300 mil investidos na XP.",
    "minimumInvestment": 100000,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_xp_signature",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "name": "xp_signature",
    "displayName": "XP Signature",
    "productType": "relationship_tier",
    "eligibilityDescription": "Entre R$ 300 mil e R$ 3 milhões investidos na XP.",
    "minimumInvestment": 300000,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "tier_xp_unique",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "name": "xp_unique",
    "displayName": "XP Unique",
    "productType": "relationship_tier",
    "eligibilityDescription": "Entre R$ 3 milhões e R$ 10 milhões investidos na XP.",
    "minimumInvestment": 3000000,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.4.3. Benefícios XP

```json
[
  {
    "id": "benefit_xp_one_pontos_investback",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "tierOrProductId": "tier_xp_one",
    "name": "Pontos XP ou Investback — XP One",
    "category": "investback",
    "benefitSource": "issuer",
    "shortDescription": "Até 1,8 Pontos XP por dólar ou até 1,1% de Investback com Turbo Benefícios.",
    "redemptionType": "app",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_one_sala_vip",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "tierOrProductId": "tier_xp_one",
    "name": "Salas VIP — XP One",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Até 2 acessos por ano a salas VIP, conforme regras do cartão e gasto no cartão.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "limitsDescription": "Validar regra vigente no app/regulamento XP antes de produção.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_needs_regulation_check",
    "active": true
  },
  {
    "id": "benefit_xp_infinite_pontos_investback",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "tierOrProductId": "tier_xp_infinite",
    "name": "Pontos XP ou Investback — XP Infinite",
    "category": "investback",
    "benefitSource": "issuer",
    "shortDescription": "Até 3 Pontos XP por dólar ou até 1,5% de Investback com Turbo Benefícios.",
    "redemptionType": "app",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_infinite_sala_vip",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "tierOrProductId": "tier_xp_infinite",
    "name": "4 acessos por ano a salas VIP — XP Infinite",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Cartão XP Infinite informa 4 acessos por ano a salas VIP.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "limitsDescription": "4 acessos por ano, conforme fonte XP.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_fast_pass_gru_gig",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_cartoes",
    "tierOrProductId": "tier_xp_infinite",
    "name": "Fast Pass GRU/GIG",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Benefício de fila diferenciada nos aeroportos internacionais de Guarulhos e Galeão, conforme comunicação XP/Visa.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Visa",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-de-credito/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_legacy_pontos_investback",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Pontos XP ou Investback — XP Legacy",
    "category": "investback",
    "benefitSource": "issuer",
    "shortDescription": "9,5 Pontos XP por dólar em compras internacionais e 3 Pontos XP por dólar em compras nacionais; ou 5,3% de Investback em compras internacionais e 1,5% em compras nacionais.",
    "redemptionType": "app",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_legacy_salas_vip_ilimitado",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Salas VIP ilimitadas — XP Legacy",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Acesso ilimitado para o titular a mais de 1.300 salas VIP pelo mundo; até 12 convidados por ano, conforme condições.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Visa / rede parceira",
    "limitsDescription": "Acesso ilimitado para titular; até 12 convidados por ano. Consultar condições.",
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_legacy_meet_greet",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Meet & Greet — XP Legacy",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Atendimento dedicado para embarques e desembarques com agilidade, consultado via Concierge Cartão XP Legacy.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_legacy_vistos_passaportes",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Consultoria de vistos e passaportes — XP Legacy",
    "category": "travel",
    "benefitSource": "partner",
    "shortDescription": "Suporte especializado para emissão, renovação e regularização de documentos de viagem.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_legacy_concierge",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_legacy",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Concierge Cartão XP Legacy",
    "category": "concierge",
    "benefitSource": "issuer",
    "shortDescription": "Concierge com roteiros personalizados, apoio em viagens, hotéis, gastronomia e eventos.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.xpi.com.br/produtos/cartao-xp-legacy/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_private_visa_infinite_privilege_lounge",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_private_privilege",
    "tierOrProductId": "tier_xp_legacy",
    "name": "Visa Infinite Privilege Lounge — XP Private",
    "category": "airport",
    "benefitSource": "mixed",
    "shortDescription": "Acesso ao Visa Infinite Privilege Lounge no Aeroporto Internacional de Guarulhos para público elegível XP Private.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "partnerName": "Visa",
    "sourceUrl": "https://private.xpi.com.br/xp-visa-infinite-privilege/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_experience_signature_assessoria",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "tierOrProductId": "tier_xp_signature",
    "name": "Assessoria dedicada XP Signature",
    "category": "investment",
    "benefitSource": "issuer",
    "shortDescription": "Assessoria dedicada, atendimento presencial/vídeo/telefone, mesa de operações e eventos exclusivos.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_xp_experience_unique_wealth_planning",
    "providerGroupId": "provider_xp",
    "programId": "program_xp_experiencia",
    "tierOrProductId": "tier_xp_unique",
    "name": "Wealth Planning XP Unique",
    "category": "investment",
    "benefitSource": "issuer",
    "shortDescription": "Bankers CFP, banker offshore, wealth planning, planejamento sucessório, fundos exclusivos e soluções customizadas.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.xpi.com.br/app/",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.4.4. Locais de resgate XP

```json
[
  {
    "id": "loc_xp_fast_pass_gru",
    "benefitId": "benefit_xp_fast_pass_gru_gig",
    "scope": "airport",
    "placeName": "Aeroporto Internacional de São Paulo/Guarulhos",
    "country": "BR",
    "region": "Sudeste",
    "state": "SP",
    "city": "Guarulhos",
    "airportCode": "GRU",
    "geolocationStatus": "needs_geocoding"
  },
  {
    "id": "loc_xp_fast_pass_gig",
    "benefitId": "benefit_xp_fast_pass_gru_gig",
    "scope": "airport",
    "placeName": "Aeroporto Internacional do Rio de Janeiro/Galeão",
    "country": "BR",
    "region": "Sudeste",
    "state": "RJ",
    "city": "Rio de Janeiro",
    "airportCode": "GIG",
    "geolocationStatus": "needs_geocoding"
  },
  {
    "id": "loc_xp_legacy_salas_vip_global",
    "benefitId": "benefit_xp_legacy_salas_vip_ilimitado",
    "scope": "global_network",
    "placeName": "Rede global de salas VIP informada pela XP Legacy",
    "country": "GLOBAL",
    "geolocationStatus": "not_applicable",
    "notes": "Fonte informa mais de 1.300 salas VIP pelo mundo. Para mapa, integrar rede parceira utilizada pela XP/Visa."
  },
  {
    "id": "loc_xp_private_privilege_lounge_gru",
    "benefitId": "benefit_xp_private_visa_infinite_privilege_lounge",
    "scope": "airport",
    "placeName": "Visa Infinite Privilege Lounge — Aeroporto Internacional de Guarulhos",
    "country": "BR",
    "region": "Sudeste",
    "state": "SP",
    "city": "Guarulhos",
    "airportCode": "GRU",
    "geolocationStatus": "needs_geocoding"
  }
]
```

---

## 6.5. Benefícios de bandeira — Mastercard

### 6.5.1. Mastercard Gold

```json
[
  {
    "id": "benefit_mastercard_gold_protecao_preco",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_gold",
    "tierOrProductId": "tier_mastercard_gold",
    "name": "Seguro Proteção de Preço Mastercard Gold",
    "category": "shopping",
    "benefitSource": "card_network",
    "shortDescription": "Reembolso da diferença se o usuário encontrar o mesmo item por preço menor após a compra, conforme regras Mastercard Gold.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/gold-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_mastercard_gold_compra_protegida",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_gold",
    "tierOrProductId": "tier_mastercard_gold",
    "name": "Seguro Compra Protegida Mastercard Gold",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Reembolso por roubo e/ou danos acidentais na compra de itens cobertos.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/gold-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.5.2. Mastercard Platinum

```json
[
  {
    "id": "benefit_mastercard_platinum_concierge",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_platinum",
    "tierOrProductId": "tier_mastercard_platinum",
    "name": "Concierge Mastercard Platinum",
    "category": "concierge",
    "benefitSource": "card_network",
    "shortDescription": "Concierge para organização de viagens, assistência global de emergência, entretenimento, informações e indicações.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_mastercard_platinum_masterassist_plus",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_platinum",
    "tierOrProductId": "tier_mastercard_platinum",
    "name": "MasterAssist Plus",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Reembolso de despesas médicas, convalescença em hotel, custos de viagens emergenciais para parentes e outros itens elegíveis.",
    "redemptionType": "certificate",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "requiresTicketOrCertificate": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_mastercard_platinum_masterseguro_automoveis",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_platinum",
    "tierOrProductId": "tier_mastercard_platinum",
    "name": "MasterSeguro de Automóveis",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Seguro que cobre danos a veículo alugado por colisão, roubo, incêndio acidental e vandalismo.",
    "redemptionType": "insurance_claim",
    "requiresActivation": false,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/platinum-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.5.3. Mastercard Black

```json
[
  {
    "id": "benefit_mastercard_black_compra_protegida",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_black",
    "tierOrProductId": "tier_mastercard_black",
    "name": "Compra Protegida Mastercard Black",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Reembolso por roubo e/ou danos acidentais em itens cobertos comprados com cartão elegível.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/black-credit-card.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_mastercard_black_garantia_estendida",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_black",
    "tierOrProductId": "tier_mastercard_black",
    "name": "Garantia Estendida Original Mastercard Black",
    "category": "shopping",
    "benefitSource": "card_network",
    "shortDescription": "Duplica a garantia original do fabricante/loja por até 1 ano, respeitando limite máximo de cobertura total informado pela Mastercard.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/black-credit-card/garantia-estendida-original.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_mastercard_black_concierge",
    "providerGroupId": "provider_mastercard",
    "programId": "program_mastercard_black",
    "tierOrProductId": "tier_mastercard_black",
    "name": "Mastercard Concierge Black",
    "category": "concierge",
    "benefitSource": "card_network",
    "shortDescription": "Serviço de concierge para viagens, restaurantes, entretenimento e assistência em experiências.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.mastercard.com/br/pt/personal/find-a-card/credit-card/black-credit-card/concierge.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

---

## 6.6. Benefícios de bandeira — Visa

### 6.6.1. Visa Infinite

```json
[
  {
    "id": "benefit_visa_infinite_seguro_emergencia_medica",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Seguro Emergência Médica Internacional Visa Infinite",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Proteção para acidentes ou emergências médicas internacionais em viagens, conforme regras Visa.",
    "redemptionType": "certificate",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "requiresTicketOrCertificate": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_seguro_veiculo_locadora",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Seguro para Veículos de Locadora Visa Infinite",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Proteção gratuita contra roubo e danos ao pagar e reservar a locação de automóvel com cartão Visa elegível.",
    "redemptionType": "insurance_claim",
    "requiresActivation": false,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.visa.com.br/pt_br/shopping/so-com-visa/seguro-para-ve%C3%ADculos-de-locadora/141828",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_cancelamento_viagem",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Seguro Cancelamento de Viagem Visa Infinite",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Benefício de seguro para cancelamento de viagem, conforme regras Visa Infinite.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://visabenefitslac.axa-assistance.us/benefits/I_C_BR",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_bagagem",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Seguro Perda, Roubo ou Atraso de Bagagem Visa Infinite",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Benefícios relacionados a perda, roubo ou atraso de bagagem, conforme regras Visa Infinite.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_fast_pass",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Visa Infinite Fast Pass",
    "category": "airport",
    "benefitSource": "card_network",
    "shortDescription": "Acesso exclusivo Visa de embarque nos terminais 2 e 3 do Aeroporto de Guarulhos e no RIOgaleão.",
    "redemptionType": "physical_access",
    "requiresActivation": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_airport_companion",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Visa Airport Companion",
    "category": "airport",
    "benefitSource": "card_network",
    "shortDescription": "Benefício de acesso a experiências e serviços em aeroportos via Visa Airport Companion, conforme elegibilidade do cartão.",
    "redemptionType": "partner_portal",
    "requiresActivation": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_protecao_compra",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Proteção de Compra Visa Infinite",
    "category": "shopping",
    "benefitSource": "card_network",
    "shortDescription": "Proteção contra roubo, furto ou danos acidentais em compras feitas com Cartão Visa elegível.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_infinite_concierge",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_infinite",
    "tierOrProductId": "tier_visa_infinite",
    "name": "Visa Concierge",
    "category": "concierge",
    "benefitSource": "card_network",
    "shortDescription": "Assistência pessoal 24h para voos, restaurantes, presentes e outras solicitações elegíveis.",
    "redemptionType": "concierge",
    "requiresActivation": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/cartoes-de-credito/detalhes-visa-infinite.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.6.2. Visa Signature

```json
[
  {
    "id": "benefit_visa_signature_airport_companion",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_signature",
    "tierOrProductId": "tier_visa_signature",
    "name": "Visa Airport Companion — Signature",
    "category": "airport",
    "benefitSource": "card_network",
    "shortDescription": "Benefício de aeroportos disponível para cartões Visa Signature elegíveis, conforme regras Visa.",
    "redemptionType": "partner_portal",
    "requiresActivation": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_signature_seguro_emergencia_medica",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_signature",
    "tierOrProductId": "tier_visa_signature",
    "name": "Seguro Emergência Médica Internacional Visa Signature",
    "category": "insurance",
    "benefitSource": "card_network",
    "shortDescription": "Seguro de emergência médica internacional para cartões Visa Signature elegíveis, conforme regras Visa.",
    "redemptionType": "certificate",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "requiresTicketOrCertificate": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  },
  {
    "id": "benefit_visa_signature_protecao_compra",
    "providerGroupId": "provider_visa",
    "programId": "program_visa_signature",
    "tierOrProductId": "tier_visa_signature",
    "name": "Proteção de Compra Visa Signature",
    "category": "shopping",
    "benefitSource": "card_network",
    "shortDescription": "Proteção contra roubo, furto ou danos acidentais em compras feitas com Cartão Visa elegível.",
    "redemptionType": "insurance_claim",
    "requiresActivation": true,
    "requiresPurchaseWithEligibleCard": true,
    "sourceUrl": "https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html",
    "observedAt": "2026-06-15",
    "verificationStatus": "official_confirmed",
    "active": true
  }
]
```

### 6.6.3. Locais de resgate Visa

```json
[
  {
    "id": "loc_visa_fast_pass_gru_t2_t3",
    "benefitId": "benefit_visa_infinite_fast_pass",
    "scope": "airport",
    "placeName": "Visa Infinite Fast Pass — Aeroporto Internacional de São Paulo/Guarulhos",
    "country": "BR",
    "region": "Sudeste",
    "state": "SP",
    "city": "Guarulhos",
    "airportCode": "GRU",
    "terminal": "Terminais 2 e 3",
    "geolocationStatus": "needs_geocoding"
  },
  {
    "id": "loc_visa_fast_pass_gig",
    "benefitId": "benefit_visa_infinite_fast_pass",
    "scope": "airport",
    "placeName": "Visa Infinite Fast Pass — RIOgaleão",
    "country": "BR",
    "region": "Sudeste",
    "state": "RJ",
    "city": "Rio de Janeiro",
    "airportCode": "GIG",
    "geolocationStatus": "needs_geocoding"
  },
  {
    "id": "loc_visa_airport_companion_global",
    "benefitId": "benefit_visa_infinite_airport_companion",
    "scope": "global_network",
    "placeName": "Visa Airport Companion",
    "country": "GLOBAL",
    "geolocationStatus": "not_applicable",
    "notes": "Rede/serviços devem ser resolvidos no app ou portal Visa Airport Companion."
  },
  {
    "id": "loc_vaidevisa_online",
    "benefitId": "benefit_visa_infinite_protecao_compra",
    "scope": "online",
    "placeName": "Portal de Benefícios Visa / Vai de Visa",
    "country": "BR",
    "geolocationStatus": "not_applicable"
  }
]
```

---

# 7. Perguntas sugeridas para o questionário do MVP

## 7.1. Perguntas de identificação de instituições

```json
[
  {
    "id": "q_bancos_corretoras",
    "text": "Quais bancos ou corretoras você usa hoje?",
    "answerType": "multi_choice",
    "options": [
      { "id": "nubank", "label": "Nubank", "value": "provider_nubank" },
      { "id": "inter", "label": "Banco Inter", "value": "provider_inter" },
      { "id": "xp", "label": "XP", "value": "provider_xp" },
      { "id": "outros", "label": "Outros", "value": "other" }
    ],
    "mapsToField": "providerGroupIds",
    "priority": 1,
    "active": true
  },
  {
    "id": "q_cartoes_possui",
    "text": "Quais cartões você possui?",
    "helpText": "Marque todos que você tem, mesmo que não use com frequência.",
    "answerType": "multi_choice",
    "options": [
      { "id": "nubank_gold", "label": "Nubank Mastercard Gold", "value": "tier_nubank_mastercard_gold" },
      { "id": "nubank_platinum", "label": "Nubank Mastercard Platinum", "value": "tier_nubank_mastercard_platinum" },
      { "id": "nubank_ultravioleta", "label": "Nubank Ultravioleta Mastercard Black", "value": "tier_nubank_ultravioleta_black" },
      { "id": "inter_gold", "label": "Inter Gold", "value": "tier_inter_gold" },
      { "id": "inter_platinum", "label": "Inter Platinum", "value": "tier_inter_platinum" },
      { "id": "inter_prime", "label": "Inter Prime", "value": "tier_inter_prime" },
      { "id": "inter_win", "label": "Inter Win", "value": "tier_inter_win" },
      { "id": "xp_one", "label": "XP One", "value": "tier_xp_one" },
      { "id": "xp_infinite", "label": "XP Infinite", "value": "tier_xp_infinite" },
      { "id": "xp_legacy", "label": "XP Legacy", "value": "tier_xp_legacy" }
    ],
    "mapsToField": "tierOrProductIds",
    "priority": 2,
    "active": true
  }
]
```

## 7.2. Perguntas de perfil de uso

```json
[
  {
    "id": "q_viagem_internacional",
    "text": "Você costuma viajar para fora do Brasil?",
    "answerType": "boolean",
    "mapsToField": "travelsInternationally",
    "priority": 3,
    "active": true
  },
  {
    "id": "q_aluga_carro",
    "text": "Você costuma alugar carro em viagens?",
    "answerType": "boolean",
    "mapsToField": "rentsCars",
    "priority": 4,
    "active": true
  },
  {
    "id": "q_aeroportos_frequentes",
    "text": "Por quais aeroportos você costuma passar?",
    "answerType": "multi_choice",
    "options": [
      { "id": "gru", "label": "Guarulhos — GRU", "value": "GRU" },
      { "id": "gig", "label": "Rio de Janeiro/Galeão — GIG", "value": "GIG" },
      { "id": "cwb", "label": "Curitiba — CWB", "value": "CWB" },
      { "id": "cnf", "label": "Confins/BH — CNF", "value": "CNF" },
      { "id": "for", "label": "Fortaleza — FOR", "value": "FOR" },
      { "id": "mao", "label": "Manaus — MAO", "value": "MAO" }
    ],
    "mapsToField": "frequentAirportCodes",
    "priority": 5,
    "active": true
  },
  {
    "id": "q_compra_eletronicos",
    "text": "Você compra eletrônicos, eletrodomésticos ou produtos de maior valor no cartão?",
    "answerType": "boolean",
    "mapsToField": "buysHighValueGoodsWithCard",
    "priority": 6,
    "active": true
  },
  {
    "id": "q_usa_restaurantes",
    "text": "Você costuma usar restaurantes, experiências, hotéis ou passeios com frequência?",
    "answerType": "boolean",
    "mapsToField": "usesRestaurantsAndExperiences",
    "priority": 7,
    "active": true
  },
  {
    "id": "q_investimentos_xp_inter",
    "text": "Qual faixa aproximada de investimentos você mantém no Inter ou na XP?",
    "answerType": "currency_range",
    "options": [
      { "id": "ate_5k", "label": "Até R$ 5 mil", "value": "0_5000" },
      { "id": "5k_50k", "label": "De R$ 5 mil a R$ 50 mil", "value": "5000_50000" },
      { "id": "50k_100k", "label": "De R$ 50 mil a R$ 100 mil", "value": "50000_100000" },
      { "id": "100k_300k", "label": "De R$ 100 mil a R$ 300 mil", "value": "100000_300000" },
      { "id": "300k_1m", "label": "De R$ 300 mil a R$ 1 milhão", "value": "300000_1000000" },
      { "id": "1m_3m", "label": "De R$ 1 milhão a R$ 3 milhões", "value": "1000000_3000000" },
      { "id": "3m_10m", "label": "De R$ 3 milhões a R$ 10 milhões", "value": "3000000_10000000" }
    ],
    "mapsToField": "investmentRange",
    "priority": 8,
    "active": true
  }
]
```

---

# 8. Regras iniciais de correspondência benefício × questionário

```json
[
  {
    "id": "rule_ultravioleta_priority_pass",
    "benefitId": "benefit_nubank_ultravioleta_priority_pass",
    "conditions": [
      { "field": "tierOrProductIds", "operator": "includes", "value": "tier_nubank_ultravioleta_black" },
      { "field": "travelsInternationally", "operator": "equals", "value": true }
    ],
    "confidence": "high",
    "explanation": "Cliente que possui Nubank Ultravioleta e viaja internacionalmente deve visualizar os acessos Priority Pass como benefício de alto valor."
  },
  {
    "id": "rule_nubank_lounge_gru",
    "benefitId": "benefit_nubank_ultravioleta_lounge_gru",
    "conditions": [
      { "field": "tierOrProductIds", "operator": "includes", "value": "tier_nubank_ultravioleta_black" },
      { "field": "frequentAirportCodes", "operator": "includes", "value": "GRU" }
    ],
    "confidence": "high",
    "explanation": "Cliente Ultravioleta que passa por GRU deve visualizar o Nubank Ultravioleta Lounge."
  },
  {
    "id": "rule_mastercard_platinum_car_rental",
    "benefitId": "benefit_mastercard_platinum_masterseguro_automoveis",
    "conditions": [
      { "field": "cardNetworkTier", "operator": "includes", "value": "platinum" },
      { "field": "rentsCars", "operator": "equals", "value": true }
    ],
    "confidence": "medium",
    "explanation": "Usuário com cartão Mastercard Platinum e hábito de alugar carro pode ter seguro de automóveis de locadora. Validar cartão elegível e regras."
  },
  {
    "id": "rule_visa_infinite_car_rental",
    "benefitId": "benefit_visa_infinite_seguro_veiculo_locadora",
    "conditions": [
      { "field": "cardNetworkTier", "operator": "includes", "value": "infinite" },
      { "field": "rentsCars", "operator": "equals", "value": true }
    ],
    "confidence": "medium",
    "explanation": "Usuário com Visa Infinite que aluga carro pode ter seguro para veículos de locadora. Confirmar compra/reserva com cartão elegível."
  },
  {
    "id": "rule_xp_infinite_vip",
    "benefitId": "benefit_xp_infinite_sala_vip",
    "conditions": [
      { "field": "tierOrProductIds", "operator": "includes", "value": "tier_xp_infinite" }
    ],
    "confidence": "high",
    "explanation": "Cartão XP Infinite informa 4 acessos anuais a salas VIP."
  },
  {
    "id": "rule_inter_prime_duo_restaurants",
    "benefitId": "benefit_inter_duo_gourmet_2_por_1",
    "conditions": [
      { "field": "tierOrProductIds", "operator": "includes", "value": "tier_inter_duo_gourmet_anual" },
      { "field": "usesRestaurantsAndExperiences", "operator": "equals", "value": true }
    ],
    "confidence": "high",
    "explanation": "Assinante Duo Gourmet que usa restaurantes deve visualizar o benefício 2 por 1."
  },
  {
    "id": "rule_compra_protegida_high_value_goods",
    "benefitId": "benefit_mastercard_gold_compra_protegida",
    "conditions": [
      { "field": "cardNetworkTier", "operator": "includes", "value": "gold" },
      { "field": "buysHighValueGoodsWithCard", "operator": "equals", "value": true }
    ],
    "confidence": "medium",
    "explanation": "Usuário com Mastercard Gold que compra produtos de maior valor pode se beneficiar de compra protegida."
  }
]
```

---

# 9. Priorização de categorias para o MVP

Priorize os benefícios com maior percepção de valor para o usuário comum:

1. Seguro viagem internacional.
2. Seguro para veículo de locadora.
3. Sala VIP.
4. Garantia estendida.
5. Compra protegida.
6. Proteção de preço.
7. Cashback/Investback.
8. Pontos/milhas.
9. Restaurantes/experiências.
10. Câmbio, IOF, conta global e compras internacionais.

---

# 10. UX sugerida para exibição do resultado

Cada benefício identificado deve ser exibido em um card com:

- nome do benefício;
- instituição relacionada;
- cartão/programa/nível associado;
- origem do benefício: emissor, bandeira ou parceiro;
- categoria;
- valor percebido: alto, médio ou baixo;
- confiança da correspondência: alta, média ou baixa;
- instruções resumidas de uso;
- alerta de validação quando necessário;
- locais de uso, quando aplicável;
- link da fonte oficial;
- data da última validação.

Exemplo de resposta ao usuário:

```md
## Você provavelmente tem este benefício

### Seguro para veículo de locadora

- **Origem:** Visa Infinite
- **Relacionado ao seu cartão:** XP Infinite
- **Quando usar:** ao alugar veículos em viagens
- **Como ativar:** pagar e reservar a locação com o cartão elegível; verificar regras no Portal de Benefícios Visa
- **Confiança:** média
- **Atenção:** confirme exclusões, países cobertos e necessidade de documentação antes da viagem
- **Fonte:** https://www.visa.com.br/pague-com-visa/cartoes/beneficios.html
```

---

# 11. Cuidados de compliance e produto

1. Não tratar o app como consultoria financeira, corretagem de seguros ou garantia de cobertura.
2. Sempre exibir aviso de que benefícios dependem das regras vigentes do emissor, bandeira e parceiros.
3. Nunca afirmar “você está coberto” sem checar regras de elegibilidade.
4. Usar linguagem como “você pode ter acesso”, “verifique no portal oficial”, “benefício provável”.
5. Para seguros, sempre orientar emissão de bilhete/certificado quando a regra exigir.
6. Para salas VIP, sempre validar limite de acessos, acompanhantes, prazo anual e rede aplicável.
7. Para pontuação/cashback, validar se há ativação necessária, plano pago, Turbo Benefícios, débito automático ou gasto mínimo.
8. Manter histórico de fonte e data de validação.
9. Separar campanhas temporárias de benefícios permanentes.
10. Criar rotina de revalidação periódica dos benefícios mais sensíveis.

---

# 12. Próximos passos para o agente

1. Implementar as entidades principais no banco de dados.
2. Cadastrar os `ProviderGroups`.
3. Cadastrar `Programs`.
4. Cadastrar `TierOrProduct`.
5. Cadastrar `Benefits`.
6. Cadastrar `RedemptionLocations`.
7. Cadastrar perguntas do questionário.
8. Cadastrar regras de match.
9. Criar API para responder questionário e retornar benefícios prováveis.
10. Criar tela de resultado com cards agrupados por categoria.
11. Criar rotina administrativa para revisão manual de benefícios e fontes.
12. Criar campo de “necessita validação” para benefícios sensíveis.
13. Criar rotina futura de scraping/checagem de páginas oficiais, respeitando termos de uso.

---

# 13. Checklist de validação do MVP

Antes de considerar o MVP minimamente testável, validar:

- [ ] Usuário com Nubank Ultravioleta recebe Priority Pass, Lounge GRU, pontos/cashback, Nu Viagens e IOF zero.
- [ ] Usuário com Nubank Gold recebe benefícios Mastercard Gold, separados da origem Nubank.
- [ ] Usuário com Nubank Platinum recebe benefícios Mastercard Platinum.
- [ ] Usuário com Inter Gold/Platinum/Prime/Win recebe pontuação Loop correta.
- [ ] Usuário Inter Prime recebe salas VIP Inter e Priority Pass com alerta de validação de regulamento.
- [ ] Usuário Duo Gourmet recebe benefício 2 por 1 e experiências.
- [ ] Usuário XP One recebe pontos/investback e acessos conforme regra.
- [ ] Usuário XP Infinite recebe 4 acessos a salas VIP e benefícios Visa Infinite.
- [ ] Usuário XP Legacy recebe salas VIP ilimitadas, concierge, Meet & Greet e pontos/investback premium.
- [ ] Usuário com Visa Infinite recebe seguro viagem, seguro de locadora, Visa Airport Companion, Fast Pass e Proteção de Compra.
- [ ] Usuário com Mastercard Black recebe compra protegida, garantia estendida e concierge.
- [ ] App mostra locais físicos quando houver aeroporto/cidade.
- [ ] App mostra `online` ou `global_network` quando não houver localização fixa.
- [ ] App exibe fonte e data de validação em todos os cards.

---

# 14. Observação final para implementação

Esta base deve ser usada como **seed de MVP**, não como base definitiva de produção. A modelagem precisa permitir expansão para outros grupos, como:

- Bradesco;
- Itaú;
- Santander;
- Banco do Brasil;
- Caixa;
- BTG Pactual;
- C6 Bank;
- Porto Bank;
- Vivo;
- Claro;
- TIM;
- Amazon Prime;
- Mercado Livre/Meli+;
- Smiles;
- LATAM Pass;
- Azul Fidelidade;
- Livelo;
- Esfera;
- Mastercard Surpreenda;
- Vai de Visa.

O ponto central do produto é transformar benefícios dispersos e difíceis de entender em recomendações acionáveis, organizadas por perfil de usuário, localização e situação de uso.

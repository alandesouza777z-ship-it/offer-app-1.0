# Método de Gestão de Campanhas Facebook Ads

## CBO vs ABO

| Característica | CBO | ABO |
|---------------|-----|-----|
| **Orçamento** | Na campanha | No conjunto (ad set) |
| **Distribuição** | Facebook distribui conforme performance | Você controla onde gastar |
| **Gasto na madrugada** | Gasta menos | Gasta mais |
| **Orçamento sugerido** | ~R$200 por campanha | ~R$100 por conjunto |
| **Escala** | Aumentar orçamento | Não aumentar - duplicar (lateralizar) |

### Quando usar CBO
- Testar público
- Alta escala
- Ticket alto (acima de R$67)

### Quando usar ABO
- Testar criativo
- Ticket baixo (abaixo de R$67)
- Fase de teste de criativos

---

## Estruturas Principais

Formato: **Campanha - Ad Sets - Ads**

- **1-1-1**: 1 campanha, 1 conjunto, 1 anúncio
- **1-3-1**: 1 campanha, 3 conjuntos, 1 anúncio cada
- **1-5-1**: 1 campanha, 5 conjuntos, 1 anúncio cada

---

## Fluxo de Validação e Escala

### ABO Flow
```
Teste de Criativo (ABO) → Pré-escala → Escala
```

### CBO Flow
```
Teste → Escala
```

### Validação de Criativo
- **Critério**: Vender pelo menos **2 unidades**
- **Gastou e não vendeu**: Matar campanha

---

## Regras de Corte

| Condição | Ação |
|----------|------|
| Gastou R$20 sem IC (Initiate Checkout) | Matar |
| Gastou R$50 sem venda | Matar |
| Gastou R$10–15 sem IC | Matar |

### Princípios
- **Orçamento por conjunto**: Até 1 ticket (ou meio ticket se pouco caixa)
- **Não mexer muito no orçamento**: Estabilidade melhora performance
- **Sempre esperar o próximo dia** para tomar decisões
- **Campanha ruim não melhora depois**: Matar

---

## Métricas Principais

### IC (Initiate Checkout) - Métrica Principal

| Situação | Diagnóstico | Ação |
|----------|-------------|------|
| IC alto | Problema no checkout/preço | Ajustar oferta |
| IC baixo + sem venda | Ticket muito alto | Baixar ticket |
| IC alto + venda | Oferta validada | Aumentar ticket |

### Outras Métricas
- **CTR**: Deve ser > 7%
- **CPA**: Monitorar custo por aquisição
- **ROAS**: Retorno sobre gasto

---

## Escala

### Regras Gerais
- **Nunca aumentar campanhas de forma igual**: Analisar IC primeiro
- **Até R$1.000**: Pode aumentar orçamento sem medo
- **Acima de R$1.000**: Subir gradualmente
- **Escala maior → Maior saturação**
- **ROI diminui conforme escala**

### ABO: Escalar Lateralizando
- Não aumentar orçamento dos conjuntos
- Duplicar conjuntos vencedores
- Manter estabilidade

### CBO: Escalar Aumentando Orçamento
- Aumentar orçamento da campanha gradualmente
- Facebook redistribui automaticamente

---

## Criativos

- **Sempre "bom", não perfeito**: Feito é melhor que perfeito
- **Fazer variações do que funciona**: Manter winning elements
- **Quebra de padrão é essencial**: Diferenciar da concorrência
- **Teste começa no ABO**: Após validar, migrar para pré-escala/escala

---

## Oferta

| Tipo de Oferta | Resultado |
|---------------|-----------|
| **Oferta boa** | Vende com tráfego |
| **Oferta ruim** | Não vende com nenhum tráfego |

- **Testar até 2 tickets por produto**
- **Quanto maior o orçamento, mais rápido gasta**

---

## Regra de Ouro

> **Testa criativo → Valida → Escala rápido → Aproveita antes de saturar**

---

## Resumo Decisório por Ticket

| Ticket | Tipo de Campanha | Orçamento | Estratégia de Escala |
|--------|-----------------|-----------|---------------------|
| > R$67 | CBO | ~R$200/campanha | Aumentar orçamento |
| < R$67 | ABO | ~R$100/conjunto | Duplicar conjuntos |

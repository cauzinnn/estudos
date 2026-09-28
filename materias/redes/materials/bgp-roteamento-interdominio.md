# Material de Referência: BGP-4 e Roteamento Interdomínio (Path Vector)

Este documento complementa os materiais teóricos da disciplina de **Redes de Computadores / Roteamento Unicast**, servindo como base técnica estruturada para o estudo de sistemas autônomos e protocolos de vetor de caminho.

---

## 1. Fundamentos e Motivação do Roteamento Interdomínio

Nos protocolos intra-domínio (IGP — *Interior Gateway Protocols*), como **RIP** (Vetor de Distância) e **OSPF** (Estado do Enlace), a meta primária é puramente a **otimização de desempenho e caminho mínimo** dentro de uma organização única sob administração centralizada.

Na Internet global (inter-domínio / EGP — *Exterior Gateway Protocols*), o cenário muda drasticamente:
1. **Escalabilidade Extrema:** A tabela de rotas da Internet global supera 900.000 prefixos. Nenhum protocolo de inundação LS ou vetor simples consegue operar globalmente sem saturação de memória e banda.
2. **Autonomia e Políticas Comerciais (Policy-Based Routing):** O caminho escolhido não é necessariamente o mais curto geometricamente, mas o que satisfaz acordos de negócios, leis de soberania de dados e restrições econômicas (provedor pagante vs trânsito gratuito).
3. **Privacidade Topológica:** Um provedor não deseja revelar sua topologia interna, capacidades de enlaces e roteadores para concorrentes externos.

---

## 2. Sistemas Autônomos (AS) e ASNs

Um **Sistema Autônomo (Autonomous System — AS)** é uma coleção de redes IP e roteadores controlados por uma entidade administrativa comum (ISP, universidade, corporação, governo) que apresenta uma política de roteamento coerente para a Internet.

- **Identificador:** Cada AS possui um **Número de Sistema Autônomo (ASN — Autonomous System Number)** atribuído pela IANA e registros regionais (como o Registro.br no Brasil ou ARIN na América do Norte).
  - ASNs clássicos: 16 bits (1 a 65.535; onde 64.512 a 65.534 são privados).
  - ASNs estendidos: 32 bits (RFC 4893 / 6793), permitindo mais de 4 bilhões de números.

---

## 3. Arquitetura do Protocolo BGP-4 (RFC 4271)

O **BGP (Border Gateway Protocol)** é a espinha dorsal de roteamento da Internet. Ele é classificado como um protocolo de **Vetor de Caminho (Path Vector)**:

### 3.1 Transporte e Sessões BGP
- Diferente do RIP (UDP 520) e OSPF (direto sobre IP, protocolo 89), o BGP roda **sobre uma conexão TCP confiável na porta 179**.
- A confiabilidade, controle de fluxo e fragmentação ficam a cargo do TCP. O BGP não precisa implementar números de sequência próprios nem mecanismos complexos de retransmissão de transporte.
- Mensagens BGP periódicas do tipo `KEEPALIVE` (padrão a cada 60s com Hold Timer de 180s) mantêm a sessão ativa.

### 3.2 eBGP vs iBGP
- **eBGP (External BGP):** Sessão estabelecida entre dois roteadores de borda pertencentes a **Sistemas Autônomos diferentes** (frequentemente conectados diretamente por um enlace físico ou ponto de troca de tráfego - IXP). O TTL padrão do pacote IP no eBGP é tipicamente 1 (a menos que seja configurado *eBGP Multihop*).
- **iBGP (Internal BGP):** Sessão estabelecida entre roteadores BGP **dentro do mesmo Sistema Autônomo**. O objetivo é redistribuir e sincronizar as rotas externas aprendidas via eBGP para todos os nós de borda do AS.
  - *Regra do iBGP Split Horizon:* Um roteador iBGP **NÃO** repassa rotas aprendidas de um par iBGP para outro par iBGP.
  - Consequência: Exige uma **malha completa (full-mesh)** de sessões iBGP lógicas ($N(N-1)/2$) entre todos os roteadores BGP internos, ou o uso de **Route Reflectors (RR - RFC 4456)** ou **BGP Confederations (RFC 5065)** para permitir escalabilidade.

---

## 4. O Mecanismo Path Vector e Prevenção de Loops

Em protocolos Vetor de Distância simples (como RIP), um roteador recebe apenas uma métrica numérica (ex: "destino X a 3 saltos"), sem saber por quais nós o tráfego passará, tornando a rede suscetível a loops e contagem ao infinito.

No BGP (Path Vector):
- Cada rota anunciada carrega consigo a lista explícita de todos os Sistemas Autônomos que ela já atravessou: o atributo **`AS-PATH`**.
- **Regra Fundamental de Prevenção de Loop:** Quando um roteador de borda recebe um anúncio BGP via eBGP, ele inspeciona o atributo `AS-PATH`. **Se o seu próprio ASN já estiver presente nessa lista, a rota é imediatamente rejeitada e descartada.**
- Isso previne loops de roteamento em escala global com custo $O(1)$ de verificação.

---

## 5. Atributos Fundamentais de Rota no BGP

As mensagens de atualização BGP (`UPDATE`) associam prefixos de rede (NLRI — *Network Layer Reachability Information*) a um conjunto de **Path Attributes**:

1. **`ORIGIN` (Mandatório):** Indica como a rota foi gerada originalmente:
   - `IGP` (valor 0): rota originada via comando network/BGP.
   - `EGP` (valor 1): aprendida via o legado Exterior Gateway Protocol.
   - `INCOMPLETE` (valor 2): aprendida por redistribuição de rotas estáticas ou de outro IGP.
2. **`AS-PATH` (Mandatório):** Sequência ordenada de ASNs percorridos.
3. **`NEXT-HOP` (Mandatório):** Endereço IP do próximo salto para alcançar o prefixo.
   - *Atenção:* No eBGP, o `NEXT-HOP` é o endereço IP do par remoto no enlace. Quando essa rota é repassada para dentro do AS via iBGP, por padrão o `NEXT-HOP` **não é alterado** (a menos que a opção `next-hop-self` seja configurada no roteador de borda). O IGP interno precisa prover alcançabilidade para esse IP externo.
4. **`LOCAL-PREF` (Discretionary / Apenas dentro do AS):**
   - Grau de preferência local atribuído a rotas externas.
   - Configurado pelo operador local e propagado **apenas em sessões iBGP** (nunca enviado em eBGP).
   - **Regra:** O roteador escolhe a rota com o **MAIOR** valor de `LOCAL-PREF` (padrão típico: 100).
   - Usado para impor políticas econômicas: rotas de Clientes têm preferência maior que de Pares (Peers), que têm preferência maior que de Fornecedores de Trânsito (Providers).
5. **`MED` (Multi-Exit Discriminator - Opcional Não-Transitivo):**
   - Métrica enviada em sessões eBGP para sugerir a um AS vizinho por qual enlace preferencial ele deve enviar tráfego para dentro do nosso AS, quando existem múltiplos enlaces de interconexão entre os mesmos dois ASes.
   - **Regra:** O vizinho escolhe a rota com o **MENOR** valor de `MED`.

---

## 6. Algoritmo de Seleção de Melhor Rota do BGP (Best Path Selection)

Quando um roteador BGP recebe múltiplos anúncios válidos para o mesmo prefixo IP, ele executa rigorosamente a seguinte cascata determinística de critérios até desempatar:

1. **Maior Weight** (Proprietário Cisco/Huawei, local ao roteador, não propagado).
2. **Maior `LOCAL-PREF`** (preferência de saída local do AS).
3. **Rotas locais originadas pelo próprio roteador** (preferidas sobre rotas aprendidas externamente).
4. **Menor tamanho de `AS-PATH`** (menor número de ASes intermediários).
5. **Menor valor de `ORIGIN`** (`IGP` < `EGP` < `INCOMPLETE`).
6. **Menor `MED`** (para rotas vindas do mesmo AS vizinho).
7. **Preferência por rota eBGP sobre rota iBGP** ("hot-potato routing" — descarregar o tráfego para fora do AS o mais rápido possível).
8. **Menor métrica IGP interna até o `NEXT-HOP`** (menor custo dentro do próprio domínio).
9. **Desempate final:** Menor Router ID BGP do par anunciante.

---

## 7. Modelos Comerciais e Relações de Trânsito (Regras de Gao-Rexford)

As interconexões de Internet regem-se por dois tipos contratuais de acordos:
- **Cliente-Provedor (Customer-Provider / Trânsito Pago):** O cliente paga ao provedor pelo tráfego de saída e entrada. O provedor aceita todo o tráfego do cliente e anuncia todas as rotas da Internet para ele.
- **Ponto a Ponto (Peer-to-Peer / IXP):** Dois ASes de porte similar trocam tráfego bilateralmente sem cobrança financeira mútua (geralmente sob regime de *settlement-free peering*).
  - *Regra Estrita de Exportação:* Um AS **só exporta para um Peer as rotas de si próprio e de seus clientes**. Ele **nunca** repassa rotas aprendidas de outro Peer ou de um Provedor para um Peer (pois isso faria o AS pagar pelo tráfego de trânsito alheio sem receber nada em troca!).

---

## Referências Técnicas
- **RFC 4271:** *A Border Gateway Protocol 4 (BGP-4)*, Y. Rekhter, T. Li, S. Hares, 2006.
- **RFC 4456:** *BGP Route Reflection: An Alternative to Full Mesh Internal BGP (IBGP)*.
- **KUROSE, J. F.; ROSS, K. W.:** *Redes de Computadores e a Internet: Uma Abordagem Top-Down*, 7ª/8ª Edição, Capítulo 5: A Camada de Rede: Plano de Controle.
- **TANENBAUM, A. S.; WETHERALL, D. J.:** *Redes de Computadores*, 5ª Edição, Capítulo 5: A Camada de Rede.

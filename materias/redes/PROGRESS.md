# Registro de Progresso — Redes de Computadores: Roteamento Unicast

Documento de acompanhamento contínuo da disciplina **Redes de Computadores / Roteamento Unicast**, orientado ao aprendizado ativo e pelo erro para o domínio completo de arquitetura IP, algoritmos de caminho mínimo (Bellman-Ford e Dijkstra) e protocolos de roteamento (RIP e OSPF).

---

## 🎯 Status da Disciplina
- **Status Geral:** Trilha Completa Desenvolvida e Disponível!
- **Lições Disponíveis:** 11 de 11 (Currículo Integral da UFRJ / COPPE / GTA)
- **Fichas de Referência Disponíveis:** 2 de 2 (Endereçamento IPv4 + Algoritmos de Roteamento)
- **Materiais de Base:** 3 Slides Oficiais UFRJ + 3 Listas Resolvidas com Gabarito + Guia de BGP
- **Metodologia:** Teoria condensada (< 2 min), diagnósticos de erro em tempo real, rastreamento de mesa de prova e persistência de tropeços conceituais.

---

## 📚 Trilha Completa de Conteúdo

### Módulo 1: Camada de Rede, Endereçamento IPv4 e Encaminhamento
1. **0001 - Endereçamento IPv4, Classes e CIDR/VLSM** (`lessons/0001-enderecamento-ipv4-classes-cidr.html`) — ✅ **Disponível**
   - *Conceitos:* Estrutura de 32 bits, classes A a E, cálculo de sub-redes ($2^h - 2$), a armadilha do prefixo com bits variáveis em 1 e parsing de interfaces `ifconfig`.
2. **0002 - Cabeçalho IPv4, Fragmentação, Roteamento pela Fonte e ICMP** (`lessons/0002-cabecalho-ipv4-opcoes-encaminhamento.html`) — ✅ **Disponível**
   - *Conceitos:* Campos do cabeçalho, cálculo do Fragment Offset em blocos de 8 octetos, Fast Path vs Slow Path, Loose/Strict Source Routing vs IP-in-IP e ICMP Redirect.

### Módulo 2: Roteamento por Vetor de Distância (DV) e Protocolo RIP
3. **0003 - Vetor de Distância e Algoritmo de Bellman-Ford** (`lessons/0003-vetor-de-distancia-bellman-ford.html`) — ✅ **Disponível**
   - *Conceitos:* Filosofia distribuída de fofoca, a Equação de Bellman-Ford, tabelas de roteamento locais e a regra mandatória de atualização de métricas piores.
4. **0004 - Instabilidades em DV: Loops, Bouncing Effect e Contagem ao Infinito** (`lessons/0004-loops-bouncing-contagem-ao-infinito.html`) — ✅ **Disponível**
   - *Conceitos:* Por que más notícias viajam devagar, formação de loops de 2 nós, efeito ricochete, particionamento de redes e a solução do infinito igual a 16.
5. **0005 - Mitigação de Loops: Split Horizon, Poison Reverse e Timers** (`lessons/0005-split-horizon-poison-reverse-timers.html`) — ✅ **Disponível**
   - *Conceitos:* Omissão no Split Horizon, envenenamento reverso com métrica 16, a falha fatal em ciclos de 3 nós, Triggered Updates e os 3 temporizadores do RIP.
6. **0006 - Protocolo RIP: RIPv1, RIPv2, RIPng e Operação Prática** (`lessons/0006-protocolo-rip-v1-v2-ripng.html`) — ✅ **Disponível**
   - *Conceitos:* Da limitação classful em broadcast para multicast 224.0.0.9, o campo Next Hop de 32 bits, mensagens Request e RIPng para IPv6 na porta UDP 521.

### Módulo 3: Roteamento por Estado de Enlace (LS) e Protocolo OSPF
7. **0007 - Estado de Enlace e o Algoritmo SPF de Dijkstra** (`lessons/0007-estado-de-enlace-dijkstra.html`) — ✅ **Disponível**
   - *Conceitos:* Filosofia LS e base topológica unificada (LSDB), rastreamento formal dos conjuntos C, O e R no grafo UFRJ, derivação da FIB e complexidade $O(M \log M)$.
8. **0008 - OSPF: Arquitetura em Áreas e Tipos de LSAs** (`lessons/0008-ospf-arquitetura-areas-lsas.html`) — ✅ **Disponível**
   - *Conceitos:* Hierarquia de 2 níveis, Área 0 (Backbone), papéis de roteadores (IR, ABR, ASBR), os 5 tipos de LSAs e a precedência absoluta de tipos de rotas.
9. **0009 - OSPF: Subprotocolos Hello, Exchange e Roteador Designado (DR)** (`lessons/0009-ospf-subprotocolos-hello-exchange-dr.html`) — ✅ **Disponível**
   - *Conceitos:* Formação de adjacências via Hello, redução de adjacências de $N(N-1)/2$ para $N$ pelo DR/BDR, multicast 224.0.0.5/6 e sincronização cirúrgica com DBDs.
10. **0010 - ECMP (Equal-Cost Multi-Path) e Comparativo RIP vs OSPF** (`lessons/0010-ecmp-e-comparativo-rip-ospf.html`) — ✅ **Disponível**
    - *Conceitos:* Balanceamento de carga em múltiplos caminhos, preservação de ordenação TCP via hash de 5-tupla e a matriz de decisão completa RIP x OSPF.

### Módulo Especial: Prova Final Unificada
11. **0011 - Simulado Geral: Exame Completo de Roteamento Unicast** (`lessons/0011-simulado-geral-exame-completo.html`) — ✅ **Disponível**
    - *Conceitos:* 12 questões integradoras de alto nível abrangendo toda a matéria sobre uma topologia mestre.

---

## 📑 Fichas de Consulta Rápida (Cheat Sheets)
1. **Ficha 0001: Endereçamento IPv4, Máscaras e Cabeçalho** (`reference/0001-enderecamento-ipv4-e-cabecalho.html`) — ✅ **Disponível**
2. **Ficha 0002: Algoritmos e Protocolos de Roteamento (DV vs LS / RIP vs OSPF)** (`reference/0002-algoritmos-e-protocolos-roteamento.html`) — ✅ **Disponível**

---

## ⚠️ Pontos de Tropeço / Atenção Mapeados (Para Fixação)
- [ ] **Bits Variáveis em Identificador de Rede:** Um prefixo só é válido se todos os bits de host forem estritamente 0 (ex: 136.27.33.0/23 é host, não identificador de rede).
- [ ] **Capacidade Útil de Hosts:** Sempre subtrair 2 ($2^h - 2$) devido aos endereços reservados de rede e broadcast.
- [ ] **Unidade do Fragment Offset:** Sempre em múltiplos de 8 octetos (bytes acumulados anteriores divididos por 8).
- [ ] **Slow Path em Opções IP:** A presença de opções desvia os pacotes dos ASICs para a CPU do roteador, degradando o throughput.
- [ ] **Incapacidade do IP-in-IP de emular SSR:** O túnel garante a entrega ao próximo ponto mas não impede que roteadores extras sejam atravessados no trajeto intermediário.
- [ ] **Regra do ICMP Redirect:** Só é gerado quando a interface física de entrada do pacote coincide com a interface de saída.
- [ ] **Atualização Obrigatória em DV:** Se a métrica piorar através do próximo salto atualmente em uso, o roteador é OBRIGADO a atualizar para o valor maior.
- [ ] **Causa do Bouncing Effect:** A falta de visão global faz o nó vizinho anunciar uma rota obsoleta que dependia do próprio enlace que quebrou.
- [ ] **Calcanhar de Aquiles do Split Horizon:** O Split Horizon falha completamente em ciclos de 3 ou mais roteadores ($A \to B \to C \to A$), pois a rota entra por uma interface e sai por outra.
- [ ] **Trade-off do Infinito = 16 no RIP:** Limita a contagem ao infinito no tempo, mas restringe o diâmetro máximo da rede a 15 saltos.
- [ ] **Multicast RIPv2 (224.0.0.9):** Descarte do pacote no nível da placa de rede por computadores comuns, poupando interrupções de CPU.
- [ ] **Dijkstra e Nós em C:** Uma vez que um nó é admitido em $C$, seu caminho ótimo está selado. Candidatos posteriores retirados de $O$ que terminem em nós já presentes em $C$ são sumariamente descartados.
- [ ] **Precedência Absoluta no OSPF:** Rotas Intra-área (O) SEMPRE vencem rotas Inter-área (O IA) e Externas (E1/E2), independentemente de qualquer valor numérico de métrica.
- [ ] **Redução Combinatória do DR:** Reduz adjacências de $\frac{N(N-1)}{2}$ para $N$ e estados na LSDB de $N(N-1)$ para $2N$.
- [ ] **Endereço Multicast DROther:** Roteadores DROther transmitem seus anúncios para 224.0.0.6 (DR/BDR), e o DR redistribui para 224.0.0.5.
- [ ] **Desordem TCP no ECMP:** Round-robin ingênuo gera DUP-ACKs e corte de janela; a mitigação obrigatória é o hash consistente de 5-tupla.

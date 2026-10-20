---
clave: silvy
nombre: Silvy
lema: El cerebro del agente de IA de código del motor
rol: Agente
estado: activo
stack:
  - C++17
  - CMake
  - nlohmann/json
  - cpp-httplib
  - llama.cpp
repositorio: https://github.com/FunshiEngine/Silvy
licencia: Apache-2.0
color: '#e0736f'
orden: 6
aspectos:
  - "Capa LLM local (llama-server/GGUF) o remota vía API compatible con OpenAI."
  - "Un binario autónomo que habla JSON por stdin/stdout: 1 request = 1 paso."
  - "Errores tipados con registro persistente en JSONL, con rotación y retención."
  - "Descarga reanudable del GGUF con lock y verificación de integridad."
  - "Supervisor de llama-server: health-check, apagado escalonado y log en archivo."
---

## Qué es

`Silvy` es el **agente de inteligencia artificial de código** para el motor
gráfico. Es el “cerebro” del agente: una capa LLM —local con llama-server/GGUF o
remota vía API compatible con OpenAI— expuesta como binario que se consume por
**JSON sobre stdin/stdout** desde `FunshiEngineCLI`.

El bucle del agente —planificar, ejecutar herramientas, observar, iterar— vive en
la CLI. Silvy habla con el LLM y responde.

## Qué NO es

- No es un chatbot: ese es `FunshiEngineAI`.
- No es una app de escritorio: **Silvy no tiene UI propia**.
- No trae conocimiento propio: RAG, *skills* y system prompt los aporta el
  usuario desde la CLI.

## Qué aporta

- **Protocolo mínimo**: `agent.step` recibe el historial completo, el catálogo de
  herramientas y un prompt opcional, y devuelve contenido y `toolCalls`.
- **Errores que viajan normalizados**: cada fallo crudo se envuelve con un
  clasificador; la respuesta `ok:false` devuelve exactamente el objeto que
  quedó guardado en `errores.jsonl`.
- **Runtime local**: el modelo descargado, la descarga en curso y el
  `llama-server` sobreviven entre solicitudes, por eso el binario atiende varias
  seguidas desde stdin.

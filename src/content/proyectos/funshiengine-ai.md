---
clave: funshiengine-ai
nombre: FunshiEngineAI
lema: Asistente de escritorio con RAG, herramientas y MCP
rol: Asistente
estado: activo
stack:
  - Kotlin
  - Jetpack Compose Desktop
  - Gradle
  - llama.cpp
  - MCP
repositorio: https://github.com/FunshiEngine/FunshiEngineAI
licencia: Apache-2.0
color: '#a58ce0'
orden: 5
aspectos:
  - "RAG con troceado, recuperación BM25 y system prompt editable."
  - "Verificador determinista de citas: cada [n] se comprueba contra su fuente."
  - "Tool calling real contra APIs OpenAI-compatible, también por protocolo de prompt."
  - "Cliente MCP propio por stdio con JSON-RPC 2.0 y permisos por categoría."
  - "Render propio de markdown, bloques de código y fórmulas LaTeX offline."
---

## Qué es

`FunshiEngineAI` es un **asistente con IA para el motor gráfico**: construye
código básico y sugiere documentación según las necesidades del usuario y su
base de conocimientos, **sin inventar información**. Si no hay una referencia que
lo respalde, lo dice.

Es una aplicación de escritorio (Compose Multiplatform) con tres módulos:
`frontend/` (chat), `backend/` (RAG y bucle de herramientas) y `llm-api/`
(fachada de LLM local o remota).

## Qué aporta

- **RAG real**: indexa repositorios de GitHub y documentos internos, los trocea
  en *chunks* y recupera los más relevantes con BM25.
- **Verificador determinista de citas**: tras cada respuesta en modo Docs, la app
  reabre cada fuente citada y comprueba que el fragmento esté respaldado. No
  llama al modelo ni a la red, así que se puede testear al 100 %.
- **Herramientas con permisos por categoría**, apagados por defecto y
  concedidos por chat: archivos, web, MCP y LaTeX.
- **MCP de verdad por stdio**: cliente JSON-RPC 2.0 propio; sus herramientas
  aparecen en el chat como `mcp__<servidor>__<herramienta>`.

## La regla central

No inventar sin referencia. La respuesta declara sus fuentes, el verificador las
comprueba y la interfaz muestra un distintivo: **“Citas verificadas (n)”** o
cuántas quedan sin respaldo.

---
clave: funshiengine-cli
nombre: FunshiEngineCLI
lema: "El motor desde la terminal: JSON en stdin, JSON en stdout"
rol: Herramienta
estado: activo
stack:
  - C++17
  - CMake
  - nlohmann/json
  - FTXUI
repositorio: https://github.com/FunshiEngine/FunshiEngineCLI
licencia: Apache-2.0
color: '#6fbf9b'
orden: 4
aspectos:
  - "18 comandos: proyectos, escenas, objetos, assets, scripts y diagnósticos."
  - "Interfaz TUI de terminal con caja de comandos, catálogo y atajos."
  - "Núcleo agnóstico del transporte, reutilizable desde una app de escritorio."
  - "El motor se compila desde el submódulo: cabeceras y biblioteca del mismo commit."
  - "Validación de argumentos por tabla y errores tipados con código de salida."
---

## Qué es

`FunshiEngineCLI` es la **interfaz de línea de comandos** del motor. Ejecuta
operaciones del motor mediante solicitudes JSON sin abrir el editor gráfico:
creación y gestión de proyectos, escenas y objetos, importación de assets,
compilación de scripts y consulta del registro de diagnósticos.

El código está modularizado en un núcleo reutilizable **agnóstico del
transporte** (`src/Nucleo`), preparado para que una futura app de escritorio
reutilice la misma lógica sin pasar por stdin/stdout.

## Qué aporta

- **Contrato estable**: `{"command": "...", "args": {...}}` entra, un JSON con
  `apiVersion`, `ok`, `result` y `error` sale. Códigos de salida tipados.
- **TUI** (`--tui`): barra superior, panel lateral de dominios, panel central con
  datos reales del núcleo, caja de comandos y barra de estado.
- **Integridad de binario**: el motor se compila desde el submódulo
  `extern/FunshiEngine`, así que las cabeceras con las que compila la CLI y la
  biblioteca que enlaza salen siempre del mismo commit.

## Ejemplo

```bash
echo '{"command":"project.create","args":{"name":"MiJuego2D","dimension":2}}' \
  | FunshiCLI --request
```

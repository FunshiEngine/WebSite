---
clave: funshiengine-core
nombre: FunshiEngineCore
lema: El contrato de render del motor, sin API gráfica
rol: Núcleo
estado: activo
stack:
  - C++17
  - CMake
  - Dear ImGui
  - Bullet Physics
  - Assimp
repositorio: https://github.com/FunshiEngine/FunshiEngineCore
licencia: Apache-2.0
color: '#8fa3c7'
orden: 1
aspectos:
  - "Define el contrato de render: qué recursos, estados y uniformes necesita el motor."
  - "Arranca con el backend en blanco: define el contrato y no dibuja."
  - "Ventana y eventos con GLFW, sin contexto gráfico."
  - "Física con Bullet tras una fachada desacoplada, carga de modelos con Assimp."
  - "Scripts dinámicos en C++ y Java con reflexión y recarga en caliente."
---

## Qué es

`FunshiEngineCore` es el **núcleo del motor**: define el contrato de render —qué
recursos, estados y uniformes necesita el motor— y deja la implementación
gráfica en manos de un backend.

Por defecto el motor arranca con el backend en blanco: define el contrato y
**no dibuja**. Un backend de verdad (por ejemplo, uno sobre Vulkan) se instala
antes de arrancar el bucle.

Esta separación es la razón de ser del repositorio: el motor no habla el
dialecto de ninguna API gráfica. Pide un programa por tipo y el backend lo
construye con el suyo.

## Qué aporta

- Contrato de render (`IRenderBackend`) con handles opacos, mallas, texturas,
  estados, objetivos de render y uniformes.
- Bucle de escena, serialización binaria en preorden, `EventBus` tipado y
  máquina de estados explícita del editor.
- Fachadas desacopladas de física, audio y scripts, con backends intercambiables.
- Terminal integrada (ConPTY en Windows, pseudo-terminal en POSIX) y una vista
  web embebida con su propio contrato de backend.

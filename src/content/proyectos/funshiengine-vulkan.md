---
clave: funshiengine-vulkan
nombre: FunshiEngineVK
lema: El mismo motor, resuelto sobre Vulkan
rol: Backend
estado: activo
stack:
  - C++17
  - Vulkan
  - GLSL 450
  - SPIR-V
  - Dear ImGui
  - CMake
repositorio: https://github.com/FunshiEngine/FunshiEngineVulkan
licencia: Apache-2.0
color: '#c96f9b'
orden: 3
aspectos:
  - "Implementa el contrato de render del core sobre Vulkan."
  - "Shaders GLSL 450 compilados a SPIR-V en tiempo de build y embebidos."
  - "Test headless que dibuja un triángulo y lee los píxeles."
  - "Capa propia de interfaz sobre el swapchain, resuelta a una sola muestra."
  - "Selección de GPU por variable de entorno para equipos multi-GPU."
---

## Qué es

`FunshiEngineVK` implementa el **backend de Vulkan** del contrato de render. El
motor —que viene del core— define qué recursos, estados y uniformes necesita, y
aquí está la implementación que los resuelve sobre Vulkan.

El motor no habla el dialecto de ninguna API: pide un programa por tipo y el
backend lo construye con el suyo. Este repositorio es la prueba de que ese
contrato aguanta el cambio.

## Qué aporta

- Shaders escritos en GLSL 450 y compilados a **SPIR-V en tiempo de build**
  (`glslc` o `glslangValidator`), embebidos en el ejecutable: en runtime no hace
  falta compilador ni lectura de archivos.
- Interfaz de ImGui sobre Vulkan en una **pasada propia de una sola muestra**,
  resuelta contra la imagen del swapchain.
- Arranque sin contexto gráfico (`GLFW_NO_API`): la superficie y el swapchain
  los crea el backend.
- `FUNSHI_VULKAN_GPU=<índice>` para forzar una GPU concreta en equipos con
  varias tarjetas o con un driver problemático.

## Estado

El backend está implementado, integrado con la interfaz y con el arranque del
editor, y verificado con un test headless que dibuja y lee píxeles. Queda por
completar la validación visual y la sincronización con el upstream del motor.

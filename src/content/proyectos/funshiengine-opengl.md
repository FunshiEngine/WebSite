---
clave: funshiengine-opengl
nombre: FunshiEngineGL
lema: Motor y editor de juegos en tiempo real sobre OpenGL 3.3 Core
rol: Motor
estado: activo
stack:
  - C++17
  - OpenGL 3.3
  - Dear ImGui
  - ImGuizmo
  - Bullet Physics
  - Assimp
  - CMake
repositorio: https://github.com/FunshiEngine/FunshiEngineOpenGL
version: 0.5.6
licencia: Apache-2.0
color: '#e29a3c'
orden: 2
aspectos:
  - "Editor completo con jerarquía de escenas, inspector, gizmos y consola integrada."
  - "Pipeline moderno único: VBO/VAO con shaders y batch de líneas en GPU."
  - "Sombras con mapa de profundidad y consulta PCF."
  - "Exportador de juegos standalone con runtime sin código de editor."
  - "Mods nativos (.fmod) con API pública versionada y orden topológico."
---

## Qué es

`FunshiEngineGL` es el **motor y editor de juegos en tiempo real** de la
organización: un ejecutable de C++17 que combina ventana y contexto OpenGL
3.3 *core* vía GLFW, una interfaz de editor con Dear ImGui e ImGuizmo, simulación
física con Bullet, carga de modelos con Assimp y un sistema de scripts dinámicos
con recarga en caliente.

Es la implementación de referencia del contrato de render: el mismo motor que
`FunshiEngineCore` define, resuelto aquí sobre OpenGL.

## Qué aporta

- Un único pipeline moderno: los modelos se dibujan con `MeshRenderer`
  (VBO/VAO + shaders) y las líneas con un batch en GPU. No queda modo inmediato
  ni estado fijo.
- Ciclo de vida completo de proyecto: crear, abrir, guardar, renombrar,
  eliminar y **exportar** un juego standalone sin código de editor.
- Interfaz completa: dock, jerarquía de objetos, inspector por componente,
  explorador de archivos, terminal integrada y visor de vistas previas.
- Sistema de mods: paquetes `.fmod` con manifiesto versionado, orden topológico
  de carga y una API pública (`ApiMod`) que solo crece.

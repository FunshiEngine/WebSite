# Plantilla de mensajes de commit

GitHub no ofrece plantillas de mensaje de commit (esa función se retiró), así
que este archivo es la referencia de la convención. La regla completa vive en
`AGENTS.md`; este resumen es para tenerla a mano al commitear.

## Formato

```
<tipo>(<ámbito>): <asunto en imperativo y en minúsculas>
```

El ámbito es opcional. Si se omite, el asunto cierra el encabezado con dos
puntos.

```
fix(contenido): anteponer la base a los enlaces del MDX
docs: documentar la trampa del prefijo /WebSite
```

## Tipos admitidos

| Tipo | Cuándo usarlo |
|---|---|
| `feat` | Funcionalidad nueva. |
| `fix` | Corrección de un error. |
| `refactor` | Reestructuración sin cambiar el comportamiento. |
| `docs` | Solo documentación. |
| `test` | Solo tests o scripts de verificación. |
| `build` | `package.json`, dependencias, scripts de build. |
| `ci` | Workflows de GitHub Actions. |
| `perf` | Mejora de rendimiento. |
| `chore` | Tareas de mantenimiento que no encajan en los anteriores. |

## Ámbitos frecuentes

`contenido`, `componentes`, `estilos`, `enlaces`, `configuracion`, `ci`,
`despliegue`, `documentacion`.

## Reglas

- **Asunto en imperativo y en minúsculas**: "antepone la base a los enlaces",
  no "Anteponiendo la base" ni "Se antepuso la base".
- **Una línea, sin punto final.** Si el cambio necesita explicación, va en el
  cuerpo del mensaje, separado por una línea en blanco.
- **Cuerpo para el porqué, no para el qué.** El qué ya está en el diff.
- **Sin atribuciones**: nada de coautoría, firmas ni menciones a herramientas o
  asistentes. El mensaje describe únicamente el cambio sobre el código.
- **Commits atómicos por tarea.** Si el commit mezcla dos temas sin relación,
  se parte en dos.

## Ejemplo completo

```
fix(enlaces): anteponer la base a los enlaces escritos en el contenido

Astro solo antepone `base` a los recursos que genera, no a los enlaces
escritos a mano, asi que los enlaces del MDX apuntaban a la raiz del
dominio en lugar de al sitio.

Se engancha un plugin mdast de Satteri que reescribe las rutas internas
del contenido antes de generar el HTML, y se corrigen las rutas que se
construian a mano con la barra final duplicada.
```
